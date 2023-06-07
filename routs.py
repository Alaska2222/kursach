import sqlalchemy.exc
from models import Student, Mark, User, Subject, Teacher, Group, engine
from flask import Blueprint, Response, request, jsonify
from sqlalchemy.orm import sessionmaker
from flask_httpauth import HTTPBasicAuth
from sqlalchemy import and_
from flask_bcrypt import Bcrypt
from datetime import datetime
from sqlalchemy.orm.exc import NoResultFound
from schemas import teachers_schema, marks_schema, groups_schema, subjects_schema

student = Blueprint('student', __name__)
teacher = Blueprint('teacher', __name__)

auth = HTTPBasicAuth()
session = sessionmaker(bind=engine)
s = session()
bcrypt = Bcrypt()


@auth.verify_password
def user_auth(username, password):
    try:
        user = s.query(User).filter(User.Username == username).one()
        if user and bcrypt.check_password_hash(user.Password, password):
            return username
    except:
        return None


   

@auth.get_user_roles
def get_user_roles(username):
    user = s.query(User).filter(User.Username == username).first()
    return user.Status

# LOGIN ROUTE
@student.route("/login", methods=["POST"])
@auth.login_required()
def login():
     return Response(status=200, response='You are logged in')


# STUDENT ROUTS
@student.route("/student/<studentId>", methods=["GET"])
@auth.login_required(role=['user'])
def get_student(studentId):
    current = auth.username()
    if current != studentId:
        return Response(status=403, response='Access denied')
    student = s.query(Student).filter(Student.StudentId == studentId).one()
    student_data = {'StudentId': student.StudentId, 'Firstname': student.Firstname,
                    'Surname': student.Surname, 'GroupId': student.GroupId, 
                    'Age': student.Age, 'Email': student.Email, 'Phone': student.Phone}
    return jsonify({"Student": student_data})


@student.route("/student/<studentId>", methods=["PUT"])
@auth.login_required(role=['user'])
def update_student(studentId):
    current = auth.username()
    if current != studentId:
        return Response(status=403, response='Access denied')
    student = s.query(Student).filter(Student.StudentId == studentId).one()
    try:
        StudentId = request.json['StudentId']
        Firstname = request.json['Firstname']
        Password = request.json['Password']
        Surname = request.json['Surname']
        Age = request.json['Age']
        Email = request.json['Email']
        Phone = request.json['Phone']
        hashed_password = bcrypt.generate_password_hash(Password)
        student.StudentId = StudentId
        student.Firstname = Firstname
        student.Password = hashed_password
        student.Surname = Surname
        student.Age = Age
        student.Email = Email
        student.Phone = Phone

        user = s.query(User).filter(User.Username == studentId).one()
        user.Username = StudentId
        user.Password = hashed_password

        s.commit()
    except Exception as e:
        return Response(status=400, response='Error: Invalid data')
    return Response(status=200, response='Success: Student was updated')


@student.route("/students/<int:subjectId>/<studentId>", methods=["GET"])
@auth.login_required(role=["user"])
def get_marks_by_subject(subjectId, studentId):
    current = auth.username()
    if current != studentId:
        return Response(status=403, response='Error: Access denied')
    marks = s.query(Mark).filter(and_(Mark.SubjectId == subjectId, Mark.StudentId == studentId)).all()
    result_set = marks_schema.dump(marks)
    return jsonify(result_set)


@student.route("/students/<studentId>", methods=["GET"])
@auth.login_required(role=["user"])
def get_marks(studentId):
    current = auth.username()
    if current != studentId:
        return Response(status=403, response='Access denied')

    marks = s.query(Mark).filter(Mark.StudentId == studentId).all()
    result_set = marks_schema.dump(marks)
    return jsonify(result_set)


# TEACHER ROUTS
@teacher.route("/teachers/<teacherId>", methods=["GET"])
@auth.login_required(role=['admin'])
def get_teacher(teacherId):
    current = auth.username()
    if current != teacherId:
        return Response(status=403, response='Access denied')
    exist = s.query(Teacher).filter_by(TeacherId=teacherId).first()
    if not exist:
        return Response(status=404, response="Error: Teacher not found")
    teacher = s.query(Teacher).filter(Teacher.TeacherId == teacherId).one()
    teacher_data = {'TeacherId': teacher.TeacherId, 'Firstname': teacher.Firstname,
                    'Surname': teacher.Surname, "SubjectId": teacher.SubjectId,
                    'Age': teacher.Age, 'Email': teacher.Email, 'Phone': teacher.Phone}
    return jsonify({"Teacher": teacher_data})

@teacher.route("/teachers", methods=["GET"])
def get_teachers():
    teachers = s.query(Teacher).all()
    result_set = teachers_schema.dump(teachers)
    return jsonify(result_set)

@teacher.route("/subjects", methods=["GET"])
def get_subjects():
    subjects = s.query(Subject).all()
    result_set = subjects_schema.dump(subjects)
    return jsonify(result_set)

@student.route("/groups", methods=["GET"])
def get_groups():
    groups = s.query(Group).all()
    result_set = groups_schema.dump(groups)
    return jsonify(result_set)


@teacher.route("/groups", methods=["POST"])
def add_student():
    try:
        StudentId = request.json['StudentId']
        Firstname = request.json['Firstname']
        Surname = request.json['Surname']
        Password = request.json['Password']
        GroupId = request.json['GroupId']
        Age = request.json['Age']
        Email = request.json['Email']
        Phone = request.json['Phone']
        hashed_password = bcrypt.generate_password_hash(Password)

        count = s.query(Group).filter(Group.GroupId == GroupId).count()
        group = s.query(Group).filter(Group.GroupId == GroupId).one()

        if count + 1 > group.Quantity:
            return Response(status=409, response="Error: Can't add student to group")

        new_student = Student(StudentId=StudentId, Password=hashed_password, Firstname=Firstname,
                              Surname=Surname, GroupId=GroupId, Age=Age, Email=Email, Phone=Phone)
        new_user = User(Username=StudentId, Password=hashed_password, Status="user")
        s.add(new_student)
        s.add(new_user)
        s.commit()
        return Response(status=200, response='Success: Student was added')

    except Exception as e:
        return Response(status=400, response='Error: Invalid data')


@teacher.route("/student/<studentId>", methods=["DELETE"])
@auth.login_required(role=['user'])
def delete_student(studentId):
    exist = s.query(Student).filter_by(StudentId=studentId).first()
    if not exist:
        return Response(status=404, response="Error: Student not found")
    student_del = s.query(Student).filter(Student.StudentId == studentId).one()
    user = s.query(User).filter(User.Username == studentId).one()

    s.delete(user)
    s.delete(student_del)
    s.commit()
    return Response(status=200, response='Success: Student was deleted')


@teacher.route("/teachers", methods=["POST"])
def add_teacher():
    try:
        TeacherId = request.json['TeacherId']
        Password = request.json['Password']
        Firstname = request.json['Firstname']
        Surname = request.json['Surname']
        SubjectId = request.json['SubjectId']
        Age = request.json['Age']
        Email = request.json['Email']
        Phone = request.json['Phone']
        hashed_password = bcrypt.generate_password_hash(Password)

        new_teacher = Teacher(TeacherId=TeacherId, Password=hashed_password, Firstname=Firstname,
                              Surname=Surname, SubjectId=SubjectId, Age=Age, Email=Email, Phone=Phone)

        new_user = User(Username=TeacherId, Password=hashed_password, Status="admin")

        s.add(new_teacher)
        s.add(new_user)
        s.commit()
        return Response(status=200, response='Success: Teacher was added')

    except Exception as e:
        return Response(status=400, response='Error: Invalid data')





@teacher.route("/teachers/<teacherId>", methods=["PUT"])
@auth.login_required(role=["admin"])
def update_teacher(teacherId):
    current = auth.username()
    if current != teacherId:
        return Response(status=403, response='Access denied')
    teacher = s.query(Teacher).filter(Teacher.TeacherId == teacherId).one()
    user = s.query(User).filter(User.Username == teacherId).one()
    try:
        TeacherId = request.json['TeacherId']
        Password = request.json['Password']
        Firstname = request.json['Firstname']
        Surname = request.json['Surname']
        SubjectId = request.json['SubjectId']
        Age = request.json['Age']
        Email = request.json['Email']
        Phone = request.json['Phone']
        hashed_password = bcrypt.generate_password_hash(Password)

        user.Username = TeacherId
        user.Password = hashed_password

        teacher.TeacherId = TeacherId
        teacher.Password = hashed_password
        teacher.Firstname = Firstname
        teacher.Surname = Surname
        teacher.SubjectId = SubjectId
        teacher.Age = Age
        teacher.Email = Email
        teacher.Phone = Phone

        s.commit()
    except Exception as e:
        return Response(status=400, response='Error: Invalid data')

    return Response(status=200, response='Success: Teacher was updated')


@teacher.route("/teachers/<teacherId>", methods=["DELETE"])
@auth.login_required(role=["admin"])
def delete_teacher(teacherId):
    current = auth.username()
    if current != teacherId:
        return Response(status=403, response='Access denied')
    teacher = s.query(Teacher).filter(Teacher.TeacherId == teacherId).one()
    user = s.query(User).filter(User.Username == teacherId).one()
    s.delete(user)
    s.delete(teacher)

    s.commit()
    return Response(status=200, response='Success: Teacher was deleted')


@teacher.route("/teacher", methods=["POST"])
@auth.login_required(role=["admin"])
def add_mark():
    try:
        MarkId = request.json['MarkId']
        Date = request.json['DateId']
        Value = request.json['Value']
        SubjectId = request.json['SubjectId']
        StudentId = request.json['StudentId']
        TeacherId = request.json['TeacherId']

        current = auth.username()
        if current != TeacherId:
            return Response(status=403, response='Access denied')
        exist = s.query(Student).filter_by(StudentId=StudentId).first()
        if not exist:
            return Response(status=404, response="Error: Student not found")
        new_mark = Mark(MarkId=MarkId, StudentId=StudentId,
                        SubjectId=SubjectId, TeacherId=TeacherId,
                        DateId=datetime.strptime(Date, "%Y-%m-%d"), Value=Value)

        s.add(new_mark)
        s.commit()
        return Response(status=200, response='Success: Mark was added')

    except Exception as e:
        return Response(status=400, response='Error: Invalid data')


@teacher.route("/teacher/<studentId>/<int:markId>", methods=["PUT"])
@auth.login_required(role=["admin"])
def update_mark(studentId, markId):
    exist2 = s.query(Mark).filter_by(MarkId=markId).first()
    if not exist2:
        return Response(status=404, response="Error: Mark not found")
    mark = s.query(Mark).filter(and_(Mark.StudentId == studentId, Mark.MarkId == markId)).one()
    try:
        Date = request.json['DateId']
        Value = request.json['Value']
        SubjectId = request.json['SubjectId']
        TeacherId = request.json['TeacherId']
        current = auth.username()
        if current != TeacherId:
            return Response(status=403, response='Access denied')
        exist1 = s.query(Subject).filter_by(SubjectId=SubjectId).first()
        if not exist1:
            return Response(status=404, response="Error: Subject not found")
        mark.DateId = datetime.strptime(Date, "%Y-%m-%d")
        mark.Value = Value
        mark.SubjectId = SubjectId
        mark.TeacherId = TeacherId

        s.commit()
    except Exception as e:
        return Response(status=400, response='Error: Invalid data')

    return Response(status=200, response='Success: Mark was updated')


@teacher.route("/teacher/<studentId>/<int:markId>/<teacherId>", methods=["DELETE"])
@auth.login_required(role=["admin"])
def delete_mark(studentId, markId, teacherId):
    current = auth.username()
    if current != teacherId:
        return Response(status=403, response='Access denied')
    exist2 = s.query(Mark).filter_by(MarkId=markId).first()
    if not exist2:
        return Response(status=404, response="Error: Mark not found")
    mark = s.query(Mark).filter(and_(Mark.StudentId == studentId, Mark.MarkId == markId)).one()
    s.delete(mark)
    s.commit()
    return Response(status=200, response='Success: Mark was deleted')

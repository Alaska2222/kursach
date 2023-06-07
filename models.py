from sqlalchemy import Integer, String, Column, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import relationship, sessionmaker, scoped_session
import sqlalchemy as sql

engine = create_engine("mysql+pymysql://root:1234@127.0.0.1:3307/student_records", echo=True)
Base = declarative_base()
metadata = Base.metadata


class User(Base):
    __tablename__ = 'user'
    Username = Column(String(45), primary_key=True)
    Password = Column(String(200), nullable=False)
    Status = Column(String(45), nullable=False)


class Student(Base):
    __tablename__ = 'student'
    StudentId = Column(String(45), primary_key=True)
    Firstname = Column(String(45), nullable=False)
    Surname = Column(String(45), nullable=False)
    Password = Column(String(200), nullable=False)
    Age = Column(Integer, nullable=False)
    Email = Column(String(45), nullable=False)
    Phone = Column(String(45), nullable=False)
    GroupId = Column(Integer, ForeignKey("group.GroupId"))

    Group = relationship("Group")


class Group(Base):
    __tablename__ = 'group'
    GroupId = Column(Integer, primary_key=True)
    Quantity = Column(Integer, nullable=False)


class Teacher(Base):
    __tablename__ = "teacher"
    TeacherId = Column(String(45), primary_key=True)
    Password = Column(String(200), nullable=False)
    Firstname = Column(String(45), nullable=False)
    Surname = Column(String(45), nullable=False)
    Age = Column(Integer, nullable=False)
    Email = Column(String(45), nullable=False)
    Phone = Column(String(45), nullable=False)
    SubjectId = Column(String(50), ForeignKey("subject.SubjectId"))

    Subject = relationship("Subject")


class Mark(Base):
    __tablename__ = "mark"
    MarkId = Column(Integer, primary_key=True)
    StudentId = Column(String(45), ForeignKey("student.StudentId"))
    SubjectId = Column(String(50), ForeignKey("subject.SubjectId"))
    TeacherId = Column(String(45), ForeignKey("teacher.TeacherId"))
    DateId = Column(sql.DATE, nullable=False)
    Value = Column(sql.DECIMAL, nullable=False)

    Teacher = relationship("Teacher")
    Student = relationship("Student")
    Subject = relationship("Subject")


class Subject(Base):
    __tablename__ = "subject"
    SubjectId = Column(String(50), primary_key=True)
    Name = Column(String(150), nullable=False)

#Base.metadata.create_all(engine)

from marshmallow import Schema


class StudentSchema(Schema):
    class Meta:
        fields = ('StudentId', 'Firstname', 'Surname','Age','Email','Phone', 'GroupId')

class MarkSchema(Schema):
    class Meta:
        fields = ('MarkId', 'StudentId', 'SubjectId', 'TeacherId', 'DateId', 'Value')


class TeacherSchema(Schema):
    class Meta:
        fields = ('TeacherId', 'Firstname', 'Surname','Age','Email','Phone', 'SubjectId')
        

class GroupSchema(Schema):
    class Meta:
        fields = ('GroupId', 'Quantity')


class SubjectSchema(Schema):
    class Meta:
        fields = ('SubjectId', 'Name')


teachers_schema = TeacherSchema(many=True)
marks_schema = MarkSchema(many=True)
groups_schema = GroupSchema(many=True)
subjects_schema = SubjectSchema(many=True)

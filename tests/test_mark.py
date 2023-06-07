from unittest import TestCase
from base64 import b64encode
import unittest

from app import app
from routs import s, bcrypt
import json

app.testing = True
client = app.test_client()


class BaseTestCase(TestCase):
    client = app.test_client()

    def setUp(self):
        super().setUp()
        self.admin_data = {
            "TeacherId": "new_teacher",
            "Firstname": "Alex",
            "Surname": "John",
            "Password": "qwerty",
            "SubjectId": 1
        }
        self.wrong_admin_data = {
            "TeacherId": 23,
            "Firstname": "Alex",
            "Surname": "John",
            "Password": "qwerty",
            "SubjectId": "smth"
        }

        self.user_data = {
            "StudentId": "new_student",
            "Firstname": "Ann",
            "Surname": "Ganusia",
            "Password": "qwerty",
            "GroupId": 216
        }

        self.wrong_user_data = {
            "StudentId": "new_student",
            "Firstname": "Ann",
            "Surname": "Ganusia",
            "Password": "qwerty",
            "GroupId": "smth"
        }

        self.wrong_user_data1 = {
            "StudentId": "new_student",
            "Firstname": "Ann",
            "Surname": "Ganusia",
            "Password": "qwerty",
            "GroupId": 214
        }
        self.mark_data = {
            "MarkId": 7,
            "StudentId": "Alaska",
            "SubjectId": 1,
            "TeacherId": "romanML",
            "Date": "2022-10-01",
            "Value": 4.5
        }

        self.wrong_mark_data = {
            "MarkId": 8,
            "StudentId": "Alaska",
            "SubjectId": 1,
            "TeacherId": "romanML1",
            "Date": "2022-10-01",
            "Value": 4.5
        }

        self.wrong_mark_data1 = {
            "MarkId": 7,
            "StudentId": "Alaska",
            "SubjectId": "smth",
            "TeacherId": "romanML",
            "Date": "2022-10-01",
            "Value": "string"
        }

        self.wrong_mark_data2 = {
            "MarkId": 8,
            "StudentId": "Alaska11",
            "SubjectId": 1,
            "TeacherId": "romanML",
            "Date": "2022-10-01",
            "Value": 4.5
        }
        self.user_data_hashed = {
            **self.user_data,
            "Password": bcrypt.generate_password_hash(bytes(self.user_data['Password'], 'utf-8'))
        }

        self.admin_data_hashed = {
            **self.admin_data,
            "Password": bcrypt.generate_password_hash(bytes(self.user_data['Password'], 'utf-8'))
        }

        self.admin_auth = b64encode(b"romanML:qwerty").decode('utf-8')
        self.new_admin_auth = b64encode(b"new_teacher:qwerty").decode('utf-8')
        self.user_auth = b64encode(b"Alaska:qwerty1234").decode('utf-8')

    def tearDown(self):
        self.close_session()

    def close_session(self):
        s.close()

    def get_auth_headers(self, credentials):
        return {"Authorization": f"Basic {credentials}"}

class TestMarks(BaseTestCase):
    def test_get_student_marks(self):
        response = self.client.get('/students/Alaska',
                                   headers=self.get_auth_headers(self.user_auth))
        self.assertEqual(response.status_code, 200)

    def test_get_wrong_student_marks(self):
        response = self.client.get('/students/Alaska1',
                                   headers=self.get_auth_headers(self.user_auth))
        self.assertEqual(response.status_code, 403)
    def test_get_student_marks_by_subject(self):
        response = self.client.get('/students/1/Alaska',
                                   headers=self.get_auth_headers(self.user_auth))
        self.assertEqual(response.status_code, 200)

    def test_get_wrong_student_marks_by_subject(self):
        response = self.client.get('/students/1/Alaska1',
                                   headers=self.get_auth_headers(self.user_auth))
        self.assertEqual(response.status_code, 403)



    def test_create_mark(self):
        response = self.client.post('/teacher', json=self.mark_data,
                                    headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 200)

    def test_wrong_create_mark(self):
        response = self.client.post('/teacher', json=self.wrong_mark_data,
                                    headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 403)

    def test_not_found_create_mark(self):
        response = self.client.post('/teacher', json=self.wrong_mark_data2,
                                    headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 404)

    def test_invalid_create_mark(self):
        response = self.client.post('/teacher', json=self.wrong_mark_data1,
                                    headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 400)



    def test_update_mark(self):
        response = self.client.put('/teacher/Alaska/1', data=json.dumps({
            "MarkId": 1,
            "StudentId": "Alaska",
            "SubjectId": 1,
            "TeacherId": "romanML",
            "Date": "2022-10-01",
            "Value": 10
        }), content_type='application/json', headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 200)

    def test_not_found_update_mark(self):
        response = self.client.put('/teacher/Alaska/100', data=json.dumps({
            "MarkId": 100,
            "StudentId": "Alaska",
            "SubjectId": 1,
            "TeacherId": "romanML",
            "Date": "2022-10-01",
            "Value": 10
        }), content_type='application/json', headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 404)

    def test_not_found1_update_mark(self):
        response = self.client.put('/teacher/Alaska/1', data=json.dumps({
            "MarkId": 1,
            "StudentId": "Alaska",
            "SubjectId": 13,
            "TeacherId": "romanML",
            "Date": "2022-10-01",
            "Value": 10
        }), content_type='application/json', headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 404)

    def test_wrong_update_mark(self):
        response = self.client.put('/teacher/Alaska/1', data=json.dumps({
            "MarkId": 1,
            "StudentId": "Alaska",
            "SubjectId": 1,
            "TeacherId": "romanML1",
            "Date": "2022-10-01",
            "Value": 10
        }), content_type='application/json', headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 403)

    def test_invalid_update_mark(self):
        response = self.client.put('/teacher/Alaska/1', data=json.dumps({
            "MarkId": 1,
            "StudentId": "Alaska",
            "SubjectId": 1,
            "TeacherId": "romanML",
            "Date": "2022-10-01",
            "Value": "smth"
        }), content_type='application/json', headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 400)

    def test_delete_mark(self):
        response = self.client.delete('/teacher/Alaska/7/romanML',
                                      headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 200)

    def test_delete_mark(self):
        response = self.client.delete('/teacher/Alaska/7/romanML',
                                      headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 200)

    def test_wrong_delete_mark(self):
        response = self.client.delete('/teacher/Alaska/7/romanML1',
                                      headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 403)

    def test_not_found_delete_mark(self):
        response = self.client.delete('/teacher/Alaska/8/romanML',
                                      headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 404)

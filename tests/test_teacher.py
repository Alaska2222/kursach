from test_mark import *
from test_student import *

class TestTeacher(BaseTestCase):
    def test_get_teachers(self):
        response = self.client.get('/teachers')
        self.assertEqual(response.status_code, 200)



    def test_get_teachers_by_subject(self):
        response = self.client.get('/teachers/1')
        self.assertEqual(response.status_code, 200)

    def test_not_found_get_teachers_by_subject(self):
        response = self.client.get('/teachers/13')
        self.assertEqual(response.status_code, 404)

    def test_get_teacher_by_id(self):
        response = self.client.get('/teachers/romanML')
        self.assertEqual(response.status_code, 200)

    def test_not_found_get_teacher_by_id(self):
        response = self.client.get('/teachers/teacher')
        self.assertEqual(response.status_code, 404)

    def test_create_teacher(self):
        response = self.client.post('/teachers', json=self.admin_data)
        self.assertEqual(response.status_code, 200)

    def test_invalid_create_teacher(self):
        response = self.client.post('/teachers', json=self.wrong_admin_data)
        self.assertEqual(response.status_code, 400)

    def test_update_teacher(self):
        response = self.client.put('/teachers/romanML', data=json.dumps({
            "TeacherId": "romanML",
            "Firstname": "Romam",
            "Surname": "Melnyk",
            "Password": "qwerty",
            "SubjectId": 1
        }), content_type='application/json', headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 200)


    def test_wrong_update_teacher(self):
        response = self.client.put('/teachers/romanML1', data=json.dumps({
            "TeacherId": "romanML1",
            "Firstname": "Romam",
            "Surname": "Melnyk",
            "Password": "qwerty",
            "SubjectId": 1
        }), content_type='application/json', headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 403)

    def test_invalid_update_teacher(self):
        response = self.client.put('/teachers/romanML', data=json.dumps({
            "StudentId": "romanML",
            "Firstname": "Romam",
            "Surname": "Melnyk",
            "Password": "qwerty",
            "SubjectId": "smth"
        }), content_type='application/json', headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 400)

    def test_delete_teacher(self):
        response = self.client.delete('/teachers/new_teacher',
                                      headers=self.get_auth_headers(self.new_admin_auth))
        self.assertEqual(response.status_code, 200)

    def test_wrong_delete_teacher(self):
        response = self.client.delete('/teachers/new_teacher1',
                                      headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 403)
from test_mark import *

class TestStudent(BaseTestCase):
    def test_get_student(self):
        response = self.client.get('/student/Alaska',
                                   headers=self.get_auth_headers(self.user_auth))
        self.assertEqual(response.status_code, 200)

    def test_get_student_wrong(self):
        response = self.client.get('/student/Alaska1',
                                   headers=self.get_auth_headers(self.user_auth))
        self.assertEqual(response.status_code, 403)

    def test_create_student(self):
        response = self.client.post('/groups', json=self.user_data,
                                    headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 200)

    def test_wrong_create_student(self):
        response = self.client.post('/groups', json=self.user_data,
                                    headers=self.get_auth_headers(self.user_auth))
        self.assertEqual(response.status_code, 403)

    def test_invalid_create_student(self):
        response = self.client.post('/groups', json=self.wrong_user_data,
                                    headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 400)

    def test_409_create_student(self):
        response = self.client.post('/groups', json=self.wrong_user_data1,
                                    headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 409)

    def test_update_student(self):
        response = self.client.put('/student/Alaska', data=json.dumps({
            "StudentId": "Alaska",
            "Firstname": "Kornelia",
            "Surname": "Drozd",
            "Password": "qwerty1234",
            "GroupId": 216
        }), content_type='application/json', headers=self.get_auth_headers(self.user_auth))
        self.assertEqual(response.status_code, 200)

    def test_wrong_update_student(self):
        response = self.client.put('/student/Alaska1', data=json.dumps({
            "StudentId": "Alaska1",
            "Firstname": "Kornelia",
            "Surname": "Drozd",
            "Password": "qwerty1234",
            "GroupId": 216
        }), content_type='application/json', headers=self.get_auth_headers(self.user_auth))
        self.assertEqual(response.status_code, 403)

    def test_wrong_data_update_student(self):
        response = self.client.put('/student/Alaska', data=json.dumps({

            "Firstname": "Kornelia",
            "Surname": "Drozd",
            "Password": "qwerty1234",
            "GroupId": "str"
        }), content_type='application/json', headers=self.get_auth_headers(self.user_auth))
        self.assertEqual(response.status_code, 400)

    def test_delete_student(self):
        response = self.client.delete('/student/new_student',
                                      headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 200)

    def test_wrong_delete_student(self):
        response = self.client.delete('/student/new_student',
                                      headers=self.get_auth_headers(self.user_auth))
        self.assertEqual(response.status_code, 403)

    def test_not_found_delete_student(self):
        response = self.client.delete('/student/student',
                                      headers=self.get_auth_headers(self.admin_auth))
        self.assertEqual(response.status_code, 404)

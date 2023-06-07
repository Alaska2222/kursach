const username = localStorage.getItem('username');
const password = localStorage.getItem('password');

const table = document.querySelector(".admin-info");
fetch(`http://127.0.0.1:5000/teachers/${username}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + btoa(username + ':' + password)
          }
        }).then((data)=>{
            return data.json();
        }).then((objectData)=>{
            new_date = JSON.stringify(objectData)
            const finale_data = JSON.parse(new_date);
            document.querySelector("#fname").textContent = finale_data.Teacher.Firstname;
            document.querySelector("#sname").textContent = finale_data.Teacher.Surname;
            document.querySelector("#age").textContent = finale_data.Teacher.Age;
            document.querySelector("#subject").textContent = finale_data.Teacher.SubjectId;
            document.querySelector("#phone").textContent = finale_data.Teacher.Phone;
            document.querySelector("#email").textContent = finale_data.Teacher.Email;
            
        })
        .catch(error => console.error(error));



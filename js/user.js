const username = localStorage.getItem('username');
const password = localStorage.getItem('password');
  
const table = document.querySelector(".user-info");
fetch(`http://127.0.0.1:5000/student/${username}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Basic ' + btoa(username + ':' + password)
          }
        }).then((data)=>{
            return data.json();
        }).then((objectData)=>{
            new_date = JSON.stringify(objectData)
            const finale_data = JSON.parse(new_date);
            document.querySelector("#fname").textContent = finale_data.Student.Firstname;
            document.querySelector("#sname").textContent = finale_data.Student.Surname;
            document.querySelector("#age").textContent = finale_data.Student.Age;
            document.querySelector("#group").textContent = finale_data.Student.GroupId;
            document.querySelector("#phone").textContent = finale_data.Student.Phone;
            document.querySelector("#email").textContent = finale_data.Student.Email;
            
        })
        .catch(error => console.error(error));



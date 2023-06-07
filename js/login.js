function isAdmin(username) {
  return fetch('http://127.0.0.1:5000/teachers')
    .then((data) => {
      return data.json();
    })
    .then((objectData) => {
      const list = objectData.map((item) => item.TeacherId);
      if (list.includes(username)) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

async function checkRole(username, role) {
  if (role === "admin" && !(await isAdmin(username))) {
    alert("You have chosen the wrong role!");
    return;
  } else if (role === "user" && await isAdmin(username)) {
    alert("You have chosen the wrong role!");
    return;
  }
}


document.querySelector('#login-btn').onclick = function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  let role = document.querySelectorAll(".role");
  for (let i = 0; i < role.length; i++) {
    if (role[i].checked) {
      role = role[i].value;
      break;
    }
  }

  isAdmin(username)
    .then((isAdmin) => {
      if ((role === "admin" && !isAdmin) || (role === "user" && isAdmin)) {
        alert("You have chosen the wrong role!");
        return;
      } else {
        fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(username + ':' + password)
          }
        }).then(response => {
          if (response.ok) {
            localStorage.setItem('username', username)
            localStorage.setItem('password', password)
            localStorage.setItem('role', role)
            if(role == "admin"){
              window.location.href = '/html/admin-page.html'; 
            } else{
              window.location.href = '/html/user-page.html'; 
            }
      
          } else if (response.status === 401) {
            alert("Wrong credentials!");
            return;
          }
        }).catch(error => console.error(error));
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
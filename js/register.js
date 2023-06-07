
function ajax(url, method, data, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.responseText);
    }
  };
  xhttp.open(method, url, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(data));
}

function hasNumbers(str) {
  var regex = /\d/;
  return regex.test(str);
}

function validateEmail(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePhoneNumber(phoneNumber) {
  const regex = /^\+380\d{9}$/;
  
  if (regex.test(phoneNumber)) {
    return true;
  } else {
    return false;
  }
}

var subjectsAdded = false;
var groupsAdded = false;

document.querySelector('#user').onclick = function() {
document.getElementById('show-subject').style.display = 'none';
document.getElementById('show-group').style.display = 'block';

if (!groupsAdded) {
    var url_one = 'http://127.0.0.1:5000/groups';

    function AddGroup(groupId) {
      var groupLink = document.createElement('a');
      groupLink.innerHTML = groupId;
      groupLink.addEventListener('click', function() {
      document.getElementById('group').value = groupId;
      document.getElementById('subject').value = '';
      });
      var dropdownList = document.querySelectorAll('.dropdown-content')[0];
      dropdownList.appendChild(groupLink);
    }

    ajax(url_one, 'GET', {}, function(data) {
      var objectData = JSON.parse(data);
      for (var i = 0; i < objectData.length; i++) {
        AddGroup(objectData[i].GroupId);
      }
      groupsAdded = true;
    });
  }
};

  document.querySelector('#admin').onclick = function() {
  document.getElementById('show-subject').style.display = 'block';
  document.getElementById('show-group').style.display = 'none';

  if (!subjectsAdded) {
    var url = 'http://127.0.0.1:5000/subjects';

    function AddSubject(subjectId) {
      var sbjLink = document.createElement('a');
      sbjLink.innerHTML = subjectId;
      sbjLink.addEventListener('click', function() {
      document.getElementById('subject').value = subjectId;
      document.getElementById('group').value = '';
      });
      var dropdownList = document.querySelectorAll('.dropdown-content')[1];
      dropdownList.appendChild(sbjLink);
    }

    ajax(url, 'GET', {}, function(data) {
      var objectData = JSON.parse(data);
      for (var i = 0; i < objectData.length; i++) {
        AddSubject(objectData[i].SubjectId);
      }
      subjectsAdded = true;
    });
  }
};

document.querySelector('#registrate-btn').onclick = function(event) {
  event.preventDefault();
  var username = document.getElementById('username').value;
  var name = document.getElementById('name').value;
  var surname = document.getElementById('surname').value;
  var password = document.getElementById('password').value;
  var cpassword = document.getElementById('cpassword').value;
  var age = document.getElementById('age').value;
  var email = document.getElementById('email').value;
  var phone = document.getElementById('phone').value;
  var s_g = '';
  var data = {};

  if(!username || !name || !surname || !password || !cpassword || !age || !email || !phone){
    alert('Please input data');
    return;
  }
  if(cpassword !== password){
    alert("Your passwords does not match");
    return;
  }
  if (age<17){
    alert("You have entered wrong age");
    return;
  }
  if (hasNumbers(name)|| hasNumbers(surname) ){
    alert("Your initials should not contain numbers");
    return;
  }
  if(!validatePhoneNumber(phone)){
    alert("Your phone number is wrong. It should be like +380xxxxxxxxx");
    return;
  }
  if(!validateEmail(email)){
    alert("Your email is wrong. It should be like xxxxx@xxx.xx");
    return;
  }
  if (groupsAdded) {
    s_g = document.getElementById('group').value;
    if (!s_g) {
      alert('Please select a group.');
      return;
    }
    data = {
      StudentId: username,
      Firstname: name,
      Surname: surname,
      Password: password,
      GroupId: Number(s_g),
      Email: email,
      Age: Number(age),
      Phone: phone,
    };
    ajax('http://127.0.0.1:5000/groups', 'POST', data, function(response) {
      console.log(response);
      window.location.href = "/html/login-page.html"; 
    });
  } else if (subjectsAdded) {
    s_g = document.getElementById('subject').value;
    if(!username || !name || !surname || !password || !cpassword || !age || !email || !phone){
      alert('Please input data');
      return;
    }
    if(cpassword !== password){
      alert("Your passwords does not match");
      return;
    }
    if (age<20){
      alert("You have entered wrong age");
      return;
    }
    if (hasNumbers(name)|| hasNumbers(surname) ){
      alert("Your initials should not contain numbers");
      return;
    }
    if(!validatePhoneNumber(phone)){
      alert("Your phone number is wrong. It should be like +380xxxxxxxxx");
      return;
    }
    if(!validateEmail(email)){
      alert("Your email is wrong. It should be like xxxxx@xxx.xx");
      return;
    }
    if (!s_g) {
      alert('Please select a subject.');
      return;
    }
    data = {
      TeacherId: username,
      Password: password,
      Firstname: name,
      Surname: surname,
      Email: email,
      Age: Number(age),
      Phone: phone,
      SubjectId: s_g,
    };
    ajax('http://127.0.0.1:5000/teachers', 'POST', data, function(response) {
      console.log(response);
      window.location.href = "/html/login-page.html"; 
    });
  }
  
}

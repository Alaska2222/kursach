const username = localStorage.getItem('username');
const password = localStorage.getItem('password');

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

const submitButton = document.getElementById('submit');
submitButton.addEventListener('click', () => {
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const nameInput = document.getElementById('name').value;
    const surnameInput = document.getElementById('surname').value;
    const ageInput = document.getElementById('age').value;
    const phoneInput = document.getElementById('phone').value;
    const emailInput = document.getElementById('email').value;
    if(!usernameInput || !nameInput || !surnameInput || !passwordInput|| !ageInput || !emailInput || !phoneInput){
        alert('Please input data');
        return;
      }
      if (ageInput<17){
        alert("You have entered wrong age");
        return;
      }
      if (hasNumbers(nameInput)|| hasNumbers(surnameInput) ){
        alert("Your initials should not contain numbers");
        return;
      }
      if(!validatePhoneNumber(phoneInput)){
        alert("Your phone number is wrong. It should be like +380xxxxxxxxx");
        return;
      }
      if(!validateEmail(emailInput)){
        alert("Your email is wrong. It should be like xxxxx@xxx.xx");
        return;
      }

  fetch(`http://127.0.0.1:5000/student/${username}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json'
    },body:JSON.stringify({
        "StudentId": usernameInput,
        "Firstname": nameInput,
        "Surname": surnameInput,
        "Password": passwordInput,
        "Email": emailInput,
        "Age": ageInput,
        "Phone": phoneInput
      })
  })
 .then(()=>{
    console.log('Success');
    localStorage.clear();
    window.location.href = "/html/login-page.html";
  })
});

const cancelButton = document.getElementById('cancel');

cancelButton.addEventListener('click', () => {
    window.location.href = "/html/user-page.html";
});

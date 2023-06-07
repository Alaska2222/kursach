const requestUrl = 'http://127.0.0.1:5000/teachers'

function AddTeacher(uname, fname, sname, age, sbj, email, phone){
    var teacherDiv = document.createElement('div');
    teacherDiv.className = 'teacher';
    
    var keyDiv = document.createElement('div');
    keyDiv.className = 'key';
    
    var valueDiv = document.createElement('div');
    valueDiv.className = 'value';

    var nameHeader = document.createElement('h3');
    nameHeader.innerHTML = fname + " " + sname;
    
    var unameK = document.createElement('p');
    unameK.innerHTML = 'Username:';
    var ageK = document.createElement('p');
    ageK.innerHTML = 'Age:';
    var sbjK = document.createElement('p');
    sbjK.innerHTML = 'Subject:';
    var emailK = document.createElement('p');
    emailK.innerHTML = 'E-mail:';
    var phoneK = document.createElement('p');
    phoneK.innerHTML = 'Mobile Phone:';
    
    var unameV = document.createElement('p');
    unameV.innerHTML = uname;
    var ageV = document.createElement('p');
    ageV.innerHTML = age;
    var sbjV = document.createElement('p');
    sbjV.innerHTML = sbj;
    var emailV = document.createElement('p');
    emailV.innerHTML = email;
    var phoneV = document.createElement('p');
    phoneV.innerHTML = phone;

    keyDiv.appendChild(nameHeader);
    keyDiv.appendChild(unameK);
    keyDiv.appendChild(ageK);
    keyDiv.appendChild(sbjK);
    keyDiv.appendChild(emailK);
    keyDiv.appendChild(phoneK);

    valueDiv.appendChild(unameV);
    valueDiv.appendChild(ageV);
    valueDiv.appendChild(sbjV);
    valueDiv.appendChild(emailV);
    valueDiv.appendChild(phoneV);
    
    teacherDiv.appendChild(keyDiv);
    teacherDiv.appendChild(valueDiv);
    
    var teachersList = document.querySelector('.teacher-list');
    teachersList.appendChild(teacherDiv);
    
    };

fetch(requestUrl).then((data)=>{
    return data.json();
}).then((objectData)=>{
    for (let i = 0; i < objectData.length; i++) {
        AddTeacher(objectData[i].TeacherId, objectData[i].Firstname,
         objectData[i].Surname, objectData[i].Age, objectData[i].SubjectId
        ,objectData[i].Email, objectData[i].Phone);
    }
    
})




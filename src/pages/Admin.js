import React, { useState, useEffect } from 'react';
import BioInput from '../components/BioInput';
import profile from "../assets/nupl.jpg"
import Button from '../components/Button';
import DeleteButton from '../components/DeleteButton';
import { AnimatedPage } from '../components/AnimatedPage';
import Swal from "sweetalert2"
import TableMui from '../components/TableMui';
import { toast, ToastContainer } from 'react-toastify';

export default function Admin(){

    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [age, setAge] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [subject, setSubject] = useState('')
    const [isDisabled, setIsDisabled] = useState(true)
    const [records, setRecord] = useState([])
    const [otherrecords, setOtherRecord] = useState([])

    useEffect(() => {
      const fetchData = async () => {
        try {
        
          const subjectsResponse = await fetch("http://127.0.0.1:5000/subjects", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          const subjectsData = await subjectsResponse.json()
          setOtherRecord(subjectsData);
          const token = window.localStorage.getItem('token')
          const decodedToken = atob(token);
          const [username] = decodedToken.split(':');
          const headers = new Headers();
          headers.set('Authorization', `Basic ${token}`)
          headers.set('content-type', 'application/json');
          const teacherResponse = await fetch(`http://127.0.0.1:5000/teachers/${username}`, {
            method: 'GET',
            headers,
          });
    
          if (!teacherResponse.ok) {
            throw new Error('Network response was not ok');
          }
    
          const teacherData = await teacherResponse.json();
    
          const { Firstname, Surname, Age, Email, Phone, SubjectId } = teacherData.Teacher;
    
          setName(Firstname);
          setSurname(Surname);
          setAge(Age);
          setEmail(Email);
          setPhone(Phone);
          setSubject(SubjectId);
          setRecord(teacherData);
    
          document.title = "Admin Profile";
        } catch (error) {
          console.error('Error:', error);
        }
      };
    
      fetchData();
    }, []);
    
    const handleUpdateClick = () => {
        if (isDisabled) {
          setIsDisabled(false);
        } else {
          if (!validateForm()) {
            return;
          }
          const updatedTeacher = {
            Firstname: name,
            Surname: surname,
            Email: email,
            Age: Number(age),
            Phone: phone,
            SubjectId: subject,
          };
          const token = window.localStorage.getItem('token')
          const decodedToken = atob(token);
          const [username] = decodedToken.split(':');
          const headers = new Headers();
          headers.set('Authorization', `Basic ${token}`)
          headers.set('content-type', 'application/json');
          fetch(`http://127.0.0.1:5000/teachers/${username}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(updatedTeacher),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }else{
                setIsDisabled(true);
                Swal.fire(
                    'Success!',
                    'Teacher was updated!',
                    'success'
                  )
              }
              return response.json();
            })
            .catch((error) => {
              console.error('Error:', error);
            });
         
         
        }
      };
      
      const [invalidFields, setInvalidFields] = useState([]);
      const validateForm = () => {
        const invalidFields = [];
    
        if (!name) {
          invalidFields.push('name');
          toast.error("Fill out name ");
        }
    
        if (!surname) {
          invalidFields.push('surname');
          toast.error("Fill out surname ");
        }
    
        if (!age) {
          invalidFields.push('age');
          toast.error("Fill out age ");
        }
    
        if (!email) {
          invalidFields.push('email');
          toast.error("Fill out email ");
        }
    
        if (!phone) {
          invalidFields.push('phone');
          toast.error("Fill out phone ");
        }
    
        if (age < 18) {
          invalidFields.push('age');
          toast.error("Age should be a under 18");
        }
        if (/\d/.test(name) || /[^a-zA-Z]/.test(name)) {
          invalidFields.push('name');
          toast.error("Name should not contain numbers or special characters");
        }
    
        if (/\d/.test(surname) || /[^a-zA-Z]/.test(surname)) {
          invalidFields.push('surname');
          toast.error("Surame should not contain numbers or special characters");
        }
    
        if (!isValidEmail(email)) {
          invalidFields.push('email');
          toast.error("Invalid email input");
        }
    
        if (!isValidPhone(phone)) {
          invalidFields.push('phone');
          toast.error("Invalid phone input");
        }
    
        setInvalidFields(invalidFields);
        return invalidFields.length === 0;
      };

      const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };
    
      const isValidPhone = (phone) => {
        const phoneRegex = /^\+\d{1,3}\d{9}$/;
        return phoneRegex.test(phone);
      };
    
      const isFieldInvalid = (fieldName) => {
        return invalidFields.includes(fieldName);
      };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (!isDisabled) {
          if (name === 'subject') {
            setSubject(value);
          } else {

            switch (name) {
              case 'name':
                setName(value);
                break;
              case 'surname':
                setSurname(value);
                break;
              case 'age':
                setAge(value);
                break;
              case 'email':
                setEmail(value);
                break;
              case 'phone':
                setPhone(value);
                break;
              default:
                break;
            }
          }
        }
      };
      
      const options = otherrecords.map((record) => (
        <option key={record.SubjectId} value={record.SubjectId}>
          {record.SubjectId}
        </option>
      ));
      const token = window.localStorage.getItem('token')
      const decodedToken = atob(token);
      const [username] = decodedToken.split(':');
      return (
        <AnimatedPage>
         <ToastContainer autoClose={1000}/>
          <h1 id="profile-title">
            <span className="highlight">Welcome to the, admin profile!</span>
          </h1>
          <div className="wrapper-admin">
            <div className="bio-block">
              <img id="admin-logo" src={profile} alt="profile logo" />
              <h3>{username}</h3>
              <div className="inputs-block">
                <BioInput
                  Label="Name"
                  Name={name}
                  Type="text"
                  Id="name"
                  Disabled={isDisabled}
                  onClick={handleInputChange}
                  invalid={isFieldInvalid('name')}
                />
                <BioInput
                  Label="Surname"
                  Name={surname}
                  Type="text"
                  Id="surname"
                  Disabled={isDisabled}
                  onClick={handleInputChange}
                  invalid={isFieldInvalid('surname')}
                />
            
                <BioInput
                  Label="Age"
                  Name={age}
                  Type="number"
                  Id="age"
                  Disabled={isDisabled}
                  onClick={handleInputChange}
                  invalid={isFieldInvalid('age')}
                />
                <BioInput
                  Label="Phone"
                  Name={phone}
                  Type="tel"
                  Id="phone"
                  Disabled={isDisabled}
                  onClick={handleInputChange}
                  invalid={isFieldInvalid('phone')}
                />
                <BioInput
                  Label="Email"
                  Name={email}
                  Type="email"
                  Id="email"
                  Disabled={isDisabled}
                  onClick={handleInputChange}
                  invalid={isFieldInvalid('email')}
                />
                {isDisabled ? (
                  <BioInput
                    Label="Subject"
                    Name={subject}
                    Type="text"
                    Id="subject"
                    Disabled={isDisabled}
                    onClick={handleInputChange}
                  />
                ) : (
                  <select
                    name="subject"
                    id="subject"
                    value={subject}
                    onChange={handleInputChange}
                  >
                    {options}
                  </select>
                )}
              </div>
      
              <div className="button-group">
                <Button Id="update-btn" Title="Update" onClick={handleUpdateClick} />
                <DeleteButton username={username} />
              </div>
            </div>
            <div className="journal-block">
              <div className="table-nui-container">
                <TableMui />
              </div>
            </div>
          </div>
        </AnimatedPage>
      );
}
import React, { useState, useEffect, useMemo } from 'react';
import BioInput from '../components/BioInput';
import TableItem from '../components/TableItem';
import Button from '../components/Button';
import profile from "../assets/user.png"
import Piechart from '../components/PieChart';
import Linechart from '../components/LineChart';
import DeleteButton from '../components/DeleteButton';
import "../styles/profile.css"
import { AnimatedPage } from '../components/AnimatedPage';
import { toast, ToastContainer } from 'react-toastify';
import Swal from "sweetalert2"

export default function Profile(){
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [age, setAge] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [group, setGroup] = useState('')
    const [isDisabled, setIsDisabled] = useState(true)
    let [otherrecords, setOtherRecord] = useState([])
    let [records, setRecord] = useState([])
    const token = window.localStorage.getItem('token')
    const decodedToken = atob(token);
    const [username] = decodedToken.split(':');

    
    useEffect(() => {
      const fetchGroups = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/groups");
          const data = await response.json();
          setOtherRecord(data);
        } catch (error) {
          console.error("Error:", error);
        }
      };
   
      const fetchData = async () => {
        try {
          const headers = new Headers();
          headers.set('Authorization', `Basic ${token}`)
          headers.set('content-type', 'application/json');
          const response = await fetch(`http://127.0.0.1:5000/student/${username}`, {
            method: "GET",
            headers,
          });
    
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
    
          const data = await response.json();
    
          const { Firstname, Surname, Age, Email, Phone, GroupId } = data.Student;
    
          setName(Firstname);
          setSurname(Surname);
          setAge(Age);
          setEmail(Email);
          setPhone(Phone);
          setGroup(GroupId);
    
          document.title = "User Profile";

          const response2 = await fetch(`http://127.0.0.1:5000/students/${username}`, {
            method: "GET",
            headers,
          });
    
          const data2 = await response2.json();
          setRecord(data2);
        } catch (error) {
          console.error("Error:", error);
        }
      };
    
      fetchGroups();
      fetchData();
    }, []);
    
    const calculateAverageByTeacher = (records) => {
        const averages = {};
      
        records.forEach((record) => {
          const { TeacherId, Value } = record;
      
          if (!averages[TeacherId]) {
            averages[TeacherId] = { sum: 0, count: 0 };
          }
      
          averages[TeacherId].sum += parseInt(Value);
          averages[TeacherId].count++;
        });
      
        for (let teacherId in averages) {
          averages[teacherId].average = parseInt(averages[teacherId].sum) / parseInt(averages[teacherId].count);
        }
        
        let arr = []
        Object.keys(averages).map((TeacherId) => {
            arr.push(averages[TeacherId].average)
        });
        
        const labels = Object.keys(averages);
        let labels_new = []
        for (let i = 0; i < labels.length; i++) {
            if (Number.isInteger(arr[i])) {
                labels_new.push(`${labels[i]}(${arr[i]})`);
              } else {
                labels_new.push(`${labels[i]}(${arr[i].toFixed(2)})`);
              }
          }
        return [labels_new, arr];
      };

      const [labels, arr] = calculateAverageByTeacher(records);

      const [sortColumn, setSortColumn] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedRecords = useMemo(() => {
    return records.sort((a, b) => {
      const columnA = a[sortColumn];
      const columnB = b[sortColumn];
      const direction = sortDirection === "asc" ? 1 : -1;
      if (columnA < columnB) {
        return -1 * direction;
      }
      if (columnA > columnB) {
        return 1 * direction;
      }
      return 0;
    });
  }, [records, sortColumn, sortDirection]);

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

  const handleUpdateClick = () => {
    if (isDisabled) {
      setIsDisabled(false);
    } else {
      if (!validateForm()) {
        return;
      }
      const updatedStudent = {
        Firstname: name,
        Surname: surname,
        Email: email,
        Age: Number(age),
        Phone: phone,
        GroupId: group,
      };
      const headers = new Headers();
      headers.set('Authorization', `Basic ${token}`)
      headers.set('content-type', 'application/json');
      fetch(`http://127.0.0.1:5000/student/${username}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedStudent),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }else{
            setIsDisabled(true);
            Swal.fire(
                'Success!',
                'Student was updated!',
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
  

const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (!isDisabled) {
      if (name === 'group') {
        setGroup(value);
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
    <option key={record.GroupId} value={record.GroupId}>
      {record.GroupId}
    </option>
  ));
    return (
        <AnimatedPage>
        <ToastContainer autoClose={1000}/>
            <h1 id="profile-title"><span className="highlight">Welcome, to the student profile!</span></h1>
                <div className="wrapper"> 
                    <div className="bio-block">
                    <img id="user-logo"src={profile} alt="profile logo"/>
                    <h3>{username}</h3>
                    <div className="inputs-block">
                        <BioInput invalid={isFieldInvalid('name')} Label="Name" Name={name} Type="text" Id="name" Disabled={isDisabled}
                  onClick={handleInputChange} />
                        <BioInput invalid={isFieldInvalid('surname')}Label="Surname" Name={surname} Type="text" Id="surname" Disabled={isDisabled}
                  onClick={handleInputChange}/>
                  {isDisabled ? (
                  <BioInput
                    Label="GroupId"
                    Name={group}
                    Type="text"
                    Id="group"
                    Disabled={isDisabled}
                    onClick={handleInputChange}
                  />
                ) : (
                  <select
                    name="group"
                    id="group"
                    value={group}
                    onChange={handleInputChange}
                  >
                    {options}
                  </select>
                )}
                        <BioInput invalid={isFieldInvalid('age')} Label="Age" Name={age} Type="number" Id="age" Disabled={isDisabled}
                  onClick={handleInputChange}/>
                        <BioInput invalid={isFieldInvalid('phone')} Label="Phone" Name={phone} Type="tel" Id="phone" Disabled={isDisabled}
                  onClick={handleInputChange}/>
                        <BioInput invalid={isFieldInvalid('email')} Label="Email" Name={email} Type="email" Id="email" Disabled={isDisabled}
                  onClick={handleInputChange}/>
                    </div>
                    <div className ="button-group">
                        <Button Id="update-btn" Title="Update" onClick={handleUpdateClick}/>
                        <DeleteButton username={username} />
                    </div>
                    </div>
                    <div className="grades-block">
                        <div className="table-block">
                        <table>
                            <thead>
                            <tr>
                  <th>
                    <a
                      className="sort-by"
                      id="num"
                      onClick={() => handleSort("MarkId")}
                    >
                      №
                    </a>
                  </th>
                  <th>
                    <a
                      className="sort-by"
                      id="sbj"
                      onClick={() => handleSort("SubjectId")}
                    >
                      Subject
                    </a>
                  </th>
                  <th>
                    <a
                      className="sort-by"
                      id="teacherID"
                      onClick={() => handleSort("TeacherId")}
                    >
                      Teacher
                    </a>
                  </th>
                  <th>
                    <a
                      className="sort-by"
                      id="value"
                      onClick={() => handleSort("Value")}
                    >
                      Mark
                    </a>
                  </th>
                  <th>
                    <a
                      className="sort-by"
                      id="date"
                      onClick={() => handleSort("DateId")}
                    >
                      Date
                    </a>
                  </th>
                </tr>
                            </thead>
                            <tbody>
                {sortedRecords.map((obj) => (
                  <TableItem
                    key={obj.MarkId}
                    Id={obj.MarkId}
                    Sbj={obj.SubjectId}
                    Teacher={obj.TeacherId}
                    Value={obj.Value}
                    Date={obj.DateId}
                  />
                ))}
              </tbody>
                            </table>
                        </div>
                        <div className="stats-block">
                            <div className="diagram" >
                            <Piechart series={arr} labels={labels}/>
                            </div>
                            <div className="diagram">
                            <Linechart records={records} />
                             </div>  
                        </div>  
                </div>
            </div>
        </AnimatedPage>
    )
}
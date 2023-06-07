import React, { useEffect, useState } from 'react'
import Teacher from '../components/Teacher';
import "../styles/staff.css"
import { AnimatedPage } from '../components/AnimatedPage';


export default function Staff(){
    let [records, setRecord] = useState([])
    useEffect(() => {
        document.title = "Our Staff"
        fetch("http://localhost:5000/teachers")
    .then((response)=>{
         return response.json(); 
     })
    .then((data)=>{
        setRecord(data)
     })
    .catch(err => console.log(err))
     }, [])
     
    return (
       <AnimatedPage>
     <div>
        <h1><span className="highlight">GradeMaster`s Teaching Staff</span></h1>
        <div className="teacher-list">
            {records.map((obj) => (
                <Teacher
                    key={obj.TeacherId}
                    Username= {obj.TeacherId}
                    Name={obj.Firstname}
                    Surname={obj.Surname}
                    Age={obj.Age}
                    Subject={obj.SubjectId} 
                    Phone={obj.Phone}
                    Email={obj.Email}
                />
            ))}
        </div>
    </div>
    </AnimatedPage> 
    );
}
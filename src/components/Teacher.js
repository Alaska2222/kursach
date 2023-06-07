function Teacher(props){
    return(
    <div className="teacher">
        <div className="key" >
            <h3>{props.Username}</h3>
            <p>Name:</p>
            <p>Surname:</p> 
            <p>Age:</p> 
            <p>Subject:</p> 
            <p>Email:</p> 
            <p>Phone:</p>
        </div>
        <div className="value" >
            <p>{props.Name}</p>
            <p>{props.Surname}</p>
            <p>{props.Age}</p>
            <p>{props.Subject}</p>
            <p>{props.Email}</p>
            <p>{props.Phone}</p>
        </div>
    </div>
    )
}
export default Teacher
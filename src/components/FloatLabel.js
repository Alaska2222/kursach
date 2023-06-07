import React from 'react';

export default function FloatLabel({ onChange, Data, Title, Type, Value, invalid }){
    
    return (
        <>
        {!invalid ? (
        <div className="floating-label">
            <input className="input" onChange={ onChange } placeholder={Title} type={Type} name={Data} id={Data} value={Value} required/>
            <label htmlFor={Data}>{Data}:</label>
        </div>
        ) : ( 
        <div className="floating-label" id="invalid">
            <input className="input" onChange={ onChange } placeholder={Title} type={Type} name={Data} id={Data} value={Value} required/>
            <label htmlFor={Data}>{Data}:</label>
        </div>)}
        
        </>
        )      
}
import React from 'react';

export default function Button({onClick, Id, Title}){
    return <button type="submit" id={Id} onClick={onClick}>{Title}</button> 
}
import React from 'react';

export default function TableItem({Id, Sbj, Teacher, Value, Date}){
    return (
        <tr>
            <td>{Id}</td>
            <td>{Sbj}</td>
            <td>{Teacher}</td>
            <td>{Value}</td>
            <td>{Date}</td>
        </tr>)}      

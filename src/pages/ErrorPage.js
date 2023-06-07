import React from 'react'
import { Link } from 'react-router-dom';



export default function ErrorPage(){
    return (
        <div className="error-container">
            <h1>404</h1>
            <h3>Page Not Found</h3>
            <p>The Page you are looking for doesn't exist or an other error occured. Go to <Link to="/" target="_self">Home page</Link></p>
        </div>
    );
}
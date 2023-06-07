import React, { useEffect } from 'react';
import "../styles/home.css"
import hist1 from '../assets/hist1.png';
import hist2 from '../assets/hist1.png';
import hist3 from '../assets/hist1.png';
import { AnimatedPage } from '../components/AnimatedPage';

export default function Home(){
    useEffect(() => {
        document.title = "Home"
     }, []);

     return (
        <AnimatedPage>
        <div>
            <main>
                <h1><span className="highlight">GradeMaster</span></h1>
                <h3>Welcome to GradeMaster, the ultimate website for managing and rating your academic progress!</h3>
                <p>
                    For students we offer convinient system for monitoring grades for each course and assignment.
                    As for teachers, we developed a rapid evaluation scheme.
                </p>
            </main>
            <div className="image-block">
                <div className="image">
                    <img src= {hist1} alt="first histogram" />
                </div>
                <div className="image">
                    <img src={hist2} alt="second histogram" />
                </div>
                <div className="image">
                    <img src={hist3} alt="third histogram" />
                </div>
            </div>
        </div>
        </AnimatedPage>
    )
}
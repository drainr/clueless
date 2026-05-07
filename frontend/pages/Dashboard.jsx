import React from 'react';
import Navbar from "../components/Navbar.jsx";
import Cards from "../components/Cards.jsx";


const Dashboard = () => {
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div className="bg-red-500 m-5">TEST</div>
            <div className="m-5">
                <Cards />
            </div>
        </div>
    );
};

export default Dashboard;
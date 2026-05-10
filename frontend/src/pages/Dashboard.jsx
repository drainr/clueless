import React from 'react';
import { Outlet } from 'react-router-dom'
import Navbar from "../components/Navbar.jsx";
import Cards from "../components/Cards.jsx";


const Dashboard = () => {
    return (
        <div>
            <div>
                <Navbar />
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;
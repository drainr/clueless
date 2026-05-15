import React from 'react';
import { Outlet } from 'react-router-dom'
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx"


const Dashboard = () => {
    return (
        <div>
            <div>
                <Navbar />
                <Outlet />
                <div className="pt-100">
                <Footer /></div>
            </div>
        </div>
    );
};

export default Dashboard;
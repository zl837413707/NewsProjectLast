import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from '../views/Login/Login';
import NewsSandBox from '../views/sanbox/NewSandBox';

export default function IndexRouter() {
    function PrivateRoute() {
        const navigate = useNavigate();
        const token = localStorage.getItem('token');

        useEffect(() => {
            if (!token) {
                navigate('/login');
            }
        }, [token, navigate]);

        return token ? <NewsSandBox /> : null;
    }
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="*"
                    element={<PrivateRoute />}
                />
            </Routes>
        </BrowserRouter>
    );
}
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from '../views/Login/Login';
import NewsSandBox from '../views/sanbox/NewSandBox';
import News from '../views/news/news/News'
import Detail from '../views/news/detail/Detail'

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
                <Route path="/news" element={<News />} />
                <Route path="/detail/:id" element={<Detail />} />
                <Route
                    path="*"
                    element={<PrivateRoute />}
                />
            </Routes>
        </BrowserRouter>
    );
}
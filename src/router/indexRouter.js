import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
const Login = lazy(() => import('../views/Login/Login'));
const NewsSandBox = lazy(() => import('../views/sanbox/NewSandBox'));
const News = lazy(() => import('../views/news/news/News'));
const Detail = lazy(() => import('../views/news/detail/Detail'));

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
            <Suspense>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/detail/:id" element={<Detail />} />
                    <Route
                        path="*"
                        element={<PrivateRoute />}
                    />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
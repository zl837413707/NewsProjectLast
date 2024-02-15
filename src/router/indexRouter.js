import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from '../views/Login/Login';
import NewsSandBox from '../views/sanbox/NewSandBox';
import News from '../views/news/news/News';
import Detail from '../views/news/detail/Detail';

export default function IndexRouter() {
    function PrivateRoute() {
        const navigate = useNavigate();
        const token = localStorage.getItem('nodeToken');

        useEffect(() => {
            if (!token) {
                navigate('/login');
            }
        }, [token, navigate]);

        return token ? <NewsSandBox /> : null;
    }

    function RedirectToLogin() {
        const navigate = useNavigate();
        const token = localStorage.getItem('nodeToken');

        useEffect(() => {
            if (token) {
                alert("ログアウトしてください");
                navigate('/');
            }
        }, [token, navigate]);

        return token ? null : <Login />;
    }
    return (
        <BrowserRouter>
            <Suspense>
                <Routes>
                    <Route path="/login" element={<RedirectToLogin />} />
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
import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import axios from 'axios'
import Home from '../../views/sanbox/home/Home'
import UserList from '../../views/sanbox/user-manage/UserList'
import RoleList from '../../views/sanbox/right-manage/RoleList';
import RightList from '../../views/sanbox/right-manage/RightList';
import Nopermission from '../../components/sanbox/Nopermission';
import NewsAdd from '../../views/sanbox/news-manage/NewsAdd';
import NewsDraft from '../../views/sanbox/news-manage/NewsDraft';
import NewsCategory from '../../views/sanbox/news-manage/NewsCategory';
import Audit from '../../views/sanbox/audit-manage/Audit';
import AuditList from '../../views/sanbox/audit-manage/AuditList';
import Unpublished from '../../views/sanbox/publish-manage/Unpublished';
import Published from '../../views/sanbox/publish-manage/Published';
import Sunset from '../../views/sanbox/publish-manage/Sunset';

export default function NewsRouter() {
  //这是从localStorage拿的,node的时候再考虑如何获取这些信息
  const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
  const [routeList, setRouteList] = useState([])
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8100/rights`),
      axios.get(`http://localhost:8100/children`)
    ]).then((res) => {
      setRouteList([...res[0].data, ...res[1].data])
      setLoading(false);
    })
  }, [])
  const RouterList = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/category": <NewsCategory />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />
  }
  const isPerssion = (item) => {
    return rights.includes(item.key) && item.pagepermisson === 1
  }

  if (loading) {
    return <Spin fullscreen />
  }

  return (
    <Routes>
      {
        routeList.map(item => {
          if (isPerssion(item)) {
            return <Route key={item.key} path={item.key} element={RouterList[item.key]} exact />
          }
          return null
        })
      }
      <Route path='/' element={<Navigate to="/home" replace />} />
      <Route path='*' element={<Nopermission />} />
    </Routes>
  )
}

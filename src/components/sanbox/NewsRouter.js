import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';
import axios from 'axios'
const Home = lazy(() => import('../../views/sanbox/home/Home'));
const UserList = lazy(() => import('../../views/sanbox/user-manage/UserList'));
const RoleList = lazy(() => import('../../views/sanbox/right-manage/RoleList'));
const RightList = lazy(() => import('../../views/sanbox/right-manage/RightList'));
const Nopermission = lazy(() => import('../../components/sanbox/Nopermission'));
const NewsAdd = lazy(() => import('../../views/sanbox/news-manage/NewsAdd'));
const NewsDraft = lazy(() => import('../../views/sanbox/news-manage/NewsDraft'));
const NewsCategory = lazy(() => import('../../views/sanbox/news-manage/NewsCategory'));
const NewsPreview = lazy(() => import('../../views/sanbox/news-manage/NewsPreview'));
const NewsUpdate = lazy(() => import('../../views/sanbox/news-manage/NewsUpdate'));
const Audit = lazy(() => import('../../views/sanbox/audit-manage/Audit'));
const AuditList = lazy(() => import('../../views/sanbox/audit-manage/AuditList'));
const Unpublished = lazy(() => import('../../views/sanbox/publish-manage/Unpublished'));
const Published = lazy(() => import('../../views/sanbox/publish-manage/Published'));
const Sunset = lazy(() => import('../../views/sanbox/publish-manage/Sunset'));

export default function NewsRouter() {
  //这是从localStorage拿的,node的时候再考虑如何获取这些信息
  const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
  const [routeList, setRouteList] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const loadingState = useSelector(state => state.LoadingReducer.isLoading)
  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8100/rights`),
      axios.get(`http://localhost:8100/children`)
    ]).then((res) => {
      setRouteList([...res[0].data, ...res[1].data])
      setDataLoaded(true)
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
    "/news-manage/preview/:id": <NewsPreview />,
    "/news-manage/update/:id": <NewsUpdate />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />
  }
  const isPerssion = (item) => {
    return rights.includes(item.key) && (item.pagepermisson === 1 || item.routepermisson === 1)
  }

  return (
    <Spin spinning={loadingState} size='large'>
      <Suspense>
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
          {dataLoaded && <Route path='*' element={<Nopermission />} />}
        </Routes>
      </Suspense>
    </Spin>
  )
}

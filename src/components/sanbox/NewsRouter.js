import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';
const Home = React.lazy(() => import('../../views/sanbox/home/Home'));
const UserList = React.lazy(() => import('../../views/sanbox/user-manage/UserList'));
const RoleList = React.lazy(() => import('../../views/sanbox/right-manage/RoleList'));
const RightList = React.lazy(() => import('../../views/sanbox/right-manage/RightList'));
const Nopermission = React.lazy(() => import('../../components/sanbox/Nopermission'));
const NewsAdd = React.lazy(() => import('../../views/sanbox/news-manage/NewsAdd'));
const NewsDraft = React.lazy(() => import('../../views/sanbox/news-manage/NewsDraft'));
const NewsCategory = React.lazy(() => import('../../views/sanbox/news-manage/NewsCategory'));
const NewsPreview = React.lazy(() => import('../../views/sanbox/news-manage/NewsPreview'));
const NewsUpdate = React.lazy(() => import('../../views/sanbox/news-manage/NewsUpdate'));
const Audit = React.lazy(() => import('../../views/sanbox/audit-manage/Audit'));
const AuditList = React.lazy(() => import('../../views/sanbox/audit-manage/AuditList'));
const Unpublished = React.lazy(() => import('../../views/sanbox/publish-manage/Unpublished'));
const Published = React.lazy(() => import('../../views/sanbox/publish-manage/Published'));
const Sunset = React.lazy(() => import('../../views/sanbox/publish-manage/Sunset'));

const NewsRouter = React.memo(({ routeList }) => {
  const userInfoData = useSelector(state => state.UserInfoReducer);
  const loadingState = useSelector(state => state.LoadingReducer.isLoading);

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
  };

  const isPerssion = (item) => {
    if (userInfoData.rightContent) {
      return userInfoData.rightContent.includes(item.key) && (item.pagepermisson === 1 || item.routepermisson === 1);
    }
    return null;
  };

  return (
    <Spin spinning={loadingState} size='large'>
      <Suspense>
        <Routes>
          {routeList.map(item => isPerssion(item) && <Route key={item.key} path={item.key} element={RouterList[item.key]} exact />)}
          <Route path='/' element={<Navigate to="/home" replace />} />
          {(routeList.length > 0) && <Route path='*' element={<Nopermission />} />}
        </Routes>
      </Suspense>
    </Spin>
  );
});

export default NewsRouter;

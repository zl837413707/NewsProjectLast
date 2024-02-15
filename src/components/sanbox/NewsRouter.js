import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';
import Home from '../../views/sanbox/home/Home';
import UserList from '../../views/sanbox/user-manage/UserList';
import RoleList from '../../views/sanbox/right-manage/RoleList';
import RightList from '../../views/sanbox/right-manage/RightList';
import Nopermission from '../../components/sanbox/Nopermission';
import NewsAdd from '../../views/sanbox/news-manage/NewsAdd';
import NewsDraft from '../../views/sanbox/news-manage/NewsDraft';
import NewsCategory from '../../views/sanbox/news-manage/NewsCategory';
import NewsPreview from '../../views/sanbox/news-manage/NewsPreview';
import NewsUpdate from '../../views/sanbox/news-manage/NewsUpdate';
import Audit from '../../views/sanbox/audit-manage/Audit';
import AuditList from '../../views/sanbox/audit-manage/AuditList';
import Unpublished from '../../views/sanbox/publish-manage/Unpublished';
import Published from '../../views/sanbox/publish-manage/Published';
import Sunset from '../../views/sanbox/publish-manage/Sunset';

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
      <Routes>
        {routeList.map(item => isPerssion(item) && <Route key={item.key} path={item.key} element={RouterList[item.key]} exact />)}
        <Route path='/' element={<Navigate to="/home" replace />} />
        {(routeList.length > 0) && <Route path='*' element={<Nopermission />} />}
      </Routes>
    </Spin>
  );
});

export default NewsRouter;

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import SideMenu from '../../components/sanbox/SideMenu'
import TopHeader from '../../components/sanbox/TopHeader'
import Home from '../../views/sanbox/home/Home'
import UserList from '../../views/sanbox/user-manage/UserList'
import RoleList from './right-manage/RoleList';
import RightList from './right-manage/RightList';
import Nopermission from '../../components/sanbox/Nopermission';

// antdUI
import { Layout } from 'antd';
const { Content } = Layout;

export default function NewsSandBox() {
  return (
    <Layout style={{ minHeight: '100vh', }}>
      <SideMenu />
      <Layout style={{ minWidth: '1000px' }}>
        <TopHeader />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            maxHeight: '88vh',
            backgroundColor: '#fff',
            overflowY: 'auto'
          }}
        >
          <Routes>
            <Route path='/home' element={<Home />}></Route>
            <Route path='/user-manage/list' element={<UserList />}></Route>
            <Route path='/right-manage/role/list' element={<RoleList />}></Route>
            <Route path='/right-manage/right/list' element={<RightList />}></Route>
            <Route path='/' element={<Navigate to="/home" replace />}></Route>
            <Route path='*' element={<Nopermission />}></Route>
          </Routes>
        </Content>

      </Layout>
    </Layout>
  )
}

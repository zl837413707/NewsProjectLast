import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import './index.css'
const { Sider } = Layout;

const items = [
  { key: '/home', label: 'ホーム', icon: <UserOutlined />, },
  {
    key: '/user-manage', label: 'ユーザー管理', icon: <TeamOutlined />, children: [
      { key: '/user-manage/list', label: 'ユーザーリスト', icon: <PieChartOutlined /> }
    ]
  },
  {
    key: '/right-manage', label: '権限管理', icon: <TeamOutlined />, children: [
      { key: '/right-manage/role/list', label: 'ロールリスト', icon: <PieChartOutlined /> },
      { key: '/right-manage/right/list', label: '権限リスト', icon: <PieChartOutlined /> }
    ]
  },
];

export default function SideMenu() {
  const navigate = useNavigate();
  return (
    <Sider trigger={null} collapsible className="side" >
      <div className="logo" >ニュース管理システム</div>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={(items) => { navigate(items.key) }} />
    </Sider>
  )
}

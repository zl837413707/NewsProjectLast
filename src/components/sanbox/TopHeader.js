import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined, MenuUnfoldOutlined, SmileOutlined, UserOutlined
} from '@ant-design/icons';
import { Layout, Button, theme, Dropdown, Space, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom'
const { Header } = Layout;

export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  //这是从localStorage拿的,node的时候再考虑如何获取这些信息
  const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))
  const items = [
    {
      key: '1',
      label: roleName,
      icon: <SmileOutlined />,
    },
    {
      key: '2',
      label: 'ロックアウト',
      icon: <SmileOutlined />,
    }
  ];
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onClick = ({ key }) => {
    if (key === '2') {
      // 目前先用手动的，等做node的时候用正式的登入登出
      localStorage.removeItem('token')
      navigate('/login')
    }
  };

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <div style={{ float: "right" }}>欢迎<span style={{ color: 'orange', fontSize: '18px', fontWeight: '700' }}>{username}</span>回来<Dropdown
        menu={{
          items,
          onClick,
        }}
      >
        <i onClick={(e) => e.preventDefault()}>
          <Space style={{ margin: '0 20px 0 20px' }}>
            <Avatar size="large" icon={<UserOutlined />} />
          </Space>
        </i>
      </Dropdown></div>
    </Header>
  )
}

import React, { useState } from 'react';
import {
  MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined, SmileOutlined, UserOutlined
} from '@ant-design/icons';
import { Layout, Button, theme, Dropdown, Space, Avatar } from 'antd';

const { Header } = Layout;

export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false);
  const items = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
      icon: <SmileOutlined />,
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item (disabled)
        </a>
      ),
      icon: <SmileOutlined />,
    }
  ];
  const {
    token: { colorBgContainer },
  } = theme.useToken();
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
      <div style={{ float: "right" }}>欢迎admin回来<Dropdown
        menu={{
          items,
        }}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space style={{ margin: '0 20px 0 20px' }}>
            <Avatar size="large" icon={<UserOutlined />} />
          </Space>
        </a>
      </Dropdown></div>
    </Header>
  )
}

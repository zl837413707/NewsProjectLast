import React, { useState } from 'react';
import {
  LeftSquareOutlined, RightSquareOutlined, SmileOutlined, UserOutlined
} from '@ant-design/icons';
import { Layout, Button, theme, Dropdown, Space, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
const { Header } = Layout;

// 获取store的某个值 
const mapStateToProps = ({ Collapsed: { isCollapsed } }) => {
  return {
    isCollapsed,
  }
}
// 向store传送某一个行为触发相对应的函数
const mapDispatchToProps = {
  changeCollapsedAction() {
    return {
      type: 'changeCollapsed',
    }
  }
}

function TopHeader(props) {
  // const [collapsed, setCollapsed] = useState(false);
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

  const collapsedChange = () => {
    props.changeCollapsedAction()
  }

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <Button
        type="text"
        icon={props.isCollapsed ? <RightSquareOutlined /> : <LeftSquareOutlined />}
        onClick={() => collapsedChange()}
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


export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)
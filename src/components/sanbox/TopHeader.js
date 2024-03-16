import React from 'react'
import {
  LeftSquareOutlined, RightSquareOutlined, SmileOutlined
} from '@ant-design/icons'
import { Layout, Button, theme, Dropdown } from 'antd'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { useSelector } from 'react-redux'

const { Header } = Layout;


const mapStateToProps = ({ Collapsed: { isCollapsed } }) => {
  return {
    isCollapsed,
  }
}

const mapDispatchToProps = {
  changeCollapsedAction() {
    return {
      type: 'changeCollapsed',
    }
  }
}

function TopHeader(props) {
  const userInfoData = useSelector(state => state.UserInfoReducer)
  const navigate = useNavigate()

  const items = [
    {
      key: '1',
      label: 'ログアウト',
      icon: <SmileOutlined />,
    }
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onClick = ({ key }) => {
    if (key === '1') {
      localStorage.removeItem('nodeToken')
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
      <div style={{ float: "right" }}><Dropdown
        menu={{
          items,
          onClick,
        }}
      >
        <i onClick={(e) => e.preventDefault()}>
          <span style={{ color: 'orange', fontSize: '16px', fontWeight: '700', marginRight: 50 }}>{userInfoData.username}</span>
        </i>
      </Dropdown></div>
    </Header>
  )
}


export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)
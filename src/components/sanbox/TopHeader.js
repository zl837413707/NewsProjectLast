import React, { useEffect, useState } from 'react'
import {
  LeftSquareOutlined, RightSquareOutlined, SmileOutlined
} from '@ant-design/icons'
import { Layout, Button, theme, Dropdown } from 'antd'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { useDispatch } from 'react-redux'
import axiosinstance from '../../utils/index'
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
  const [userInfo, setUserInfo] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // ユーザー情報取得
  useEffect(() => {
    axiosinstance.get('/getuserinfo')
      .then((res) => {
        setUserInfo(res.data)
      })
      .catch((err) => {
        navigate('/login')
        console.log(err)
      })
  }, [navigate])

  useEffect(() => {
    dispatch({
      type: 'userInfoAdd',
      payload: userInfo
    })
  }, [dispatch, userInfo])

  const items = [
    {
      key: '1',
      label: 'ロックアウト',
      icon: <SmileOutlined />,
    }
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onClick = ({ key }) => {
    if (key === '1') {
      // 目前先用手动的，等做node的时候用正式的登入登出
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
          <span style={{ color: 'orange', fontSize: '16px', fontWeight: '700', marginRight: 50 }}>{userInfo.username}</span>
        </i>
      </Dropdown></div>
    </Header>
  )
}


export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)
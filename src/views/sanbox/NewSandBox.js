import React, { useEffect } from 'react'
import SideMenu from '../../components/sanbox/SideMenu'
import TopHeader from '../../components/sanbox/TopHeader'
import NewsRouter from '../../components/sanbox/NewsRouter';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axiosinstance from '../../utils/index'

// antdUI
import { Layout } from 'antd';
const { Content } = Layout;

export default function NewsSandBox() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    axiosinstance.get('/getuserinfo')
      .then((res) => {
        dispatch({
          type: 'userInfoAdd',
          payload: res.data
        })
      })
      .catch((err) => {
        navigate('/login')
        console.log(err)
      })
  }, [navigate, dispatch])

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
          <NewsRouter />
        </Content>

      </Layout>
    </Layout>
  )
}

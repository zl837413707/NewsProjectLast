import React from 'react'
import SideMenu from '../../components/sanbox/SideMenu'
import TopHeader from '../../components/sanbox/TopHeader'
import NewsRouter from '../../components/sanbox/NewsRouter';

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
          <NewsRouter />
        </Content>

      </Layout>
    </Layout>
  )
}

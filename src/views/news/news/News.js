import React from 'react'
import { Layout, Flex } from 'antd'
import { Spin } from 'antd'
import { useSelector } from 'react-redux'
import style from './index.module.css'
import NewsHeader from '../../../components/news/header/NewsHeader'
import NewsContent from '../../../components/news/content/NewsContent'
import NewsFooter from '../../../components/news/footer/NewsFooter'
const { Header, Footer, Content } = Layout



export default function News() {
  const loadingState = useSelector(state => state.LoadingReducer.isLoading)
  return (
    <Spin spinning={loadingState} size='large'>
      <Flex>
        <Layout className={style.layoutStyle}>
          <Header className={style.headerStyle}><NewsHeader /></Header>
          <Content className={style.contentStyle}><NewsContent /></Content>
          <Footer className={style.footerStyle}><NewsFooter /></Footer>
        </Layout>
      </Flex>
    </Spin>
  )
}

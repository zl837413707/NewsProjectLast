import React from 'react'
import { Layout, Flex } from 'antd'
import { Spin } from 'antd'
import { useSelector } from 'react-redux'
import style from './index.module.css'
import NewsHeader from '../../../components/news/header/NewsHeader'
import NewsDetail from '../../../components/news/detail/NewsDetail'
const { Header, Content } = Layout



export default function News() {
  const loadingState = useSelector(state => state.LoadingReducer.isLoading)
  return (
    <Spin spinning={loadingState} size='large'>
      <Flex gap="middle" wrap="wrap">
        <Layout className={style.layoutStyle}>
          <Header className={style.headerStyle}><NewsHeader /></Header>
          <Content className={style.contentStyle}><NewsDetail /></Content>
        </Layout>
      </Flex>
    </Spin>
  )
}

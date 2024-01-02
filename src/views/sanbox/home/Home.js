import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Avatar, List } from 'antd';
import { Link } from 'react-router-dom';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import AxiosInstance from '../../../utils/axios'
const { Meta } = Card;
export default function Home() {
  const [viewList, setViewList] = useState([])
  const [startList, setStartList] = useState([])
  const userInfo = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    AxiosInstance.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then((res) => {
      setViewList(res.data)
    })

  }, [])

  useEffect(() => {
    AxiosInstance.get("/news?publishState=2&_expand=category&_sort=start&_order=desc&_limit=6").then((res) => {
      setStartList(res.data)
    })

  }, [])
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card title={<div>用户最常浏览</div>} bordered={true}>
          <List
            size="large"
            dataSource={viewList}
            renderItem={(item) => <List.Item><Link to={`/news-manage/preview/${item.id}`}>
              {item.title}
            </Link></List.Item>}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="用户点赞最多" bordered={true}>
          <List
            size="large"
            dataSource={startList}
            renderItem={(item) => <List.Item><Link to={`/news-manage/preview/${item.id}`}>
              {item.title}
            </Link></List.Item>}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
          actions={[
            <SettingOutlined key="setting" />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          <Meta
            avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
            title={userInfo.username}
            description={
              <div>
                <b>{userInfo.region ? userInfo.region : '全球'}</b>
                <span style={{ marginLeft: 20 }}>{userInfo.role.roleName}</span>
              </div>
            }
          />
        </Card>
      </Col>
    </Row>
  )
}

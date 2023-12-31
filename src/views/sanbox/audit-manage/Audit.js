import React, { useEffect, useState } from 'react'
import AxiosInstance from '../../../utils/axios'
import { Table, Button, message } from 'antd'
import {
  CloseOutlined, CheckOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

export default function Audit() {
  const [dataSource, setDataSource] = useState([])
  const userInfo = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    AxiosInstance.get('/news?auditState=1&_expand=role&_expand=category').then((res) => {
      // 如果是管理员直接展示所有数据,不是管理员根据id遍历
      setDataSource(userInfo.roleId === 1 ? res.data : [
        ...res.data.filter(item => item.username === userInfo.username),
        ...res.data.filter(item => item.region === userInfo.region && item.roleId >= 2)
      ])
    })
  }, [userInfo.region, userInfo.roleId, userInfo.username])


  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return (
          <Link to={`/news-manage/preview/${item.id}`}>
            {title}
          </Link>
        )
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button shape="circle" style={{ marginRight: '5px' }} type="primary" icon={<CheckOutlined />} onClick={() => { handleAudit(item, 2, 1) }} />
          <Button shape="circle" danger icon={<CloseOutlined />} onClick={() => { handleAudit(item, 3, 0) }} />
        </div >
      }
    }
  ]

  const handleAudit = (item, auditState, publishState) => {
    AxiosInstance.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(() => {
      message.success('操作成功')
      getData()
    })
  }

  const getData = () => {
    AxiosInstance.get('/news?auditState=1&_expand=role&_expand=category').then((res) => {
      // 如果是管理员直接展示所有数据,不是管理员根据id遍历
      setDataSource(userInfo.roleId === 1 ? res.data : [
        ...res.data.filter(item => item.username === userInfo.username),
        ...res.data.filter(item => item.region === userInfo.region && item.roleId >= 2)
      ])
    })
  }

  return (
    <div>
      <Table style={{ overflow: 'auto' }} dataSource={dataSource} columns={columns} pagination={{
        pageSize: 6
      }} rowKey={item => item.id} />
    </div>
  )
}

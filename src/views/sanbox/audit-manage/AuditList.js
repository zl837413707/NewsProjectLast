import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, message } from 'antd'
import {
  ToTopOutlined,  RollbackOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../../utils/axios'

export default function AuditList() {
  const [dataSource, setDataSource] = useState([])
  const navigate = useNavigate()
  const userInfo = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    AxiosInstance(`/news?author=${userInfo.username}&auditState_ne=0&publishState_lte=1&_expand=category`).then((res) => {
      setDataSource(res.data)
    })
  }, [userInfo.username])

  const backColor = ['red', 'orange', 'green', 'gray']
  const auditTxt = ['草稿箱', '审核中', '已通过', '未通过']
  const buttonTxt = ['', '撤销', '发布', '撤销']

  const buttonIcon = ['', <RollbackOutlined />, <ToTopOutlined />, <RollbackOutlined />]

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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        return <Tag color={backColor[auditState]}>{auditTxt[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button style={{ marginRight: '5px' }} type="primary" icon={buttonIcon[item.auditState]} onClick={() => {
            handleChange(item)
          }}>{buttonTxt[item.auditState]}</Button>
        </div >
      }
    }
  ]

  const handleChange = (item) => {
    console.log(item);
    if (item.auditState === 1 || item.auditState === 3) {
      AxiosInstance.patch(`/news/${item.id}`, { auditState: 0 }).then(() => {
        message.success('退回成功')
        getData()
      })
    } else {
      AxiosInstance.patch(`/news/${item.id}`, { publishState: 2, publishTime: Date.now() }).then(() => {
        message.success('发布成功')
        navigate('/publish-manage/published')
      })
    }

  }

  const getData = () => {
    AxiosInstance(`/news?author=${userInfo.username}&auditState_ne=0&publishState_lte=1&_expand=category`).then((res) => {
      setDataSource(res.data)
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

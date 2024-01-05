import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, message } from 'antd'
import {
  ToTopOutlined, RollbackOutlined
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
  const auditTxt = ['下書きボックス', '審査中', '承認済み', '不承認']
  const buttonTxt = ['', '取り消し', '公開', '取り消し']

  const buttonIcon = ['', <RollbackOutlined />, <ToTopOutlined />, <RollbackOutlined />]

  const columns = [
    {
      title: 'ニュースタイトル',
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
      title: '作成者',
      dataIndex: 'author',
    },
    {
      title: 'ニュース分類',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      }
    },
    {
      title: '審査状態',
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
        message.success('取り消し成功')
        getData()
      })
    } else {
      AxiosInstance.patch(`/news/${item.id}`, { publishState: 2, publishTime: Date.now() }).then(() => {
        message.success('公開成功')
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

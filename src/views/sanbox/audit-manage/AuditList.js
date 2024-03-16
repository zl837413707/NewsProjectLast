import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Tag, Button, message } from 'antd'
import {
  ToTopOutlined, RollbackOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import axiosInstance from '../../../utils/index'

export default function AuditList() {
  const userInfoData = useSelector(state => state.UserInfoReducer)
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axiosInstance.get('/getallnews', {
      params: {
        auditStateIsZero: 1,
        publishState: 1
      }
    }).then((res) => {
      const sortedData = res.data.sort((a, b) => a.id - b.id)
      setDataSource(userInfoData.roleId === 1 ? res.data : [
        ...sortedData.filter(item => item.author === userInfoData.username),
        ...sortedData.filter(item => item.region === userInfoData.region && (item.roleId > userInfoData.roleId))
      ])
    })
  }, [userInfoData.region, userInfoData.roleId, userInfoData.username])

  const backColor = ['red', 'orange', 'green', 'gray']
  const auditTxt = ['下書きボックス', '審査中', '承認済み', '不承認']
  const buttonTxt = ['', '取り消し', '公開', '取り消し']

  const buttonIcon = ['', <RollbackOutlined />, <ToTopOutlined />, <RollbackOutlined />]

  const columns = [
    {
      title: 'ニュースタイトル',
      dataIndex: 'newsTitle',
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
      dataIndex: 'title',
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
    if (item.auditState === 1 || item.auditState === 3) {
      axiosInstance.patch(`/updatenewsauditstate/${item.id}`, { auditState: 0 }).then(() => {
        getData()
        message.success('取り消し成功')
      })
    } else {
      axiosInstance.patch(`/updatenewsauditstate/${item.id}`, { publishState: 2, publishTime: Date.now() }).then(() => {
        message.success('公開成功')
        getData()
      })
    }

  }

  const getData = () => {
    axiosInstance.get('/getallnews', {
      params: {
        auditStateIsZero: 1,
        publishState: 1
      }
    }).then((res) => {
      const sortedData = res.data.sort((a, b) => a.id - b.id)
      setDataSource(userInfoData.roleId === 1 ? res.data : [
        ...sortedData.filter(item => item.author === userInfoData.username),
        ...sortedData.filter(item => item.region === userInfoData.region && (item.roleId > userInfoData.roleId))
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

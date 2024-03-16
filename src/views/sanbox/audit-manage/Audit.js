import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '../../../utils/index'
import { Table, Button, message } from 'antd'
import {
  CloseOutlined, CheckOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'

export default function Audit() {
  const [dataSource, setDataSource] = useState([])
  const userInfoData = useSelector(state => state.UserInfoReducer)

  useEffect(() => {
    axiosInstance.get('/getallnews', {
      params: {
        auditState: 1
      }
    }).then((res) => {
      const sortedData = res.data.sort((a, b) => a.id - b.id)
      setDataSource(userInfoData.roleId === 1 ? res.data : [
        ...sortedData.filter(item => item.author === userInfoData.username),
        ...sortedData.filter(item => item.region === userInfoData.region && (item.roleId > userInfoData.roleId))
      ])
    })
  }, [userInfoData.region, userInfoData.roleId, userInfoData.username])



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
    axiosInstance.patch(`/updatenewsauditstate/${item.id}`, {
      auditState,
      publishState
    }).then(() => {
      message.success('操作成功')
      getData()
    })
  }

  const getData = () => {
    axiosInstance.get('/getallnews', {
      params: {
        auditState: 1
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
        pageSize: 7
      }} rowKey={item => item.id} />
    </div>
  )
}

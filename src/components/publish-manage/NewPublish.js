import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, message } from 'antd'
import {
  ToTopOutlined, VerticalAlignBottomOutlined, DeleteOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../utils/axios.js'

export default function NewPublish(props) {
  const [dataSource, setDataSource] = useState([])
  const userInfo = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    setDataSource(props.dataSource)
  }, [props.dataSource])

  const buttonTxt = ['', '公開', '非公開', '削除']

  const buttonIcon = ['', <ToTopOutlined />, <VerticalAlignBottomOutlined />, <DeleteOutlined />]

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
      title: '操作',
      render: (item) => {
        return <div>
          <Button style={{ marginRight: '5px' }} type="primary" icon={buttonIcon[item.publishState]} onClick={() => {
            handleChange(item)
          }}>{buttonTxt[item.publishState]}</Button>
        </div >
      }
    }
  ]

  const handleChange = (item) => {
    console.log(item.publishState, item.id);
    if (item.publishState === 1) {
      AxiosInstance.patch(`/news/${item.id}`, { publishState: 2, publishTime: Date.now() }).then(() => {
        message.success('設置成功')
        getData(1)
      })
    } else if (item.publishState === 2) {
      AxiosInstance.patch(`/news/${item.id}`, { publishState: 3, unPublishTime: Date.now() }).then(() => {
        message.success('設置成功')
        getData(2)
      })
    } else {
      AxiosInstance.delete(`/news/${item.id}`).then(() => {
        message.success('削除成功')
        getData(3)
      })
    }

  }

  const getData = (item) => {
    AxiosInstance(`/news?auhtou=${userInfo.username}&publishState=${item}&_expand=category`).then((res) => {
      setDataSource(res.data)
    })
  }

  return (
    <div>
      <Table style={{ overflow: 'auto' }} dataSource={dataSource} columns={columns} pagination={{
        pageSize: 8
      }} rowKey={item => item.id} />
    </div>
  )
}

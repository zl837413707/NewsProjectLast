import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {
  EditOutlined, UploadOutlined, DeleteOutlined, ExclamationCircleFilled,
} from '@ant-design/icons'
import { Table, Button, Modal, message } from 'antd'
import AxiosInstance from '../../../utils/axios'
const { confirm } = Modal

export default function NewsDraft() {
  const [dataSource, setDataSource] = useState([])
  const navigate = useNavigate()
  const userInfo = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    const getData = async () => {
      await AxiosInstance.get(`/news?author=${userInfo.username}&auditState=0&_expand=category`).then((res) => {
        setDataSource(res.data)
      })
    }
    getData()
  }, [userInfo.username])

  //表格数据
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
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
      dataIndex: 'author'
    },
    {
      title: '分類',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button style={{ marginRight: '5px' }} type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => handleSubmit(item.id)} />
          <Button style={{ marginRight: '5px' }} type="primary" shape="circle" icon={<EditOutlined />} onClick={() => { navigate(`/news-manage/update/${item.id}`) }} />
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} />
        </div >
      }
    }
  ]

  //弹出框方法
  const showConfirm = (item) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleFilled />,
      content: '確認ボタンを押すとデータは完全に削除されます、間違いがないかご確認ください',
      okText: '確認',
      cancelText: 'キャンセル',
      onOk() {
        okMethod(item)
      }
    });
  }
  //弹出框确认方法
  const okMethod = (item) => {
    AxiosInstance.delete(`/news/${item.id}`).then((res) => {
      const newData = dataSource.filter(data => data.id !== item.id)
      setDataSource(newData)
    })
  }
  //  提交审核
  const handleSubmit = (id) => {
    AxiosInstance.patch(`/news/${id}`, {
      auditState: 1
    }).then((res) => {
      navigate('/audit-manage/list')
      message.success(`提出成功`)
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


import React, { useState, useEffect } from 'react'
import {
  SendOutlined, SettingOutlined, DeleteOutlined, ExclamationCircleFilled, CheckOutlined, CloseOutlined
} from '@ant-design/icons';
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import axios from 'axios'
import './index.css'
const { confirm } = Modal;

export default function RIghtList() {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    const getData = async () => {
      await axios.get('http://localhost:8100/rights?_embed=children').then((res) => {
        res.data.forEach((res) => {
          if (res.children.length === 0) {
            res.children = ''
          }
        })
        console.log(dataSource);
        setDataSource(res.data)
      })
    }
    getData()
  }, [])

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
      title: '権限名',
      dataIndex: 'label'
    },
    {
      title: '権限パス',
      dataIndex: 'key',
      render: (key) => {
        return <Tag icon={<SendOutlined />} color="orange">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Popover content={<div style={{ textAlign: 'center' }}><Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} checked={item.pagepermisson} onChange={() => switchMethod(item)}></Switch></div>} title="配置" trigger="click" >
            <Button type="primary" shape="circle" icon={<SettingOutlined />} disabled={item.pagepermisson === undefined} />&nbsp;&nbsp;
          </Popover >
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
    // 判断是1级还是2级目录
    if (item.grade === 1) {
      axios.delete(`http://localhost:8100/rights/${item.id}`).then((res) => {
        const newData = dataSource.filter(data => data.id !== item.id)
        setDataSource(newData);
      })
    } else {
      axios.delete(`http://localhost:8100/children/${item.id}`).then((res) => {
        const newData = dataSource.filter(data => data.id === item.rightId)
        newData[0].children = newData[0].children.filter(data => data.id !== item.id)
        setDataSource([...dataSource]);
      })
    }
  }
  //switch控制权限
  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    setDataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`http://localhost:8100/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else {
      axios.patch(`http://localhost:8100/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }

  }

  return (
    <div>
      <Table style={{ overflow: 'auto' }} dataSource={dataSource} columns={columns} pagination={{
        pageSize: 6
      }} />
    </div>
  )
}

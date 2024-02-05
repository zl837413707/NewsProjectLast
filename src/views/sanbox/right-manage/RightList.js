import React, { useState, useEffect } from 'react'
import {
  SendOutlined, SettingOutlined, CheckOutlined, CloseOutlined
} from '@ant-design/icons';
import { Table, Tag, Button, Popover, Switch } from 'antd'
import axiosInstance from '../../../utils/index';
import './index.css'

export default function RightList() {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axiosInstance.get('/allrights').then((res) => {
      const restructuredData = [];
      const topLevelItems = res.data.filter(item => !item.rightId);
      topLevelItems.forEach(topItem => {
        const newItem = {
          label: topItem.label,
          id: topItem.id,
          key: topItem.key,
          pagepermisson: topItem.pagepermisson,
          grade: topItem.grade,
          children: []
        };

        // 获取子菜单
        const children = res.data.filter(item => item.rightId === topItem.id);
        children.forEach(child => {
          const newChild = {
            label: child.label,
            id: child.id,
            rightId: child.rightId,
            key: child.key,
            grade: child.grade,
            pagepermisson: child.pagepermisson
            // 可以根据需要将其他属性添加到子级对象中
          };
          newItem.children.push(newChild);
        });
        if (newItem.children.length === 0) {
          delete newItem.children;
        }
        restructuredData.push(newItem);
      })
      setDataSource(restructuredData)
    }).catch(err => {
      console.log(err);
    })
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
          <Popover content={<div style={{ textAlign: 'center' }}><Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} checked={item.pagepermisson} disabled={item.key === '/right-manage' ? true : false} onChange={() => switchMethod(item)}></Switch></div>} title="配置" trigger="click" >
            <Button style={{ marginRight: '5px' }} type="primary" shape="circle" icon={<SettingOutlined />} disabled={item.pagepermisson === null} />
          </Popover >
        </div >
      }
    }
  ]

  //switch控制权限
  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    setDataSource([...dataSource])
    if (item.grade === 1) {
      axiosInstance.patch(`/changepagepermisson/${item.id}`, {
        grade: 1,
        pagepermisson: item.pagepermisson
      })
    } else {
      console.log('000');
    }

  }

  return (
    <div>
      <Table locale={{ emptyText: ' ' }} style={{ overflow: 'auto' }} dataSource={dataSource} columns={columns} pagination={{
        pageSize: 6
      }} />
    </div>
  )
}

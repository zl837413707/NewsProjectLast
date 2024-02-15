import React, { useState, useEffect } from 'react'
import {
  UnorderedListOutlined
} from '@ant-design/icons'
import { Table, Button, Modal, Tree } from 'antd'
import axiosInstance from '../../../utils/index'


export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [rightList, setRightList] = useState([])
  const [currentRightList, setcurrentRightList] = useState([])
  const [currentId, setCurrentId] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 表格数据
  const columns = [
    {
      title: 'ID',
      dataIndex: 'roleId',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '権限者名前',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button style={{ marginRight: '5px' }} type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => {
            setIsModalOpen(true)
            setcurrentRightList(item.rights)
            setCurrentId(item.roleId)
          }} />
        </div >
      }
    }
  ]

  useEffect(() => {
    axiosInstance.get('/allrolespath').then((res) => {
      setDataSource(res.data)
    }).catch(err => {
      console.log(err)
    })
  }, [])

  useEffect(() => {
    axiosInstance.get('/allrights').then((res) => {
      const restructuredData = [];
      const topLevelItems = res.data.filter(item => !item.rightId)
      topLevelItems.forEach(topItem => {
        const newItem = {
          title: topItem.label,
          id: topItem.id,
          key: topItem.key,
          pagepermisson: topItem.pagepermisson,
          grade: topItem.grade,
          children: []
        };

        // 获取子菜单
        const children = res.data.filter(item => item.rightId === topItem.id)
        children.forEach(child => {
          const newChild = {
            title: child.label,
            id: child.id,
            rightId: child.rightId,
            key: child.key,
            grade: child.grade,
            disableCheckbox: child.pagepermisson === null ? true : false
            // 可以根据需要将其他属性添加到子级对象中
          };
          newItem.children.push(newChild)
        });

        restructuredData.push(newItem)
      })
      setRightList(restructuredData)
    }).catch(err => {
      console.log(err)
    })
  }, [])

  // 编辑对话框
  const handleOk = (item) => {
    axiosInstance.patch(`/updateallrolespath/${currentId}`, {
      rightContent: currentRightList
    })
    setIsModalOpen(false)
    setDataSource(dataSource.map((item) => {
      if (item.roleId === currentId) {
        return { ...item, rights: currentRightList }
      }
      return item
    }))
  }

  const onCheck = (checkedKeys) => {
    console.log(checkedKeys);
    if (currentId === 1) {
      alert('スーパー管理者の権限を操作できません')
      return
    }
    setcurrentRightList(checkedKeys)
  }

  return (
    <div>
      <Table locale={{ emptyText: ' ' }} dataSource={dataSource} columns={columns} rowKey={(item) => item.roleId}></Table>
      <Modal title="権限一覧" open={isModalOpen} onOk={handleOk} onCancel={() => { setIsModalOpen(false) }}>
        <Tree checkable treeData={rightList} checkedKeys={currentRightList} onCheck={onCheck} checkStrictly={false} />
      </Modal>
    </div>
  )
}

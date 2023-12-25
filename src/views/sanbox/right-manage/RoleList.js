import React, { useState, useEffect } from 'react'
import {
  UnorderedListOutlined, DeleteOutlined, ExclamationCircleFilled
} from '@ant-design/icons';
import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
const { confirm } = Modal

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [rightList, setRightList] = useState([])
  const [currentRightList, setcurrentRightList] = useState([])
  const [currentId, setCurrentId] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 表格数据
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
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
          <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => {
            setIsModalOpen(true)
            setcurrentRightList(item.rights)
            setCurrentId(item.id)
          }} />&nbsp;&nbsp;
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} />
        </div >
      }
    }
  ]

  useEffect(() => {
    // 获取角色列表
    axios.get('http://localhost:8100/roles').then(res => {
      setDataSource(res.data)
    })
  }, [])

  useEffect(() => {
    // 获取权限列表
    axios.get('http://localhost:8100/rights?_embed=children').then(res => {
      setRightList(updateLabelToTitle(res.data))
    })
  }, [])

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
    })
  }
  //弹出框确认方法
  const okMethod = (item) => {
    axios.delete(`http://localhost:8100/roles/${item.id}`).then((res) => {
      const newData = dataSource.filter(data => data.id !== item.id)
      setDataSource(newData)
    })
  }

  // 编辑对话框
  const handleOk = (item) => {
    setDataSource(dataSource.map((item) => {
      if (item.id === currentId) {
        return { ...item, rights: currentRightList }
      }
      return item
    }))
    axios.patch(`http://localhost:8100/roles/${currentId}`, {
      rights: currentRightList
    })
    setIsModalOpen(false)

  }

  const onCheck = (checkedKeys) => {
    console.log(checkedKeys);
    setcurrentRightList(checkedKeys)
  }

  // 递归函数，用于修改对象的"label"为"title"
  const updateLabelToTitle = (data) => {
    return data.map(item => {
      const { label: title, children, ...rest } = item;
      const updatedItem = { title, ...rest };

      if (children && children.length > 0) {
        updatedItem.children = updateLabelToTitle(children);
      }

      return updatedItem;
    });
  };

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
      <Modal title="権限一覧" open={isModalOpen} onOk={handleOk} onCancel={() => { setIsModalOpen(false) }}>
        <Tree checkable treeData={rightList} checkedKeys={currentRightList} onCheck={onCheck} checkStrictly={false} />
      </Modal>
    </div>
  )
}

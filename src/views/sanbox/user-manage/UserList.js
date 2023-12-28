import React, { useState, useEffect, useRef } from 'react'
import {
  EditOutlined, DeleteOutlined, ExclamationCircleFilled, UserAddOutlined
} from '@ant-design/icons'
import { Table, Button, Modal, Switch } from 'antd'
import axios from 'axios'
import UserForm from '../../../components/user-manage/UserForm1.js'
const { confirm } = Modal

export default function RIghtList() {
  const [dataSource, setDataSource] = useState([])
  const [open, setOpen] = useState(false)
  const [update, setUpdate] = useState(false)
  const [regionList, setRegionList] = useState([])
  const [roleList, setRoleList] = useState([])
  const [isDisabledUp, setIsDisabledUp] = useState(false)
  const [currentId, setCurrentId] = useState(0)
  const addForm = useRef(null)
  const updateForm = useRef(null)
  //本应该后端直接返回数据，node到时候看下能不能改
  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))


  useEffect(() => {
    const getData = async () => {
      await axios.get('http://localhost:8100/users?_expand=role').then((res) => {
        // 如果是管理员直接展示所有数据,不是管理员根据id遍历
        setDataSource(roleId === 1 ? res.data : [
          ...res.data.filter(item => item.username === username),
          ...res.data.filter(item => item.region === region && item.roleId === 3)
        ])
      })
    }
    getData()
  }, [roleId, region, username])
  useEffect(() => {
    const getData = async () => {
      await axios.get('http://localhost:8100/regions').then((res) => {
        setRegionList(res.data)
      })
    }
    getData()
  }, [])
  useEffect(() => {
    const getData = async () => {
      await axios.get('http://localhost:8100/roles').then((res) => {
        setRoleList(res.data)
      })
    }
    getData()
  }, [])

  //表格数据
  const columns = [
    {
      title: '地域',
      dataIndex: 'region',
      filters: [...regionList.map(item => ({
        text: item.title,
        value: item.value
      })),
      {
        text: '全球',
        value: ''
      }],
      onFilter: (value, record) => record.region === value,
      render: (region) => {
        return <b>{region ? region : '全球'}</b>
      }
    },
    {
      title: '角色名',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.roleId === roleId ? true : item.default} onChange={() => handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button style={{ marginRight: '5px' }} type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => updateData(item)} />
          <Button danger shape="circle" icon={<DeleteOutlined />} disabled={item.roleId === roleId ? true : item.default} onClick={() => showConfirm(item)} />
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
    })
  }
  //弹出框确认方法
  const okMethod = (item) => {
    axios.delete(`http://localhost:8100/users/${item.id}`).then((res) => {
      getNewData('users')
    })
  }
  //用户数据追加
  const addFormData = () => {
    addForm.current.validateFields().then(value => {
      addForm.current.resetFields()
      setOpen(false)
      axios.post('http://localhost:8100/users', {
        ...value,
        "roleState": true,
        "default": false,
      }).then(() => {
        getNewData('users')
      })
    }).catch(err => {
      console.log(err)
    })
  }

  const handleChange = (item) => {
    axios.patch(`http://localhost:8100/users/${item.id}`, {
      roleState: !item.roleState
    }).then(() => {
      getNewData('users')
    })
  }

  //用户编辑
  const updateData = async (item) => {
    setCurrentId(item.id)
    await setUpdate(true)
    if (item.roleId === 1) {
      setIsDisabledUp(true)
    } else {
      setIsDisabledUp(false)
    }
    updateForm.current.setFieldsValue(item)

  }
  const updateFormData = (item) => {
    updateForm.current.validateFields().then(value => {
      axios.patch(`http://localhost:8100/users/${currentId}`, {
        ...value,
        "roleState": true,
        "default": false,
      }).then(() => {
        getNewData('users')
        setUpdate(false)
      }).catch(err => {
        console.log(err)
      })
    }).catch((err) => {
      console.log(err);
    })
  }
  // Userデータ更新
  const getNewData = (key) => {
    axios.get(`http://localhost:8100/${key}?_expand=role`).then((res) => {
      setDataSource(roleId === 1 ? res.data : [
        ...res.data.filter(item => item.username === username),
        ...res.data.filter(item => item.region === region && item.roleId === 3)
      ])
    })
  }


  return (
    <div>
      <Button type="primary" icon={<UserAddOutlined />} onClick={() => { setOpen(true) }}>
        追加
      </Button>
      <Table style={{ overflow: 'auto' }} dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{
        pageSize: 6
      }} />
      <Modal
        open={open}
        title="要員の追加"
        okText="確認"
        cancelText="キャンセル"
        onCancel={() => {
          setOpen(false)
          addForm.current.resetFields()
        }}
        onOk={addFormData}
      >
        <UserForm ref={addForm} regionList={regionList} roleList={roleList}></UserForm>
      </Modal>
      <Modal
        open={update}
        title="要員の更新"
        okText="確認"
        cancelText="キャンセル"
        onCancel={() => { setUpdate(false) }}
        onOk={updateFormData}
      >
        <UserForm ref={updateForm} regionList={regionList} roleList={roleList} isDisabledUp={isDisabledUp}
          getTime={Date.now()} isedit={true}></UserForm>
      </Modal>
    </div>
  )
}

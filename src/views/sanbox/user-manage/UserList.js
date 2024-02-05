import React, { useState, useEffect, useRef } from 'react'
import {
  EditOutlined, DeleteOutlined, ExclamationCircleFilled, UserAddOutlined
} from '@ant-design/icons'
import { Table, Button, Modal, Switch } from 'antd'
import { useSelector } from 'react-redux'
import axiosInstance from '../../../utils/index'
import UserForm from '../../../components/user-manage/UserForm1.js'
const { confirm } = Modal

export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [open, setOpen] = useState(false)
  const [update, setUpdate] = useState(false)
  const [regionList, setRegionList] = useState([])
  const [roleList, setRoleList] = useState([])
  const [isDisabledUp, setIsDisabledUp] = useState(false)
  const [currentId, setCurrentId] = useState(0)
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const userInfoData = useSelector(state => state.UserInfoReducer)

  useEffect(() => {
    if (userInfoData) {
      axiosInstance.get('/getaccount').then((res) => {

        const sortedData = res.data.data.sort((a, b) => a.id - b.id)
        setDataSource(userInfoData.roleId === 1 ? sortedData : [
          ...sortedData.filter(item => item.username === userInfoData.username),
          ...sortedData.filter(item => item.region === userInfoData.region && item.roleId !== userInfoData.roleId)
        ])
      }).catch((err) => {
        console.log(err);
      })
    }
  }, [userInfoData])

  useEffect(() => {
    axiosInstance.get('/allregions').then((res) => {
      setRegionList(res.data)
    }).catch((err) => {
      console.log(err);
    })
  }, [])

  useEffect(() => {
    axiosInstance.get('/allroles').then((res) => {
      setRoleList(res.data)
    }).catch((err) => {
      console.log(err);
    })
  }, [])

  //表格数据
  const columns = [
    {
      title: 'エリア',
      dataIndex: 'region',
      filters: [...regionList.map(item => ({
        text: item.title,
        value: item.value
      }))],
      onFilter: (value, record) => record.region === value,
      render: (region) => {
        return <b>{region}</b>
      }
    },
    {
      title: 'ロール名',
      dataIndex: 'roleName',
      render: (roleName) => {
        return roleName
      }
    },
    {
      title: 'ユーザー名',
      dataIndex: 'username'
    },
    {
      title: 'ステータス',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState === 0 ? true : false} disabled={item.roleId === userInfoData.roleId ? true : (item.default === 0 ? true : false)} onChange={() => handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button style={{ marginRight: '5px' }} type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default === 0 ? true : false} onClick={() => updateData(item)} />
          <Button danger shape="circle" icon={<DeleteOutlined />} disabled={item.roleId === userInfoData.roleId ? true : (item.default === 0 ? true : false)} onClick={() => showConfirm(item)} />
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
    axiosInstance.delete(`/deleteusers/${item.id}`).then((res) => {
      getNewData()
    })
  }
  //用户数据追加
  const addFormData = () => {
    addForm.current.validateFields().then(value => {
      addForm.current.resetFields()
      setOpen(false)
      axiosInstance.post('/addaccount', value).then((res) => {
        getNewData()
      })
    }).catch(err => {
      console.log(err)
    })
  }

  const handleChange = (item) => {
    axiosInstance.patch(`/changerolestate/${item.id}`, {
      roleState: !item.roleState
    }).then(() => {
      getNewData()
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
      axiosInstance.patch(`/updateusers/${currentId}`, value).then(() => {
        getNewData()
        setUpdate(false)
      }).catch(err => {
        console.log(err)
      })
    }).catch((err) => {
      console.log(err);
    })
  }
  // Userデータ更新
  const getNewData = () => {
    axiosInstance.get('/getaccount').then((res) => {
      const sortedData = res.data.data.sort((a, b) => a.id - b.id)
      setDataSource(userInfoData.roleId === 1 ? sortedData : [
        ...sortedData.filter(item => item.username === userInfoData.username),
        ...sortedData.filter(item => item.region === userInfoData.region && item.roleId !== userInfoData.roleId)
      ])
    }).catch((err) => {
      console.log(err);
    })
  }


  return (
    <div>
      <Button type="primary" icon={<UserAddOutlined />} onClick={() => { setOpen(true) }}>
        追加
      </Button>
      <Table style={{ overflow: 'auto' }} dataSource={dataSource} columns={columns} rowKey={(item) => item.id} locale={{ emptyText: ' ' }} pagination={{
        pageSize: 7
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
        title="ユーザー更新"
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

import React, { useState, useEffect } from 'react'
import {
  SettingOutlined, DeleteOutlined, ExclamationCircleFilled, UserAddOutlined
} from '@ant-design/icons';
import { Table, Button, Modal, Switch, Form, Input, Select } from 'antd'
import axios from 'axios'
const { confirm } = Modal;

export default function RIghtList() {
  const [dataSource, setDataSource] = useState([])
  const [open, setOpen] = useState(false);
  const [regionList, setRegionList] = useState([])
  const [roleList, setRoleList] = useState([])

  useEffect(() => {
    const getData = async () => {
      await axios.get('http://localhost:8100/users?_expand=role').then((res) => {
        setDataSource(res.data)
      })
    }
    getData()
  }, [])
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
        setRoleList(res.data.map((item) => {
          const { id: value, roleName: label } = item;
          const newData = { value, label };
          return newData
        }))
      })
    }
    getData()
  }, [])

  //表格数据
  const columns = [
    {
      title: '地域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region ? region : '全球'}</b>
      }
    },
    {
      title: '角色名',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
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
        return <Switch checked={roleState} disabled={item.default}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="primary" shape="circle" icon={<SettingOutlined />} disabled={item.default} />&nbsp;&nbsp;
          <Button danger shape="circle" icon={<DeleteOutlined />} disabled={item.default} onClick={() => showConfirm(item)} />
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
  // //switch控制权限
  // const switchMethod = (item) => {
  //   item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
  //   setDataSource([...dataSource])
  //   if (item.grade === 1) {
  //     axios.patch(`http://localhost:8100/rights/${item.id}`, {
  //       pagepermisson: item.pagepermisson
  //     })
  //   } else {
  //     axios.patch(`http://localhost:8100/children/${item.id}`, {
  //       pagepermisson: item.pagepermisson
  //     })
  //   }

  // }

  const handleChange = () => {

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
        okText="追加"
        cancelText="キャンセル"
        onCancel={() => { setOpen(false) }}
        onOk={() => {
          // form
          //   .validateFields()
          //   .then((values) => {
          //     form.resetFields();
          //     onCreate(values);
          //   })
          //   .catch((info) => {
          //     console.log('Validate Failed:', info);
          //   });
        }}
      >
        <Form layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: 'Please input the title of collection!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: 'Please input the title of collection!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="region"
            label="地区"
            rules={[
              {
                required: true,
                message: 'Please input the title of collection!',
              },
            ]}
          >
            <Select
              onChange={handleChange}
              options={regionList}
            />
          </Form.Item>
          <Form.Item
            name="roleId"
            label="角色"
            rules={[
              {
                required: true,
                message: 'Please input the title of collection!',
              },
            ]}
          >
            <Select
              onChange={handleChange}
              options={roleList}
            />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  )
}

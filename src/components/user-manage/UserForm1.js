import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'

const UserForm1 = forwardRef((props, ref) => {
  const [isDisabled, setIsDisabled] = useState(false)
  const [regionList, setRegionList] = useState([])
  const [roleList, setRoleList] = useState([])

  //这是从localStorage拿的,node的时候再考虑如何获取这些信息
  const { role: { roleName }, region, roleId } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    // 判断此时点击的是更新还是编辑,以及点击的人是谁
    if (props.isedit) {
      if (roleId === 1) {
        setRegionList(props.regionList)
        //角色设置
        const newRoleList = props.roleList.map(obj => {
          if (obj.id <= roleId) {
            return { ...obj, disabled: true }
          }
          return obj
        })
        setRoleList(newRoleList)
      } else {
        // 区域设置
        const newRegionList = props.regionList.map(obj => ({
          ...obj,
          disabled: true
        }))
        setRegionList(newRegionList)
        //角色设置
        const newRoleList = props.roleList.map(obj => {
          if (obj.id <= roleId) {
            return { ...obj, disabled: true }
          }
          return obj
        })
        setRoleList(newRoleList)

      }
    } else {
      if (roleId === 1) {
        setRegionList(props.regionList)
        //角色设置
        const newRoleList = props.roleList.map(obj => {
          if (obj.id <= roleId) {
            return { ...obj, disabled: true }
          }
          return obj
        })
        setRoleList(newRoleList)
      } else {
        // 区域设置
        const newRegionList = props.regionList.map(obj => {
          if (obj.title !== region) {
            return { ...obj, disabled: true }
          }
          return { ...obj, disabled: false }
        })
        setRegionList(newRegionList)
        //角色设置
        const newRoleList = props.roleList.map(obj => {
          if (obj.id <= roleId) {
            return { ...obj, disabled: true }
          }
          return obj
        })
        setRoleList(newRoleList)
      }
    }
    setIsDisabled(props.isDisabledUp)
  }, [props.getTime])

  const handleChange = (value) => {
    if (value === 1) {
      setIsDisabled(true)
      ref.current.setFieldsValue({
        region: ''
      })
    } else {
      setIsDisabled(false)
    }
  }

  return (
    <Form layout="vertical" ref={ref}>
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
          fieldNames={{ label: 'roleName', value: 'id' }}
        />
      </Form.Item>
      <Form.Item
        name="region"
        label="地区"
        rules={isDisabled ? [] : [
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Select
          disabled={isDisabled}
          onChange={() => { }}
          options={regionList}
        />
      </Form.Item>
    </Form>
  )
})

export default UserForm1
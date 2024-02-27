import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const UserForm1 = forwardRef((props, ref) => {
  const userInfoData = useSelector(state => state.UserInfoReducer)
  const [isDisabled, setIsDisabled] = useState(false)
  const [regionList, setRegionList] = useState([])
  const [roleList, setRoleList] = useState([])

  useEffect(() => {
    // 判断此时点击的是更新还是编辑,以及点击的人是谁
    if (userInfoData) {
      if (props.isedit) {
        if (userInfoData.roleId === 1) {
          setRegionList(props.regionList)
          //角色设置
          const newRoleList = props.roleList.map(obj => {
            if (obj.roleId <= userInfoData.roleId) {
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
            if (obj.roleId <= userInfoData.roleId) {
              return { ...obj, disabled: true }
            }
            return obj
          })
          setRoleList(newRoleList)

        }
      } else {
        if (userInfoData.roleId === 1) {
          setRegionList(props.regionList)
          //角色设置
          const newRoleList = props.roleList.map(obj => {
            if (obj.roleId <= userInfoData.roleId) {
              return { ...obj, disabled: true }
            }
            return obj
          })
          setRoleList(newRoleList)
        } else {
          // 区域设置
          const newRegionList = props.regionList.map(obj => {
            if (obj.title !== userInfoData.region) {
              return { ...obj, disabled: true }
            }
            return { ...obj, disabled: false }
          })
          setRegionList(newRegionList)
          //角色设置
          const newRoleList = props.roleList.map(obj => {
            if (obj.roleId <= userInfoData.roleId) {
              return { ...obj, disabled: true }
            }
            return obj
          })
          setRoleList(newRoleList)
        }
      }
    }

    setIsDisabled(props.isDisabledUp)
  }, [props.isDisabledUp, props.isedit, props.regionList, props.roleList, userInfoData])

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
        label="ユーザー名"
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
        label="パスワード"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Input.Password
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
      <Form.Item
        name="roleId"
        label="ロール"
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
          fieldNames={{ label: 'roleName', value: 'roleId' }}
        />
      </Form.Item>
      <Form.Item
        name="region"
        label="エリア"
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
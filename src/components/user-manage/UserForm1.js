import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'

const UserForm1 = forwardRef((props, ref) => {
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
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
          options={props.roleList}
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
          options={props.regionList}
        />
      </Form.Item>
    </Form>
  )
})

export default UserForm1
import React, { useState, useEffect } from 'react'
import { Steps, Button, Form, Input, Select } from 'antd'
import style from './NewsAdd.module.css'
import AxiosInstance from '../../../utils/axios'

export default function NewsAdd() {
  const [current, setCurrent] = useState(0)
  const [categoriesList, setCategoriesList] = useState([])
  const [form] = Form.useForm();

  useEffect(() => {
    AxiosInstance.get('/categories').then((res) => {
      setCategoriesList(res.data)
    })
  }, [])

  const items = [
    {
      title: '基本信息',
      description: '新闻标题,新闻分类',
    },
    {
      title: '新闻内容',
      description: '新闻主体内容',
    },
    {
      title: '新闻提交',
      description: '保存草稿或提交审核',
    },
  ]

  const handleNext = () => {
    if (current === 0) {
      form.validateFields().then((res) => {
        setCurrent(current + 1)
      }).catch((err) => {
        console.log(err);
      })
    } else {
      setCurrent(current + 1)
    }

  }

  return (
    <div>
      <div>NewsAdd</div>
      <Steps style={{ marginTop: 20 }}
        current={current}
        items={items}
      />

      <div style={{ marginTop: 50 }} className={current === 0 ? '' : style.active}>
        <Form
          form={form}
          labelCol={{
            span: 2,
          }}
          wrapperCol={{
            span: 12,
          }}

        >
          <Form.Item
            label="新闻标题"
            name="title"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="新闻分类"
            name="categoryId"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Select
              // onChange={handleChange}
              options={categoriesList}
            />
          </Form.Item>
        </Form>
      </div>

      <div className={current === 1 ? '' : style.active}>222</div>
      <div className={current === 2 ? '' : style.active}>333</div>

      <div style={{ marginTop: 50 }}>
        <Button style={{ marginRight: 20 }} disabled={current > 0 ? false : true} type='primary' onClick={() => setCurrent(current - 1)} >上一步</Button>
        <Button style={{ marginRight: 20 }} type='primary' disabled={current < 2 ? false : true} onClick={() => handleNext()}>下一步</Button>
        {current === 2 && (
          <div>
            <Button style={{ marginRight: 20 }} type='primary'>保存草稿箱</Button>
            <Button type='primary'>提交审核</Button>
          </div>
        )}
      </div>
    </div >
  )
}

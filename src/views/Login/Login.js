import React from "react";
import {
  LockOutlined, UserOutlined
} from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom'
import axiosinstance from '../../utils/index'
import './index.css'



export default function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    axiosinstance.post('/login', {
      username: values.username,
      password: values.password
    }).then((res) => {
      localStorage.setItem('nodeToken', JSON.stringify(res.data.token))
      if (res.data.token) {
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        message.error('账号不存在或密码错误')
      }
    }).catch((err) => {
      console.log(err);
    })
  }


  return <div className="loginBack">
    <div className="loginClass">
      <h3>ニュース情報管理システム</h3>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button style={{ width: '100%' }} type="primary" htmlType="submit" className="login-form-button">
            ログイン
          </Button>
        </Form.Item>
      </Form>
    </div>
  </div>;
}

import React from "react";
import {
  LockOutlined, UserOutlined
} from '@ant-design/icons';
import { Button, Form, Input, message, Card, Tag } from 'antd';
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
        message.error('アカウントまたはパスワードが間違えました')
      }
    }).catch((err) => {
      console.log(err);
    })
  }


  return <div className="loginBack">
    <Card className="setsumei" title="説明" style={{ position: 'fixed', top: '1%', left: '1%', fontWeight: '700' }}>
      <p><i>ゲストサイド :</i><Tag color="orange">.../news</Tag></p>
      <p><i>スーパー管理者 :</i><Tag color="orange">username : admin</Tag><Tag color="orange">password : 123</Tag></p>
      <p><i>他のアカウント :</i><Tag color="orange">password : 123</Tag></p>
      <p><i>注意 :</i><Tag color="orange">既存のニュースを削除しないでください。</Tag></p>
    </Card>
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
          rules={[{ required: true, message: 'ユーザー名を入力してください' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'パスワードを入力してください' }]}
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

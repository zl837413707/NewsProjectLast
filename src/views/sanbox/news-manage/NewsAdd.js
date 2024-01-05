import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Steps, Button, Form, Input, Select, message } from 'antd'
import style from './NewsAdd.module.css'
import AxiosInstance from '../../../utils/axios'
import NewEditor from '../../../components/news-manage/NewEditor'

export default function NewsAdd() {
  const [current, setCurrent] = useState(0)
  const [categoriesList, setCategoriesList] = useState([])
  const [newsInfo, setNewsInfo] = useState({})
  const [newsContent, setNewsContent] = useState('')
  const [form] = Form.useForm()
  const userInfo = JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()

  useEffect(() => {
    AxiosInstance.get('/categories').then((res) => {
      const newData = res.data.map(item => {
        return { label: item.title, value: item.id }
      })
      setCategoriesList(newData)
    })
  }, [])

  const items = [
    {
      title: '基本情報'
    },
    {
      title: 'ニュース内容'
    },
    {
      title: 'ニュース提出'
    },
  ]
  //  点击下一步
  const handleNext = () => {
    if (current === 0) {
      form.validateFields().then((res) => {
        //current0的数据
        setNewsInfo(res)
        setCurrent(current + 1)
      }).catch((err) => {
        console.log(err);
      })
    } else {
      if (isEmptyContent(newsContent)) {
        message.error('ニュース内容を入力してください！')
      } else {
        setCurrent(current + 1)
      }

    }
  }

  const hadleSubmit = (state) => {
    AxiosInstance.post('/news', {
      ...newsInfo,
      "content": newsContent,
      "region": userInfo.region ? userInfo.region : '全球',
      "author": userInfo.username,
      "roleId": userInfo.roleId,
      "auditState": state,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
    }).then(() => {
      navigate(state === 0 ? '/news-manage/draft' : '/audit-manage/list')
      message.success('提出成功')
    })
  }

  const isEmptyContent = (content) => {
    const trimmedContent = content.trim()
    const regex = /^(\s*<p>\s*<\/p>\s*)*$/gi
    return trimmedContent === '' || regex.test(trimmedContent)
  };

  return (
    <div style={{ width: 1200, margin: '0 auto' }}>
      <Steps style={{ marginTop: 20 }}
        current={current}
        items={items}
      />
      {/* current0 */}
      <div style={{ marginTop: 50 }}>
        <div className={current === 0 ? '' : style.active}>
          <Form
            form={form}
            labelCol={{
              span: 2,
            }}
            wrapperCol={{
              span: 22,
            }}

          >
            <Form.Item
              label="ニュースタイトル"
              name="title"
              rules={[
                {
                  required: true,
                  message: 'ニュースタイトルを入力してください！',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="ニュース分類"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: 'ニュース分類を選んでください！',
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
        {/* current1 */}
        <div className={current === 1 ? '' : style.active}>
          <NewEditor getEditorData={(data) => {
            setNewsContent(data)
          }}></NewEditor>
        </div>
        <div className={current === 2 ? '' : style.active}></div>
      </div>
      <div style={{ marginTop: 50 }}>
        <Button style={{ marginRight: 20 }} disabled={current > 0 ? false : true} type='primary' onClick={() => setCurrent(current - 1)} >戻る</Button>
        <Button style={{ marginRight: 20 }} type='primary' disabled={current < 2 ? false : true} onClick={() => handleNext()}>次へ</Button>
        {current === 2 && (
          <span>
            <Button style={{ marginRight: 20 }} onClick={() => { hadleSubmit(0) }}>下書きを保存する</Button>
            <Button onClick={() => { hadleSubmit(1) }}>審査を提出する</Button>
          </span>
        )}
      </div>
    </div >
  )
}

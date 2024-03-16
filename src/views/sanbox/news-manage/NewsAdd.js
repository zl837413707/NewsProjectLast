import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Steps, Button, Form, Input, Select, message } from 'antd'
import style from './NewsAdd.module.css'
import axiosInstance from '../../../utils/index'
import NewEditor from '../../../components/news-manage/NewEditor'

export default function NewsAdd() {
  const [current, setCurrent] = useState(0)
  const [categoriesList, setCategoriesList] = useState([])
  const [newsInfo, setNewsInfo] = useState({})
  const [newsContent, setNewsContent] = useState('')
  const [form] = Form.useForm()
  const userInfoData = useSelector(state => state.UserInfoReducer)
  const navigate = useNavigate()

  useEffect(() => {
    axiosInstance.get('/getcategories').then((res) => {
      const newdata = res.data.map(item => {
        return { label: item.title, value: item.id }
      })
      setCategoriesList(newdata)
    }).catch(err => {
      console.log(err)
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
  //  次
  const handleNext = () => {
    if (current === 0) {
      form.validateFields().then((res) => {
        setNewsInfo(res)
        setCurrent(current + 1)
      }).catch((err) => {
        console.log(err)
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
    axiosInstance.post('addnews', {
      ...newsInfo,
      "content": newsContent,
      "region": userInfoData.region ? userInfoData.region : 'グローバル',
      "author": userInfoData.username,
      "roleId": userInfoData.roleId,
      "auditState": state,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
    }).then(() => {
      navigate(state === 0 ? '/news-manage/draft' : '/audit-manage/list')
      message.success('成功')
    })
  }

  const isEmptyContent = (content) => {
    const trimmedContent = content.trim()
    const regex = /^(\s*<p>\s*<\/p>\s*)*$/gi
    return trimmedContent === '' || regex.test(trimmedContent)
  }

  return (
    <div style={{ margin: '0 auto' }}>
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
              label="タイトル"
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
              label="分類"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: 'ニュース分類を選んでください！',
                },
              ]}
            >
              <Select
                options={categoriesList}
              />
            </Form.Item>
          </Form>
        </div>
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

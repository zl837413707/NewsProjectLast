import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Steps, Button, Form, Input, Select, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import style from './NewsAdd.module.css'
import axiosInstance from '../../../utils/index'
import NewEditor from '../../../components/news-manage/NewEditor'

export default function NewsAdd() {
  const [current, setCurrent] = useState(0)
  const [categoriesList, setCategoriesList] = useState([])
  const { id } = useParams()
  const [newsInfo, setNewsInfo] = useState({})
  const [newsContent, setNewsContent] = useState('')
  const [form] = Form.useForm()
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

  useEffect(() => {
    axiosInstance.get(`/getallnews`).then((res) => {
      const newData = res.data.filter(item => item.id.toString() === id)
      form.setFieldsValue({
        title: newData[0].newsTitle,
        categoryId: newData[0].categoryId
      })
      setNewsContent(newData[0].content)
    })
  }, [form, id])

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
        message.error('ニュース内容を入力してください')
      } else {
        setCurrent(current + 1)
      }

    }
  }

  const hadleSubmit = (state) => {
    axiosInstance.patch(`/updatenewscontent/${id}`, {
      ...newsInfo,
      "content": newsContent,
      "auditState": state,
    }).then(() => {
      navigate('/news-manage/draft')
      message.success(`修正成功`)
    })
  }

  const isEmptyContent = (content) => {
    const trimmedContent = content.trim()
    const regex = /^(\s*<p>\s*<\/p>\s*)*$/gi
    return trimmedContent === '' || regex.test(trimmedContent)
  }

  return (
    <div style={{ margin: '0 auto' }}>
      <Button style={{ marginBottom: 20 }} icon={<ArrowLeftOutlined />} onClick={() => { navigate(-1) }} ></Button>
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
                  message: 'タイトルを入力してください',
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
                  message: '分類を選んでください',
                },
              ]}
            >
              <Select
                options={categoriesList}
              />
            </Form.Item>
          </Form>
        </div>
        {/* current1 */}
        <div className={current === 1 ? '' : style.active}>
          <NewEditor getEditorData={(data) => {
            setNewsContent(data)
          }} editorContent={newsContent}></NewEditor>
        </div>
        <div className={current === 2 ? '' : style.active}></div>
      </div>
      <div style={{ marginTop: 50 }}>
        <Button style={{ marginRight: 20 }} disabled={current > 0 ? false : true} type='primary' onClick={() => setCurrent(current - 1)} >戻る</Button>
        <Button style={{ marginRight: 20 }} type='primary' disabled={current < 2 ? false : true} onClick={() => handleNext()}>次へ</Button>
        {current === 2 && <Button style={{ marginRight: 20 }} onClick={() => { hadleSubmit(0) }}>更新</Button>}
      </div>
    </div >
  )
}


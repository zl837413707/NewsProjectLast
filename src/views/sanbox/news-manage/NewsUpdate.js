import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Steps, Button, Form, Input, Select, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import style from './NewsAdd.module.css'
import AxiosInstance from '../../../utils/axios'
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
    AxiosInstance.get('/categories').then((res) => {
      const newData = res.data.map(item => {
        return { label: item.title, value: item.id }
      })
      setCategoriesList(newData)
    })
  }, [])

  useEffect(() => {
    AxiosInstance.get(`/news/${id}?_expand=category&_expand=role`).then((res) => {
      form.setFieldsValue({
        title: res.data.title,
        categoryId: res.data.category.id
      })
      setNewsContent(res.data.content)
    })
  }, [form, id])

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
  //  点击下一步
  const handleNext = () => {
    if (current === 0) {
      form.validateFields().then((res) => {
        console.log(res);
        //current0的数据
        setNewsInfo(res)
        setCurrent(current + 1)
      }).catch((err) => {
        console.log(err);
      })
    } else {
      if (isEmptyContent(newsContent)) {
        message.error('新闻内容不能为空')
      } else {
        setCurrent(current + 1)
      }

    }
  }

  const hadleSubmit = (state) => {
    AxiosInstance.patch(`/news/${id}`, {
      ...newsInfo,
      "content": newsContent,
      "auditState": state,
      // "publishTime": 0
    }).then(() => {
      navigate(state === 0 ? '/news-manage/draft' : '/audit-manage/list')
      message.success(`请在${state === 0 ? '草稿箱' : '审核列表'}中查询你的新闻`)
    })
  }

  const isEmptyContent = (content) => {
    const trimmedContent = content.trim(); // 去除两端空格
    // 使用正则表达式匹配多个 <p> 标签或者纯空白字符
    const regex = /^(\s*<p>\s*<\/p>\s*)*$/gi;
    return trimmedContent === '' || regex.test(trimmedContent);
  };

  return (
    <div>
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
        <Button style={{ marginRight: 20 }} disabled={current > 0 ? false : true} type='primary' onClick={() => setCurrent(current - 1)} >上一步</Button>
        <Button style={{ marginRight: 20 }} type='primary' disabled={current < 2 ? false : true} onClick={() => handleNext()}>下一步</Button>
        {current === 2 && <Button style={{ marginRight: 20 }} onClick={() => { hadleSubmit(0) }}>更新</Button>}
      </div>
    </div >
  )
}


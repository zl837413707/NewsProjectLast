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
        //current0的数据
        setNewsInfo(res)
        setCurrent(current + 1)
      }).catch((err) => {
        console.log(err);
      })
    } else {
      console.log(newsContent);
      if (isEmptyContent(newsContent)) {
        message.error('新闻内容不能为空')
      } else {
        setCurrent(current + 1)
        console.log(newsInfo, newsContent);
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
      <div>NewsAdd</div>
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
        <div className={current === 2 ? '' : style.active}>333</div>
      </div>
      <div style={{ marginTop: 50 }}>
        <Button style={{ marginRight: 20 }} disabled={current > 0 ? false : true} type='primary' onClick={() => setCurrent(current - 1)} >上一步</Button>
        <Button style={{ marginRight: 20 }} type='primary' disabled={current < 2 ? false : true} onClick={() => handleNext()}>下一步</Button>
        {current === 2 && (
          <div>
            <Button style={{ marginRight: 20 }} onClick={() => { hadleSubmit(0) }}>保存草稿箱</Button>
            <Button onClick={() => { hadleSubmit(1) }}>提交审核</Button>
          </div>
        )}
      </div>
    </div >
  )
}

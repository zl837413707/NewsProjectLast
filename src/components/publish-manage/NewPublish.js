import React, { useEffect, useState } from 'react'
import { Table, Button, message, Switch, Input, Select } from 'antd'
import { useSelector } from 'react-redux'
import {
  ToTopOutlined, VerticalAlignBottomOutlined, DeleteOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import axiosInstance from '../../utils/index'
const { Option } = Select
const { Search } = Input;

export default function NewPublish(props) {
  const [dataSource, setDataSource] = useState([])
  const [category, setCategory] = useState([])
  const [currentCategory, setCurrentCategory] = useState('分類')
  const [currentSearch, setCurrentSearch] = useState('')
  const userInfoData = useSelector(state => state.UserInfoReducer)
  useEffect(() => {
    setDataSource(props.dataSource)
  }, [props.dataSource])

  useEffect(() => {
    axiosInstance.get('/getcategories').then((res) => {
      setCategory(res.data)
    }).catch(err => {
      console.log(err);
    })
  }, [])

  const buttonTxt = ['', '公開', 'オフライン', '削除']

  const buttonIcon = ['', <ToTopOutlined />, <VerticalAlignBottomOutlined />, <DeleteOutlined />]

  const selectBefore = (
    <Select value={currentCategory} onChange={(value) => { selectChange(value) }}>
      <Option value="0">全て</Option>
      {category.map(item => {
        return <Option value={item.id} key={item.id}>{item.title}</Option>
      })}
    </Select>
  )

  const selectChange = (i) => {
    setCurrentCategory(i)
  }

  const columns = [
    {
      title: 'エリア',
      dataIndex: 'region',

      onFilter: (value, record) => record.region === value,
    },
    {
      title: 'ニュースタイトル',
      dataIndex: 'newsTitle',
      render: (title, item) => {
        return (
          <Link to={`/news-manage/preview/${item.id}`}>
            {truncateString(title)}
          </Link>
        )
      }
    },
    {
      title: '作成者',
      dataIndex: 'author',
    },
    {
      title: 'ニュース分類',
      dataIndex: 'title',
      onFilter: (value, record) => record.title === value,
    },
    {
      title: '操作',
      render: (item) => {
        return <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button style={{ marginRight: '5px' }} type="primary" disabled={(userInfoData.region === item.region && userInfoData.roleId <= item.roleId) || userInfoData.roleId === 1 ? false : true} icon={buttonIcon[item.publishState]} onClick={() => {
            handleChange(item)
          }}>{buttonTxt[item.publishState]}</Button>
          {props.published === 'published' ? <Switch disabled={(userInfoData.region === item.region && userInfoData.roleId <= item.roleId && userInfoData.roleId !== 3) || userInfoData.roleId === 1 ? false : true} checkedChildren="解除" unCheckedChildren="ピン留め" onChange={() => { topChange(item) }} checked={item.top === 1 ? false : true} /> : ''}
        </div >
      }
    }
  ]

  const topChange = (item) => {
    axiosInstance.patch(`/updatenewstop/${item.id}`, { top: item.top === 1 ? 0 : 1, topTime: Date.now() }).then((res) => {
      setDataSource((prevDataSource) => {
        const updatedData = prevDataSource.map((dataItem) =>
          dataItem.id === item.id ? { ...dataItem, top: item.top === 1 ? 0 : 1 } : dataItem
        )
        return updatedData
      })
    }).catch(res => {
      console.log(res);
    })
  }

  const handleChange = (item) => {
    if (item.publishState === 1) {
      axiosInstance.patch(`/updatenewsauditstate/${item.id}`, { publishState: 2, publishTime: Date.now() }).then(() => {
        message.success('設置成功')
        getData('unpublished')
      })
    } else if (item.publishState === 2) {
      axiosInstance.patch(`/updatenewsauditstate/${item.id}`, { publishState: 3, unPublishTime: Date.now() }).then(() => {
        message.success('設置成功')
        getData('published')
      })
    } else {
      axiosInstance.patch(`/updatenewsauditstate/${item.id}`, { publishState: 4 }).then(() => {
        message.success('削除成功')
        getData('sunset')
      })
    }

  }

  const getData = (item) => {
    axiosInstance.get('/getallnews', {
      params: {
        publishState: item
      }
    }).then((res) => {
      setDataSource(res.data)
    })
  }

  const truncateString = (str) => {
    if (str.length > 50) {
      return str.substring(0, 50) + '...';
    } else {
      return str;
    }
  }

  const onSearch = (value) => {
    if (currentCategory === '分類') return message.warning('分類を選んでください')
    if (value === '') return message.warning('キーワードを入力してください')
    console.log(currentCategory + '---' + value + '---' + props.published)
    axiosInstance.get('/searchnewslimit', {
      params: {
        category: currentCategory,
        title: value,
        published: props.published
      }
    }).then((res) => {
      setDataSource(res.data)
      console.log(res.data);
    }).catch(err => {
      console.log(err);
    })
  }

  const dataReset = () => {
    setCurrentCategory('分類')
    setCurrentSearch('')
    setDataSource(props.dataSource)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Search value={currentSearch} style={{ width: '300px', marginBottom: '20px' }} size='large' placeholder="キーワード" addonBefore={selectBefore} onSearch={onSearch} onChange={(e) => setCurrentSearch(e.target.value)} enterButton />
        <Button size='large' type="primary" style={{ marginRight: '50px' }} onClick={dataReset}>リセット</Button>
      </div>

      <Table style={{ overflow: 'auto' }} dataSource={dataSource} columns={columns} pagination={{
        pageSize: 8
      }} rowKey={item => item.id} />
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import { PieChartOutlined, MailOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import AxiosInstance from '../../../utils/axios'
import ContentDetail from './ContentDetail';
import style from './index.module.css'

export default function NewsContent() {
  const [menuList, setMenuList] = useState([])
  const [currentContent, setCurrentContent] = useState('全て')
  useEffect(() => {
    const iconList = {
      1: <PieChartOutlined />,
      2: <UserOutlined />,
      3: <TeamOutlined />,
    }
    AxiosInstance.get('/categories').then((res) => {
      const newData = res.data.map(item => {
        return {
          id: item.id,
          key: item.id,
          label: item.title,
          icon: iconList[item.id],
        }
      })
      const specialItem = {
        id: 99,
        key: 99,
        label: '全て',
        icon: <MailOutlined />,
      };
      newData.unshift(specialItem)
      setMenuList(newData)
    })
  }, [])

  const onClick = (item) => {
    if (item.key === '99') {
      setCurrentContent(menuList[0].label)
    } else {
      setCurrentContent(menuList[item.key].label)
    }
  }
  return (
    <div>
      <div className={style.top}>
        <h1>欢迎访问news小站</h1>
      </div>
      <div style={{ display: 'flex' }}>
        <Menu
          onClick={(item) => { onClick(item) }}
          style={{
            width: 150,
            background: '#edf0ef',
            borderRight: 0,
            borderRadius: 10,
            marginRight: 20,
          }}
          defaultSelectedKeys={['99']}
          mode="inline"
          items={menuList}
        />
        <div style={{ width: '100%' }}>
          <ContentDetail content={currentContent} />
        </div>
      </div>
    </div>
  )
}

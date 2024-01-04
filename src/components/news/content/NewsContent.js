import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import AxiosInstance from '../../../utils/axios'
import ContentDetail from './ContentDetail';
import style from './index.module.css'
import { AllIcon, NewIcon, SocialIcon, EconomyIcon, PoliticsIcon, SportsIcon, WorldIcon } from '../../icons/icons'
import './index.css'

export default function NewsContent() {
  const [menuList, setMenuList] = useState([])
  const [currentContent, setCurrentContent] = useState('全て')
  useEffect(() => {
    const iconList = {
      1: <NewIcon />,
      2: <SocialIcon />,
      3: <EconomyIcon />,
      4: <PoliticsIcon />,
      5: <SportsIcon />,
      6: <WorldIcon />,
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
        icon: <AllIcon />,
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
  const iconColor = {
    '全て': '#cccccc',
    'IT': '#1296db',
    '社会': '#ca2826',
    '経済': '#fa9255',
    '政治': '#7373f8',
    'スポーツ': '#13227a',
    '国際': '#f4ea2a',
  }

  const fontColor = {
    '全て': '#000000',
    'IT': '#000000',
    '社会': '#ffffff',
    '経済': '#000000',
    '政治': '#ffffff',
    'スポーツ': '#ffffff',
    '国際': '#000000',
  }
  return (
    <div>
      <div className={style.top}>
        <h1 style={{ backgroundColor: iconColor[currentContent], color: fontColor[currentContent] }}>{currentContent}</h1>
      </div>
      <div style={{ display: 'flex' }}>
        <Menu
          onClick={(item) => { onClick(item) }}
          style={{
            width: 150,
            height: 313,
            background: '#f3f6f9',
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

import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import { useDispatch } from 'react-redux'
import axiosInstance from '../../../utils/index'
import ContentDetail from './ContentDetail';
import style from './index.module.css'
import { AllIcon, NewIcon, SocialIcon, EconomyIcon, PoliticsIcon, SportsIcon, WorldIcon } from '../../icons/icons'
import './index.css'

export default function NewsContent() {
  const [menuList, setMenuList] = useState([])
  const [currentContent, setCurrentContent] = useState('全て')
  const [currentId, setCurrentId] = useState(99)
  const dispatch = useDispatch()
  useEffect(() => {
    const iconList = {
      1: <NewIcon />,
      2: <SocialIcon />,
      3: <EconomyIcon />,
      4: <PoliticsIcon />,
      5: <SportsIcon />,
      6: <WorldIcon />,
    }
    axiosInstance.get('/getcategories').then((res) => {
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
    }).catch(err => {
      console.log(err);
    })
  }, [])

  const onClick = (item) => {
    if (item.key !== currentId.toString()) {
      dispatch({
        type: 'getSearchResult',
        payload: []
      })
      if (item.key === '99') {
        setCurrentContent(menuList[0].label)
        setCurrentId(menuList[0].id)

      } else {
        setCurrentContent(menuList[item.key].label)
        setCurrentId(menuList[item.key].id)
      }
    }

  }
  const iconColor = {
    99: '#e6ece6',
    1: '#7cb4d4',
    2: '#c66665',
    3: '#ffb38a',
    4: '#9292f1',
    5: '#353e72',
    6: '#eee78c',
  }

  const fontColor = {
    99: '#000000',
    1: '#000000',
    2: '#ffffff',
    3: '#000000',
    4: '#ffffff',
    5: '#ffffff',
    6: '#000000',
  }
  return (
    <div style={{ width: '1200px', margin: '0 auto' }}>
      <div className={style.top}>
        <h1 style={{ backgroundColor: iconColor[currentId], color: fontColor[currentId] }}>{currentContent}</h1>
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

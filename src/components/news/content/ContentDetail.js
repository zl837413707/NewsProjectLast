import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pagination, Tag, Button, Dropdown, Avatar } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { UserOutlined, PushpinTwoTone } from '@ant-design/icons'
import moment from 'moment'
import axiosInstance from '../../../utils/index'
import _ from 'lodash'
import style from './index.module.css'
import { NewIcon, SocialIcon, EconomyIcon, PoliticsIcon, SportsIcon, WorldIcon } from '../../icons/icons'

const sortName = {
  publishTimeL: '公開時間の遅い順',
  publishTimeE: '公開時間の早い順',
  access: 'アクセス数が多い順',
  like: 'いいね数の多い順'
}

export default function ContentDetail(props) {
  const [newsList, setNewsList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(7)
  const [totalItems, setTotalItems] = useState(0)
  const sorrtResult = useSelector(state => state.SortReducer)
  const [currentSort, setCurrentSort] = useState(sortName[sorrtResult.payload])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const searchResult = useSelector(state => state.SearchReducer)


  useEffect(() => {
    axiosInstance.get('/getallnews', {
      params: {
        publishState: 'published'
      }
    }).then((res) => {
      const storedPage = localStorage.getItem('currentPage');
      if (storedPage) {
        setCurrentPage(parseInt(storedPage, 10));
      }

      const newData = Object.entries(_.groupBy(res.data, item => item.title))
      const newList = []
      newData.forEach(item => {
        if (item[0] === props.content || props.content === '全て') {
          newList.push(...item[1])
        }
      })
      let newSearchResult = []
      if (searchResult.data) {
        newSearchResult = [...searchResult.data]
      }


      if (sorrtResult.payload === 'publishTimeL') {
        newList.sort((a, b) => b.publishTime - a.publishTime)
        if (searchResult.data !== undefined) {
          newSearchResult.sort((a, b) => b.publishTime - a.publishTime)
        }
      } else if (sorrtResult.payload === 'publishTimeE') {
        newList.sort((a, b) => a.publishTime - b.publishTime)
        if (searchResult.data !== undefined) {
          newSearchResult.sort((a, b) => a.publishTime - b.publishTime)
        }
      } else if (sorrtResult.payload === 'access') {
        newList.sort((a, b) => b.view - a.view)
        if (searchResult.data !== undefined) {
          newSearchResult.sort((a, b) => b.view - a.view)
        }
      } else if (sorrtResult.payload === 'like') {
        newList.sort((a, b) => b.star - a.star)
        if (searchResult.data !== undefined) {
          newSearchResult.sort((a, b) => b.star - a.star)
        }
      }

      if (Object.values(searchResult).length !== 1 && Object.values(searchResult).length !== 0) {
        newSearchResult.sort((a, b) => {
          if (a.top === 0 && b.top === 0) {
            return b.topTime - a.topTime
          }
          return a.top - b.top
        })
        setNewsList(newSearchResult)
        setTotalItems(newSearchResult.length);
      } else {
        newList.sort((a, b) => {
          if (a.top === 0 && b.top === 0) {
            return b.topTime - a.topTime
          }
          return a.top - b.top
        })
        setNewsList(newList)
        setTotalItems(newList.length)
      }

    })
  }, [props.content, searchResult, sorrtResult])


  const iconList = {
    1: <NewIcon />,
    2: <SocialIcon />,
    3: <EconomyIcon />,
    4: <PoliticsIcon />,
    5: <SportsIcon />,
    6: <WorldIcon />,
  }

  const iconColor = {
    1: '#7cb4d4',
    2: '#c66665',
    3: '#ffb38a',
    4: '#9292f1',
    5: '#353e72',
    6: '#eee78c',
  }


  let startIndex = (currentPage - 1) * pageSize
  let endIndex = startIndex + pageSize
  if (newsList.length <= 7) {
    startIndex = 0
    endIndex = 7
  }
  const currentDisplayItems = newsList.slice(startIndex, endIndex)

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page)
    localStorage.setItem('currentPage', page.toString());
  }

  const newsDetail = (item) => {
    navigate(`/detail/${item.id}`)
  }

  const HighlightText = ({ text, highlight }) => {
    if (!highlight) {
      return <span style={{ wordBreak: 'break-all', width: '500px', display: 'inline-block', fontSize: '18px' }}>{text}</span>;
    }

    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) => (
          regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
        ))}
      </span>
    );
  }


  const items = [
    {
      key: '1',
      label: (
        <span onClick={() => { dataSort('publishTimeL') }}>
          公開時間の遅い順
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span onClick={() => { dataSort('publishTimeE') }}>
          公開時間の早い順
        </span>
      ),
    },
    {
      key: '3',
      label: (
        <span onClick={() => { dataSort('access') }}>
          アクセス数が多い順
        </span>
      ),
    },
    {
      key: '4',
      label: (
        <span onClick={() => { dataSort('like') }}>
          いいね数の多い順
        </span>
      ),
    },

  ]

  const dataSort = (sortType) => {
    if (currentSort === sortName[sortType]) return
    if (sortType === 'publishTimeL') {
      dispatch({
        type: 'getSortResult',
        payload: 'publishTimeL'
      })
    } else if (sortType === 'publishTimeE') {
      dispatch({
        type: 'getSortResult',
        payload: 'publishTimeE'
      })
    } else if (sortType === 'access') {
      dispatch({
        type: 'getSortResult',
        payload: 'access'
      })
    } else if (sortType === 'like') {
      dispatch({
        type: 'getSortResult',
        payload: 'like'
      })
    }
    setCurrentSort(sortName[sortType])
  }


  return (
    <div style={{ position: 'relative', paddingTop: '30px' }}>
      <Dropdown
        menu={{
          items,
        }}
        placement="bottomLeft"
        arrow
      >
        <Button style={{ position: 'absolute', right: 0, top: 0 }}>{currentSort}</Button>
      </Dropdown>
      <ul>
        {currentDisplayItems.map((item, index) => (
          <li className={style.liStyle} key={index} onClick={() => { newsDetail(item) }}>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              {item.top === 0 ? <PushpinTwoTone style={{ position: 'absolute', left: '-30px', top: '-10px', fontSize: '20px' }} /> : ''}
              <Avatar size={64} src={item.avatar ? `http://127.0.0.1:8103/images/${item.avatar}` : null} icon={!item.avatar && <UserOutlined />} />
              <span style={{ display: 'inline-block', fontWeight: 700, marginLeft: '30px' }}><HighlightText text={item.newsTitle} highlight={searchResult.value} />
                <div style={{ color: '#adadad', fontSize: '13px', marginTop: '2px' }}>{item.author}&nbsp;&nbsp;&nbsp;{moment(item.publishTime).format("YYYY-MM-DD HH:mm:ss")}公開</div>
              </span>
            </div>
            <Tag style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: `1px solid ${iconColor[item.categoryId]}` }} icon={iconList[item.categoryId]}>
              <span style={{ marginLeft: 5 }}>{item.title}</span>
            </Tag></li>
        ))}
      </ul>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalItems}
        onChange={handlePageChange}
      />
    </div>
  )
}

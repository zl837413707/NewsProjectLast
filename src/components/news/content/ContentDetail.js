import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Pagination, Tag } from 'antd';
import AxiosInstance from '../../../utils/axios'
import _ from 'lodash'
import style from './index.module.css'
import { NewIcon, SocialIcon, EconomyIcon, PoliticsIcon, SportsIcon, WorldIcon } from '../../icons/icons'


export default function ContentDetail(props) {
  const [newsList, setNewsList] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate()
  useEffect(() => {
    AxiosInstance.get("/news?publishState=2&_expand=category").then((res) => {
      const newData = Object.entries(_.groupBy(res.data, item => item.category.title))
      const newList = []
      newData.forEach(item => {
        if (item[0] === props.content || props.content === '全て') {
          // 只有选到的
          newList.push(...item[1])
        }
      })
      setNewsList(newList)
      setTotalItems(newList.length);
    })
  }, [props.content])

  const iconList = {
    1: <NewIcon />,
    2: <SocialIcon />,
    3: <EconomyIcon />,
    4: <PoliticsIcon />,
    5: <SportsIcon />,
    6: <WorldIcon />,
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

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentDisplayItems = newsList.slice(startIndex, endIndex)

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page)
  }

  const newsDetail = (item) => {
    console.log(item.id)
    navigate(`/detail/${item.id}`)
  }
  return (
    <div>
      <ul>
        {currentDisplayItems.map((item, index) => (
          <li className={style.liStyle} key={index} onClick={() => { newsDetail(item) }}>
            <span style={{ fontWeight: 700 }}>{item.title}</span>
            <Tag style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: `1px solid ${iconColor[item.category.title]}` }} icon={iconList[item.category.id]}>
              <span style={{ marginLeft: 5 }}>{item.category.title}</span>
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

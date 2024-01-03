import React, { useEffect, useState } from 'react'
import { Pagination } from 'antd';
import AxiosInstance from '../../../utils/axios'
import _ from 'lodash'
import style from './index.module.css'

export default function ContentDetail(props) {
  const [newsList, setNewsList] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
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

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentDisplayItems = newsList.slice(startIndex, endIndex);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };
  return (
    <div>
      <ul>
        {currentDisplayItems.map((item, index) => (
          // 01/04开始做li的样式
          <li className={style.liStyle} key={index}>{item.title}</li>
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

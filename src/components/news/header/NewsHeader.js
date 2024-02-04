import React, { } from 'react'
import axiosInstance from '../../../utils/index'
import { useDispatch } from 'react-redux'
import { message } from 'antd'
import style from './index.module.css'
import './index.css'
import { Input } from 'antd'
const { Search } = Input;


export default function NewsHeader() {
  const dispatch = useDispatch()
  const onSearch = (value) => {
    if (value.trim() === '') {
      message.warning('タイトルを入力してください')
      return
    }
    axiosInstance.get('/searchnews', {
      params: {
        value: value.trim()
      }
    }).then((res) => {
      const searchData = {
        value: value.trim(),
        data: res.data
      }
      dispatch({
        type: 'getSearchResult',
        payload: searchData
      })
    }).catch(err => {
      console.log(err);
    })
  }
  return (
    <div className={style.headerContent}>
      <span style={{ fontWeight: 700, marginRight: 50 }}>ニュース</span>
      <Search style={{ width: 400 }} placeholder="検索" onSearch={onSearch} allowClear />
    </div>
  )
}

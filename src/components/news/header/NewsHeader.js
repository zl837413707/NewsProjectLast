import React, { } from 'react'
import style from './index.module.css'
import './index.css'
import { Input} from 'antd';
const { Search } = Input;


export default function NewsHeader() {
  const onSearch = (value) => {

  }
  return (
    <div className={style.headerContent}>
      <span style={{ fontWeight: 700, marginRight: 50 }}>ニュース</span>
      <Search  style={{ width: 400 }} placeholder="検索" onSearch={onSearch} allowClear />
    </div>
  )
}

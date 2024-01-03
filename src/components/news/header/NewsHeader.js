import React from 'react'
import style from './index.module.css'
import './index.css'
import { Input, Select } from 'antd';
const { Option } = Select;
const { Search } = Input;


export default function NewsHeader() {
  const selectBefore = (
    <Select defaultValue="分野" style={{ width: 100, fontSize: '13px' }}>
      <Option value="http://">http://</Option>
      <Option value="https://">https://</Option>
    </Select>
  );
  const onSearch = (value) => {

  }
  return (
    <div className={style.headerContent}>
      <span style={{ fontWeight: 700, marginRight: 50 }}>ニュース</span>
      <Search addonBefore={selectBefore} style={{ width: 400 }} placeholder="検索" onSearch={onSearch} allowClear />
    </div>
  )
}

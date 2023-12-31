import React, { useState, useEffect } from 'react'
import AxiosInstance from '../../../utils/axios'
import NewPublish from '../../../components/publish-manage/NewPublish'

export default function Published() {
  const [dataSource, setDataSource] = useState([])
  const userInfo = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    AxiosInstance.get(`/news?auhtou=${userInfo.username}&publishState=2&_expand=category`).then((res) => {
      setDataSource(res.data)
    })
  }, [userInfo.username])
  return (
    <div>
      <NewPublish dataSource={dataSource}></NewPublish>
    </div>
  )
}

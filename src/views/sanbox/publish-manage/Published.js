import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '../../../utils/index'
import NewPublish from '../../../components/publish-manage/NewPublish'

export default function Published() {
  const [dataSource, setDataSource] = useState([])
  const userInfoData = useSelector(state => state.UserInfoReducer)

  useEffect(() => {
    axiosInstance.get('/getallnews', {
      params: {
        publishState: 'published'
      }
    }).then((res) => {
      const newData = res.data.sort((a, b) => a.publishTime - b.publishTime)
      setDataSource(newData)
    })
  }, [userInfoData.username])
  return (
    <div>
      <NewPublish dataSource={dataSource} published={'published'}></NewPublish>
    </div>
  )
}

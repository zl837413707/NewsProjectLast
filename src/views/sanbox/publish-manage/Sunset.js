import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '../../../utils/index'
import NewPublish from '../../../components/publish-manage/NewPublish'

export default function Unpublished() {
  const [dataSource, setDataSource] = useState([])
  const userInfoData = useSelector(state => state.UserInfoReducer)

  useEffect(() => {
    axiosInstance.get('/getallnews', {
      params: {
        publishState: 'sunset'
      }
    }).then((res) => {
      setDataSource(res.data)
    })
  }, [userInfoData.username])

  return (
    <div>
      <NewPublish dataSource={dataSource} published={'sunset'}></NewPublish>
    </div>
  )
}

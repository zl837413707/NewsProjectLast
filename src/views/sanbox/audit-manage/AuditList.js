import React, { useEffect } from 'react'
import AxiosInstance from '../../../utils/axios'

export default function AuditList() {
  const userInfo = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    AxiosInstance(`/news?author=${userInfo.username}&auditstate ne=0&publishState_lte=1&expand=category`).then((res) => {
      console.log(res.data);
    })
  }, [userInfo.username])
  return (
    <div>AuditList</div>
  )
}

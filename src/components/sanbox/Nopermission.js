import React from 'react';
import { useNavigate } from 'react-router-dom'
import { Button, Result } from 'antd';
function Nopermission() {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={<Button type="primary" onClick={() => { navigate(-1) }}>Back Home</Button>}
    />
  )
}
export default Nopermission;
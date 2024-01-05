import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Button, Statistic, Badge } from 'antd';
import { ArrowLeftOutlined, LikeFilled } from '@ant-design/icons';
import moment from 'moment';
import AxiosInstance from '../../../utils/axios';

export default function NewsPreview() {
  const [newsInfo, setNewsInfo] = useState([])
  const [like, setLike] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  useEffect(() => {
    AxiosInstance.get(`/news/${id}?_expand=category&_expand=role`).then((res) => {
      setNewsInfo(res.data)
      return res.data
    }).then((res) => {
      AxiosInstance.patch(`/news/${id}`, {
        view: res.view + 1,
      })
    })
  }, [id])

  const items = [
    {
      key: '1',
      label: '作成者',
      children: (<span style={{ fontWeight: 700, fontSize: 17 }}>{newsInfo.author}</span>),
    },
    {
      key: '2',
      label: '公開時間',
      children: newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY-MM-DD HH:mm:ss") : '-',
      span: 2
    },
    {
      key: '3',
      label: 'エリア',
      children: newsInfo.region,
    },
    {
      key: '4',
      label: 'アクセス数',
      children: newsInfo && newsInfo.view !== undefined ? <Statistic value={(newsInfo.view + 1)} /> : null
    },
    {
      key: '5',
      label: 'いいね数',
      children: newsInfo && newsInfo.star !== undefined ? <Statistic value={newsInfo.star} /> : null

    },
    {
      key: '6',
      label: '記事本体',
      children: (<div dangerouslySetInnerHTML={{ __html: newsInfo.content }} />),
    },
  ]

  const likeClick = () => {
    setLike(!like)
  }


  return (
    <div style={{ paddingBottom: 50 }}>
      <Button style={{ margin: '30px 0 30px 0' }} icon={<ArrowLeftOutlined />} onClick={() => { navigate(-1) }} ></Button>
      <Descriptions title={<span style={{ marginLeft: 25, fontSize: 20 }}>{newsInfo?.title}--{newsInfo.category?.title}
        <span style={{ cursor: 'pointer', marginLeft: 10 }} onClick={likeClick}><LikeFilled style={{ fontSize: 20, color: like ? 'red' : '' }} /></span></span>}
        bordered items={items} contentStyle={{ width: '100px' }} labelStyle={{ width: '100px' }} />
    </div >

  )
}

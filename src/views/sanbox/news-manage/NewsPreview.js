import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Button, Statistic } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import axiosInstance from '../../../utils/index';

export default function NewsPreview() {
  const [newsInfo, setNewsInfo] = useState([])
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    axiosInstance.get(`/getallnews`).then((res) => {
      const newData = res.data.filter(item => item.id.toString() === id);
      setNewsInfo(newData[0])
    })
  }, [id])

  const auditList = ['下書きボックス', '審査中', '承認済み', '不承認']
  const pubilishList = ['未公開', '公開待ち', '公開済み', 'オフライン']

  const getColorByPublishState = (state) => {
    switch (state) {
      case 0:
        return { color: 'red', fontWeight: 'bold' };
      case 1:
        return { color: 'orange', fontWeight: 'bold' };
      case 2:
        return { color: 'green', fontWeight: 'bold' };
      case 3:
        return { color: 'gray', fontWeight: 'bold' };
      default:
        return { color: 'black', fontWeight: 'bold' };
    }
  }

  const items = [
    {
      key: '1',
      label: '作成者',
      children: newsInfo.author,
    },
    {
      key: '2',
      label: '作成時間',
      children: moment(newsInfo.createTime).format("YYYY-MM-DD HH:mm:ss"),

    },
    {
      key: '3',
      label: '公開時間',
      children: newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY-MM-DD HH:mm:ss") : '-',

    },
    {
      key: '4',
      label: 'エリア',
      children: newsInfo.region,
    },
    {
      key: '5',
      label: '審査状態',
      children: (
        <span style={getColorByPublishState(newsInfo.auditState)}>
          {auditList[newsInfo.auditState]}
        </span>
      ),
    },
    {
      key: '6',
      label: '公開状態',
      children: (
        <span style={getColorByPublishState(newsInfo.publishState)}>
          {pubilishList[newsInfo.publishState]}
        </span>
      ),
    },
    {
      key: '7',
      label: 'いいね数',
      children: newsInfo && newsInfo.star !== undefined ? <Statistic value={newsInfo.star} /> : null,
    },
    {
      key: '8',
      label: 'アクセス数',
      children: newsInfo && newsInfo.view !== undefined ? <Statistic value={(newsInfo.view)} /> : null,
      span: 2
    },
    {
      key: '9',
      label: '記事本体',
      children: (<div style={{ maxWidth: '1500px', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: newsInfo.content }} />),
    },
  ]


  return (
    <div>
      <Button style={{ marginBottom: 20 }} icon={<ArrowLeftOutlined />} onClick={() => { navigate(-1) }} ></Button>
      <Descriptions title={<span style={{ marginLeft: 25, fontSize: 20 }}>{newsInfo?.newsTitle}--{newsInfo?.title}</span>} bordered items={items} contentStyle={{ width: '100px' }} labelStyle={{ width: '100px' }} />
    </div >

  )
}

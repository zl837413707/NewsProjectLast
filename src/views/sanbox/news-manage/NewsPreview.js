import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import AxiosInstance from '../../../utils/axios';

export default function NewsPreview() {
  const [newsInfo, setNewsInfo] = useState([])
  const navigate = useNavigate()
  const { id } = useParams()
  useEffect(() => {
    AxiosInstance.get(`/news/${id}?_expand=category&_expand=role`).then((res) => {
      console.log(res.data);
      setNewsInfo(res.data)
    })
  }, [id])

  const auditList = ['未审核', '审核中', '已通过', '未通过']
  const pubilishList = ['未发布', '待发布', '已上线', '已下线']

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
      label: '创建者',
      children: newsInfo.author,
    },
    {
      key: '2',
      label: '创建时间',
      children: moment(newsInfo.createTime).format("YYYY-MM-DD HH:mm:ss"),

    },
    {
      key: '3',
      label: '发布时间',
      children: newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY-MM-DD HH:mm:ss") : '-',

    },
    {
      key: '4',
      label: '区域',
      children: newsInfo.region,
    },
    {
      key: '5',
      label: '审核状态',
      children: (
        <span style={getColorByPublishState(newsInfo.publishState)}>
          {auditList[newsInfo.auditState]}
        </span>
      ),
    },
    {
      key: '6',
      label: '发布状态',
      children: (
        <span style={getColorByPublishState(newsInfo.publishState)}>
          {pubilishList[newsInfo.publishState]}
        </span>
      ),
    },
    {
      key: '7',
      label: '访问数量',
      children: newsInfo.view,
    },
    {
      key: '8',
      label: '点赞数量',
      children: newsInfo.star,
    },
    {
      key: '9',
      label: '评论数量',
      children: 0,
    },
    {
      key: '10',
      label: '文章本体',
      children: (<div dangerouslySetInnerHTML={{ __html: newsInfo.content }} />),
    },
  ]


  return (
    <div>
      <Button style={{ marginBottom: 20 }} icon={<ArrowLeftOutlined />} onClick={() => { navigate('/news-manage/draft') }} ></Button>
      <Descriptions title={<span style={{ marginLeft: 25, fontSize: 20 }}>{newsInfo?.title}--{newsInfo.category?.title}</span>} bordered items={items} />
    </div >

  )
}

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Descriptions, Button, Statistic, message } from 'antd'
import { ArrowLeftOutlined, LikeFilled } from '@ant-design/icons'
import moment from 'moment'
import axiosInstance from '../../../utils/index'
import style from './index.module.css'

export default function NewsPreview() {
  const [newsInfo, setNewsInfo] = useState([])
  const [like, setLike] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    axiosInstance.get(`/getallnews`)
      .then((res) => {
        const newData = res.data.filter(item => item.id.toString() === id);
        setNewsInfo(newData[0]);

        const starIs = localStorage.getItem('newsStar')
        if (starIs) {
          const starList = JSON.parse(starIs)
          const flag = starList.find(item => item.id === newData[0].id)
          if (flag) {
            setLike(true)
          }
        }

        axiosInstance.patch(`/updatenewsaccess/${id}`, {
          view: newData[0].view + 1 
        })
          .then(() => {
            console.log('success');
          })
          .catch(err => {
            console.log(err);
          });

        return res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }, [id]);

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

    }
  ]

  const likeClick = () => {
    if (like === true) return message.warning('くり返しいいねできません')
    const existingNewsStar = localStorage.getItem('newsStar')
    let existingNewsStarArr = existingNewsStar ? JSON.parse(existingNewsStar) : [];

    existingNewsStarArr.push({ id: newsInfo.id, star: true });

    const updatedNewsStar = JSON.stringify(existingNewsStarArr)

    localStorage.setItem('newsStar', updatedNewsStar)
    setLike(!like)

    axiosInstance.patch(`/updatenewsstar/${newsInfo.id}`, {
      star: newsInfo.star + 1
    }).then((res) => {
      setNewsInfo({ ...newsInfo, star: newsInfo.star + 1 })
    }).catch(err => {
      console.log(err);
    })
  }


  return (
    <div style={{ paddingBottom: 50, maxWidth: '2000px' }}>
      <Button style={{ margin: '30px 0 30px 0' }} icon={<ArrowLeftOutlined />} onClick={() => { navigate(-1) }} ></Button>
      <Descriptions className={style.top} layout="vertical" title={<span style={{ marginLeft: 25, fontSize: 20 }}>{newsInfo?.newsTitle}--{newsInfo?.title}
        <span style={{ cursor: 'pointer', marginLeft: 10 }} onClick={likeClick}><LikeFilled style={{ fontSize: 20, color: like ? 'red' : '' }} /></span></span>}
        bordered items={items} contentStyle={{ width: '100px' }} labelStyle={{ width: '100px' }} />
      <div className={style.newsContent} dangerouslySetInnerHTML={{ __html: newsInfo.content }}></div>
    </div >

  )
}

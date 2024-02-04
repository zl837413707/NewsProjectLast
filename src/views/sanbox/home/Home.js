import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, Avatar, List, Drawer, message, Upload, Button } from 'antd'
import { Link } from 'react-router-dom'
import { SwapOutlined, LoadingOutlined, PlusOutlined, UserOutlined, LikeFilled, FireFilled } from '@ant-design/icons'
import * as echarts from 'echarts'
import axiosInstance from '../../../utils/index'
import fileUploadInstance from '../../../utils/fileUploadInstance'
import _ from 'lodash'
import { useSelector } from 'react-redux';
import './index.css'
const { Meta } = Card

export default function Home() {
  const [viewList, setViewList] = useState([])
  const [startList, setStartList] = useState([])
  const [allList, setAllList] = useState([])
  const [open, setOpen] = useState(false);
  const barRef = useRef(null)
  const pieRef = useRef(null)
  const accessRef = useRef(null)
  const [userInfo, setUserInfo] = useState([])
  const userInfoData = useSelector(state => state.UserInfoReducer)
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null)
  const [currentAvatar, setCurrentAvatar] = useState(null)

  //ユーザー情報取得
  useEffect(() => {
    setUserInfo(userInfoData)
  }, [userInfoData])
  //avatar情報取得
  useEffect(() => {
    axiosInstance(`/geravatar/${userInfoData.id}`).then((res) => {
      setCurrentAvatar(res.data[0].avatar)
    }).catch(err => {
      console.log(err)
    },)
  }, [userInfoData.id])
  //ニュース情報取得
  useEffect(() => {
    axiosInstance.get('/news').then((res) => {
      const amountList = _.groupBy(res.data, item => item.title)
      setAllList(res.data)
      echartsRender(amountList)
    }).catch((err) => {
      console.log(err);
    })

    const echartsRender = (obj) => {
      let myChart = echarts.getInstanceByDom(barRef.current);

      if (myChart) {
        // 如果已存在实例，则先销毁
        myChart.dispose();
      }
      // 基于准备好的dom，初始化echarts实例
      myChart = echarts.init(barRef.current)
      // 绘制图表
      let option = {
        title: {
          text: 'ニュース一覧',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['公開数', 'アクセス数', 'いいね数'],
          top: 60
        },
        grid: {
          top: 120,
        },
        xAxis: [
          {
            type: 'category',
            data: Object.keys(obj),
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            minInterval: 5,
          },
          {
            type: 'value',
            minInterval: 50,
          }
        ],
        series: [
          {
            name: '公開数',
            type: 'bar',
            data: Object.values(obj).map(item => item.length)
          },
          {
            name: 'アクセス数',
            type: 'line',
            yAxisIndex: 1,
            data: Object.values(obj).map(item => item.reduce((sum, item) => sum + item.view, 0))
          },
          {
            name: 'いいね数',
            type: 'line',
            yAxisIndex: 1,
            data: Object.values(obj).map(item => item.reduce((sum, item) => sum + item.star, 0))
          }
        ]
      }

      myChart.setOption(option)

      window.onresize = () => {
        myChart.resize()
      }
    }

  }, [])

  // ニュースアクセス数ランク
  useEffect(() => {
    axiosInstance.get('news/', {
      params: {
        views: 'view',
      }
    }).then((res) => {
      setViewList(res.data)
    }).catch((err) => {
      console.log(err);
    })
  }, [])


  // いいね数ランク
  useEffect(() => {
    axiosInstance.get('news/', {
      params: {
        stars: 'star',
      }
    }).then((res) => {
      setStartList(res.data)
    }).catch((err) => {
      console.log(err);
    })

    return () => {
      window.onresize = null
    }
  }, [])

  // 円グラフ
  const pieEchart = () => {

    const currentData = allList.filter(item => item.author === userInfo.username)
    const newCurrentData = _.groupBy(currentData, item => item.title)
    let List = []
    for (let i in newCurrentData) {
      List.push({
        value: newCurrentData[i].length,
        name: i
      })
    }
    let myChart = echarts.getInstanceByDom(pieRef.current);

    if (myChart) {
      myChart.dispose();
    }

    myChart = echarts.init(pieRef.current)

    let option = {
      title: {
        text: '個人ニュース',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: List,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    myChart.setOption(option)
  }

  //アクセスグラフ
  const accessEchart = () => {

    const currentData = allList.filter(item => item.author === userInfo.username)
    const newCurrentData = _.groupBy(currentData, item => item.title)

    //分類
    let List = []
    for (let i in newCurrentData) {
      List.push(i)
    }
    let myChart = echarts.getInstanceByDom(pieRef.current);
    //アクセス
    const viewSums = Object.values(newCurrentData).map(domain => {
      const views = domain.reduce((total, obj) => total + obj.view, 0);
      return views;
    })
    //いいね数
    const starSums = Object.values(newCurrentData).map(domain => {
      const stars = domain.reduce((total, obj) => total + obj.star, 0);
      return stars;
    })

    if (myChart) {
      myChart.dispose();
    }

    myChart = echarts.init(accessRef.current)

    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: List
      },
      series: [
        {
          name: 'アクセス数',
          type: 'bar',
          data: viewSums
        },
        {
          name: 'いいね数',
          type: 'bar',
          data: starSums
        }
      ]
    };

    myChart.setOption(option)
  }

  // 写真アップロード
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    setSelectedFile(file)
    return isJpgOrPng && isLt2M;
  }

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const avatarChange = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      fileUploadInstance.post('/uploadavatar', formData).then(res => {
        setImageUrl(null)
        setOpen(false)
        window.location.reload()
      }).catch(err => {
        console.log(err);
      })
    }

  }


  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="アクセスランキング" bordered={true}>
            <List
              size="large"
              dataSource={viewList}
              renderItem={(item) => <List.Item><Link to={`/news-manage/preview/${item.id}`}>
                <FireFilled style={{ fontSize: '16px', color: '#ff5656', marginRight: '5px' }} />{item.newsTitle}
              </Link></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="いいねランキング" bordered={true}>
            <List
              size="large"
              dataSource={startList}
              renderItem={(item) => <List.Item><Link to={`/news-manage/preview/${item.id}`}>
                <LikeFilled style={{ fontSize: '16px', color: '#ff5656', marginRight: '5px' }} />{item.newsTitle}
              </Link></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img style={{ height: '100%', width: '100%', border: '1px solid #f0f0f0' }}
                alt="example"
                src="images/t1.jpg"
              />
            }
            actions={[
              <SwapOutlined style={{ fontSize: 17 }} key="setting" onClick={() => {
                setOpen(true)
                setTimeout(() => {

                  accessEchart()
                  pieEchart()
                }, 0)
              }} />,
            ]}
          >
            <Meta
              avatar={<Avatar size={55} src={currentAvatar ? `https://storage.googleapis.com/newsdataimages/${currentAvatar}` : null} icon={!currentAvatar && <UserOutlined />} />}
              title={userInfo.username}
              description={
                <div>
                  <span><b>エリア : </b> {userInfo.region}</span><br />
                  <span><b>権限 : </b> {userInfo.roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <div ref={barRef} style={{ height: '500px', marginTop: 30 }}></div>
      <Drawer width='700px' title="詳細" placement="right" onClose={() => {
        setOpen(false)
      }} open={open}>
        <p style={{ textAlign: 'center' }}>プロフィール写真</p>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="avatar"
              style={{
                height: '100%',
              }}
            />
          ) : (
            uploadButton
          )}
        </Upload>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button style={{ margin: '0 auto' }} onClick={() => { avatarChange() }}>更新</Button>
        </div>
        <div ref={pieRef} style={{ height: '500px', marginTop: 30 }}></div>
        <div ref={accessRef} style={{ height: '500px', marginTop: 30 }}></div>
      </Drawer>
    </div>

  )
}

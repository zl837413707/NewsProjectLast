import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, Avatar, List, Drawer } from 'antd';
import { Link } from 'react-router-dom';
import { SwapOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import AxiosInstance from '../../../utils/axios'
import _ from 'lodash'
const { Meta } = Card;
export default function Home() {
  const [viewList, setViewList] = useState([])
  const [startList, setStartList] = useState([])
  const [allList, setAllList] = useState([])
  const [open, setOpen] = useState(false);
  const barRef = useRef(null)
  const pieRef = useRef(null)
  const userInfo = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    AxiosInstance.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then((res) => {
      setViewList(res.data)
    })

  }, [])

  useEffect(() => {
    AxiosInstance.get("/news?publishState=2&_expand=category&_sort=start&_order=desc&_limit=6").then((res) => {
      setStartList(res.data)
    })
    return () => {
      window.onresize = null
    }
  }, [])

  useEffect(() => {
    AxiosInstance.get("/news?publishState=2&_expand=category").then((res) => {
      const amountList = _.groupBy(res.data, item => item.category.title)
      console.log(amountList);
      setAllList(res.data)
      echartsRender(amountList)
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
          text: '新闻全体总览',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['发布数', '观看数', '点赞数'],
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
            name: '发布数',
            minInterval: 5,
          },
          {
            type: 'value',
            name: '观看数',
            minInterval: 50,
          }
        ],
        series: [
          {
            name: '发布数',
            type: 'bar',
            data: Object.values(obj).map(item => item.length)
          },
          {
            name: '观看数',
            type: 'line',
            yAxisIndex: 1,
            data: Object.values(obj).map(item => item.reduce((sum, item) => sum + item.view, 0))
          },
          {
            name: '点赞数',
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

  const pieEchart = () => {
    const currentData = allList.filter(item => item.author === userInfo.username)
    const newCurrentData = _.groupBy(currentData, item => item.category.title)
    let List = []
    for (let i in newCurrentData) {
      List.push({
        value: newCurrentData[i].length,
        name: i
      })
    }
    let myChart = echarts.getInstanceByDom(pieRef.current);

    if (myChart) {
      // 如果已存在实例，则先销毁
      myChart.dispose();
    }
    // 基于准备好的dom，初始化echarts实例
    myChart = echarts.init(pieRef.current)
    // 绘制图表
    let option = {
      title: {
        text: '个人新闻发布',
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
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title={<div>用户最常浏览</div>} bordered={true}>
            <List
              size="large"
              dataSource={viewList}
              renderItem={(item) => <List.Item><Link to={`/news-manage/preview/${item.id}`}>
                {item.title}
              </Link></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="large"
              dataSource={startList}
              renderItem={(item) => <List.Item><Link to={`/news-manage/preview/${item.id}`}>
                {item.title}
              </Link></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SwapOutlined style={{ fontSize: 17 }} key="setting" onClick={() => {
                setOpen(true)
                setTimeout(() => {
                  pieEchart()
                }, 0)
              }} />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
              title={userInfo.username}
              description={
                <div>
                  <b>{userInfo.region ? userInfo.region : '全球'}</b>
                  <span style={{ marginLeft: 20 }}>{userInfo.role.roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <div ref={barRef} style={{ height: '500px', marginTop: 30 }}></div>
      <Drawer width='500px' title="詳細" placement="right" onClose={() => { setOpen(false) }} open={open}>
        <div ref={pieRef} style={{ height: '500px', marginTop: 30 }}></div>
      </Drawer>
    </div>

  )
}

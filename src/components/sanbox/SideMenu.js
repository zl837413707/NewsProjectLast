import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  PieChartOutlined, TeamOutlined, UserOutlined, SolutionOutlined, UnlockOutlined, ExportOutlined, RadarChartOutlined
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import { connect } from 'react-redux'
import { useSelector } from 'react-redux'
import './index.css'
import axiosInstance from '../../utils/index'

const { Sider } = Layout;

const iconList = {
  '/home': <PieChartOutlined />,
  '/user-manage': <UserOutlined />,
  '/right-manage': <TeamOutlined />,
  '/news-manage': <SolutionOutlined />,
  '/audit-manage': <UnlockOutlined />,
  '/publish-manage': <ExportOutlined />,
}

const mapStateToProps = ({ Collapsed: { isCollapsed } }) => {
  return {
    isCollapsed,
  }
}

function SideMenu(props) {
  const [menu, setMenu] = useState([])
  const [dataSource, setDataSource] = useState([])
  const navigate = useNavigate();
  const location = useLocation();
  const OpenKeys = '/' + location.pathname.split('/')[1]
  const userInfoData = useSelector(state => state.UserInfoReducer)

  useEffect(() => {
    axiosInstance.get('/allrolespath').then((res) => {
      setDataSource(res.data)
    }).catch(err => {
      console.log(err);
    })
  }, [])


  useEffect(() => {
    if (dataSource) {
      axiosInstance.get('/rights')
        .then((res) => {
          res.data.forEach((res) => {
            res.icon = iconList[res.key]
            if (res.children?.length > 0) {
              res.children.forEach((item) => {
                delete item["rightId"]
              })
              const newChildren = res.children.filter((item) => {
                return item.pagepermisson === 1 && dataSource[userInfoData.roleId - 1]?.rights.includes(item.key);
              })

              res["children"] = newChildren
            } else {
              delete res["children"]
            }
          })

          const newRes = res.data.filter((item) => {
            return item.pagepermisson === 1 && dataSource[userInfoData.roleId - 1]?.rights.includes(item.key);
          })
          setMenu(newRes)
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }, [dataSource, userInfoData.roleId])

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed} className="side" >
      <div className="logo" >{!props.isCollapsed ? 'ニュース管理システム' : <RadarChartOutlined style={{ fontSize: 20, color: '#1e76f7' }} />}</div>
      <Menu theme="dark" selectedKeys={[`${location.pathname}`]} defaultOpenKeys={props.isCollapsed ? [] : [`${OpenKeys}`]} mode="inline" items={menu} onClick={(menu) => { navigate(menu.key) }} />
    </Sider>
  )
}

export default connect(mapStateToProps)(SideMenu)
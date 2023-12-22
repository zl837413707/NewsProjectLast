import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import './index.css'
const { Sider } = Layout;

const iconList = {
  '/home': <PieChartOutlined />,
  '/user-manage': <UserOutlined />,
  '/right-manage': <TeamOutlined />,
}

export default function SideMenu() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([])
  useEffect(() => {
    const getData = async () => {
      await axios.get('http://localhost:8100/rights?_embed=children').then((res) => {
        // 为了删除空的children和rightId,真正做后端的时候可以删除下面的方法
        res.data.forEach((res) => {
          // 后端本身没有icon的信息,根据唯一的key值然后自定义一个iconList对象,每次遍历的时候让icon等于上面对象里的icon组件(成为一个新的数组使用)
          res.icon = iconList[res.key]
          if (res.children.length > 0) {
            res.children.forEach((item) => {
              delete item["rightId"]
            })
            //过滤下数组,有pagepermisson的数据代表着是菜单栏可以显示的权限(导致没有权限的数据显示不出来,后面有问题想办法解决！！！！！！！！)
            const newChildren = res.children.filter((item) => {
              return item.pagepermisson === 1;
            })
            res["children"] = newChildren
          } else {
            delete res["children"]
          }
        })
        console.log(res.data);
        setMenu(res.data)
      })
    }
    getData()
  }, [])
  return (
    <Sider trigger={null} collapsible className="side" >
      <div className="logo" >ニュース管理システム</div>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={menu} onClick={(menu) => { navigate(menu.key) }} />
    </Sider>
  )
}

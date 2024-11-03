import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ items }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Sider
      collapsed={collapsed}
      onMouseEnter={() => setCollapsed(false)} 
      onMouseLeave={() => setCollapsed(true)} 
      collapsedWidth="0"
    >
      <div className="demo-logo-vertical" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={items} />
    </Sider>
  );
};

export default Sidebar;

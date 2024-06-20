import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

const MoHeader = ({ colorBgContainer }) => {
  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%', padding: '0 00px', background: colorBgContainer }}>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '4px', background: colorBgContainer }}>
      <a href="localhost:3000">
          <img
            src="/logo.png"
            width="128"
            height="64"
            className="d-inline-block align-top logo"
            alt="모일까 로고"
          />
        </a>

      </Menu>
    </Header>
  );
};

export default MoHeader;

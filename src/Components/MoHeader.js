import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

const MoHeader = ({ colorBgContainer }) => {
  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%', padding: '0 50px', background: colorBgContainer }}>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px', background: colorBgContainer }}>
        <Menu.Item key="1">
          <img
            src="/logo.png"
            width="128"
            height="64"
            className="d-inline-block align-top logo"
            alt="모일까 로고"
          />
        </Menu.Item>
        <Menu.Item key="2" style={{ float: 'right' }}>
          <a href="#login" style={{ color: 'white', marginRight: '10px' }}>로그인</a>
        </Menu.Item>
        <Menu.Item key="3" style={{ float: 'right' }}>
          <a href="#register" style={{ color: 'white' }}>회원가입</a>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default MoHeader;

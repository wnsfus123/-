import React from 'react';
import { Layout } from 'antd';
import { Navbar, Nav } from 'react-bootstrap';

const { Header } = Layout;

const MyHeader = ({ colorBgContainer }) => {
  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
      <Navbar className="header" style={{ backgroundColor: "#021429" }} variant="dark">
        <Navbar.Brand href="#home">
          <img
            src="/logo.png"
            width="128"
            height="64"
            className="d-inline-block align-top logo"
            alt="모일까 로고"
          />
        </Navbar.Brand>
        <Nav className="nav-buttons">
          <Nav.Link href="#login" style={{ color: "white", marginRight: "10px" }}>로그인</Nav.Link>
          <Nav.Link href="#register" style={{ color: "white" }}>회원가입</Nav.Link>
        </Nav>
      </Navbar>
    </Header>
  );
};

export default MyHeader;

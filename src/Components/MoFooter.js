import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const MyFooter = () => {
  return (
    <Footer style={{ textAlign: 'center', height: '0px'}}>
      모일까 ©{new Date().getFullYear()} Created by 모일까
    </Footer>
  );
};

export default MyFooter;

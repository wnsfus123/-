import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

const PageContent = ({ colorBgContainer, borderRadiusLG }) => {
  return (
    <Content style={{ margin: '24px 16px 0' }}>
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        content
      </div>
    </Content>
  );
};

export default PageContent;

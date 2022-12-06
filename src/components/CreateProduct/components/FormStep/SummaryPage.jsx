import React from 'react';
import Button from 'antd/lib/button/index'
import message from 'antd/lib/message/index'
import Space from 'antd/lib/space/index'
import Title from 'antd/lib/typography/Title';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useCustomProductEdit } from '../../useCustomProductEdit';

const SummaryPage = ({ prev, history }) => {
  const { handleFinalSubmit } = useCustomProductEdit();

  return (
    <React.Fragment>
      <Title label={3}>Have you done to edit prdouct? Let's submit it...</Title>
      <Space style={{ width: "100%", justifyContent: "center" }} className='steps-action'>
        <Button.Group>
          <Button onClick={() => prev()} type='primary'>
            Prev <ArrowLeftOutlined />
          </Button>
          <Button onClick={() => handleFinalSubmit({message, history})} type='primary'>
            Submit
          </Button>
        </Button.Group>
      </Space>
    </React.Fragment>
  );
}

export default SummaryPage;

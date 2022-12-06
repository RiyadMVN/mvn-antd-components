import React from 'react';
import Button from 'antd/lib/button/index'
import Checkbox from 'antd/lib/checkbox/index';
import Row from 'antd/lib/row/index'
import Col from 'antd/lib/col/index'
import Form from 'antd/lib/form/index'
import Input from 'antd/lib/input/index'
import InputNumber from 'antd/lib/input-number/index';
import message from 'antd/lib/message/index'
import Space from 'antd/lib/space/index'
import Select from 'antd/lib/select/index'
import Title from 'antd/lib/typography/Title';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useCustomProductEdit } from '../../useCustomProductEdit';

const ServiceAndDelivery = ({ next, prev }) => {
  const [form] = Form.useForm();
  const {
    productData,
    handleDeliveryOptions
  } = useCustomProductEdit();

  const cbOptions = [
    { label: 'Battery', value: 'Battery' },
    { label: 'Flammable', value: 'Flammable' },
    { label: 'Liquid', value: 'Liquid' },
    { label: 'None', value: 'None' },
  ];

  return (
    <React.Fragment>
      <Row>
        <Col offset={3} span={18}>
          <Form
            form={form}
            name="service"
            layout="vertical"
            onFinish={(v) => {
              handleDeliveryOptions({form, next, message});
            }}
            initialValues={{
              warranty: productData,
              delivery: productData,
            }}
          >
            <Form.Item label="Warranty" noStyle>
              <Title level={4}>Warranty: </Title>
              <Input.Group compact>
                <Form.Item
                  name={['warranty', 'type']}
                  label="Warranty Type"
                  style={{ width: '20%' }}
                >
                  <Select style={{ width: "100%" }} placeholder="Select Warranty type">
                    <Select.Option value="No Warranty">No Warranty</Select.Option>
                    <Select.Option value="Brand Warranty">Brand Warranty</Select.Option>
                    <Select.Option value="Seller Warranty">Seller Warranty</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name={['warranty', 'period']}
                  label="Warranty Period"
                  style={{ width: '20%' }}
                >
                  <Input placeholder="Warranty Period" style={{ width: "100%" }} />
                </Form.Item>
              </Input.Group>
              <Form.Item
                name={['warranty', 'policy']}
                label="Warranty Policy"
              >
                <Input.TextArea rows={6} cols={6} />
              </Form.Item>
            </Form.Item>
            <Form.Item label="Delivery" noStyle>
              <Title level={4}>Delivery: </Title>
              <Form.Item
                name={['delivery', 'packageWeight']}
                label="Package Weight"
                style={{ width: '20%' }}
              >
                <InputNumber placeholder="Package weight" style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="CBM [ Package Dimensions(cm) ]"
                noStyle
              >
                <Title level={4}>CBM (Package Dimensions): </Title>
                <Input.Group compact>
                  <Form.Item
                    style={{ width: '20%' }}
                    name={['delivery', 'cbm', 'length']}
                  >
                    <InputNumber style={{ width: "100%" }} placeholder="Length (cm)" />
                  </Form.Item>
                  <Form.Item
                    style={{ width: '20%' }}
                    name={['delivery', 'cbm', 'width']}
                  >
                    <InputNumber style={{ width: "100%" }} placeholder="Width (cm)" />
                  </Form.Item>
                  <Form.Item
                    style={{ width: '20%' }}
                    name={['delivery', 'cbm', 'height']}
                  >
                    <InputNumber style={{ width: "100%" }} placeholder="Height (cm)" />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Form.Item>
            <Form.Item
              name={['delivery', 'dangrousGoods']}
              label="Dangerous Goods"
            >
              <Checkbox.Group
                options={cbOptions}
              />
            </Form.Item>


            <Space style={{ width: "100%", justifyContent: "center" }} className='steps-action'>
              <Button.Group>
                <Button onClick={() => prev()} type='primary'>
                  Prev <ArrowLeftOutlined />
                </Button>
                <Button
                  type='primary' htmlType='submit'>
                  Next <ArrowRightOutlined />
                </Button>
              </Button.Group>
            </Space>
          </Form>
        </Col></Row>
    </React.Fragment>
  );
}

export default ServiceAndDelivery;

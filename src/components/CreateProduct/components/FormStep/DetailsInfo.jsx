import React, { useMemo } from 'react';
import {
  Button,
  Row,
  Col,
  Form,
  Divider,
  message,
  Space
} from 'antd'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useCustomProductEdit } from '../../useCustomProductEdit';

const DetailsInfo = ({ next, prev }) => {
  const [form] = Form.useForm();
  const { handleDetails, productData } = useCustomProductEdit();
  const modules = useMemo(() => ({
    toolbar: [[{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'color', 'font'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link'],
    ['clean']
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'color', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'font', 'code', 'code-block',
    'link',
  ];

  return (
    <React.Fragment>
      <Row>
        <Col offset={3} span={18}>
          <Form
            form={form}
            name="details"
            layout="vertical"
            onFinish={(v) => {
              handleDetails({ form, next, message });
            }}
            initialValues={{
              description: productData?.description?.[0] || '',
            }}
          >
            <Form.Item
              name="description"
              label="Description"
            >
              <ReactQuill
                theme="snow"
                onChange={(content) => {
                  if (content) {
                    form.setFieldsValue({
                      description: content,
                    })
                  }
                }}
                modules={modules}
                formats={formats}
              />
            </Form.Item>
            <Divider />
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

export default DetailsInfo;

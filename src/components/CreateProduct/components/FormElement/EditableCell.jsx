import React, { useContext } from 'react';
import Button from 'antd/lib/button/index'
import Form from 'antd/lib/form/index'
import Input from 'antd/lib/input/index'
import InputNumber from 'antd/lib/input-number/index'
import message from 'antd/lib/message/index'
import Popover from 'antd/lib/popover/index'
import Select from 'antd/lib/select/index'
import Switch from 'antd/lib/switch/index'

import { MoreOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { EditableContext, useCustomProductEdit } from '../../useCustomProductEdit';

const EditableCell = ({ title, editable, children, inputType, dataIndex, record, handleSave, ...restProps }) => {
  const form = useContext(EditableContext);
  const {
    formVariationProps,
    dataObj,
  } = useCustomProductEdit();

  const save = async () => {
    try {
      const values = await form.validateFields();
      handleSave({ ...record, ...values });
    } catch (_) {
      message.warning('Saved failed!');
    }
  };

  let childNode = children;

  if (editable && inputType) {

    let inputElement = null;

    if (inputType === 'number') {
      inputElement = (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          initialValue={record[dataIndex]}>
          <InputNumber onChange={save} onBlur={save} />
        </Form.Item>
      );
    } else if (inputType === 'select') {
      let selectedProp = formVariationProps.find(prop => prop?.name.toLowerCase() === dataIndex);

      inputElement = (<Form.Item
        name={dataIndex}
        style={{
          margin: 0
        }}
        initialValue={record[dataIndex]}
        rules={[
          {
            required: true,
          },
          () => ({
            validator(_, value) {
              let values = form.getFieldsValue();
              const newData = [...dataObj?.dataSource];
              let propsData = [...formVariationProps];
              let propsValue = {};
              propsData?.forEach(prop => {
                let propName = prop?.name?.toLowerCase();
                let propData = values[propName]
                propsValue[propName] = propData;
              })

              let proccessedData = newData.reduce((ac, cv) => {
                let propsValue = {};
                propsData?.forEach(prop => {
                  let propName = prop?.name?.toLowerCase();
                  propsValue[propName] = cv[propName]
                })

                ac.push(propsValue);

                return ac
              }, [])

              const duplicateSkus = proccessedData.filter((item) => JSON.stringify(item) === JSON.stringify(propsValue));

              if (value && duplicateSkus?.length < 2) {
                return Promise.resolve();
              }

              return Promise.reject();

            },
          }),

        ]}
      >
        <Select
          allowClear
          style={{ width: '100%' }}
          onChange={save}
          onBlur={save}
        >
          {selectedProp?.values?.map((value, vidx) => (
            <Select.Option value={value?.name} key={`${dataIndex}_${vidx}`} onChange={save} onBlur={save}>
              {value?.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>)
    } else if (inputType === 'switch') {
      inputElement = (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          initialValue={record[dataIndex]}
          valuePropName="checked"
        >
          <Switch defaultChecked onChange={save} onBlur={save} />
        </Form.Item>

      )
    }

    childNode = inputElement
  }
  else if (dataIndex === 'price') {
    childNode = <Space style={{ marginBottom: 0 }}>
      <Input.Group style={{ marginBottom: 0 }} compact>
        <Form.Item
          name={[dataIndex, `offer`]}
          initialValue={record?.price?.offer}
        >
          <InputNumber placeholder="Offer" min={0} onChange={save} onBlur={save} />
        </Form.Item>
        <Form.Item
          name={[dataIndex, `actual`]}
          initialValue={record?.price?.actual}
        >
          <InputNumber placeholder="Actual" min={0} onChange={save} onBlur={save} />
        </Form.Item>
        <Popover
          content={() => {
            return (
              <React.Fragment>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Input.Group style={{ marginBottom: 0 }} compact>
                    <Form.Item
                      label={`Preorder`}
                      name={[dataIndex, `preorder`]}
                      initialValue={record?.price?.preorder}
                    >
                      <InputNumber min={0} onChange={save} onBlur={save} />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </React.Fragment>
            );
          }}
          title="Price Update"
          trigger="hover"
        >
          <Button type="primary"><MoreOutlined /></Button>
        </Popover>
      </Input.Group>
    </Space>
  }
  else if (dataIndex === 'stock') {
    childNode = <Space style={{ marginBottom: 0 }}>
      <Input.Group style={{ marginBottom: 0 }} compact>
        <Form.Item
          name={[dataIndex, `min`]}
          initialValue={record?.stock?.min}
        >
          <InputNumber placeholder="Min" min={0} onChange={save} onBlur={save} />
        </Form.Item>
        <Form.Item
          name={[dataIndex, `available`]}
          initialValue={record?.stock?.available}
        >
          <InputNumber placeholder='Stock' min={0} onChange={save} onBlur={save} />
        </Form.Item>
        <Popover
          content={() => {
            return (
              <React.Fragment>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Input.Group style={{ marginBottom: 0 }} compact>
                    <Form.Item
                      label={`Limit`}
                      name={[dataIndex, `limit`]}
                      initialValue={record?.stock?.limit}
                    >
                      <InputNumber min={0} onChange={save} onBlur={save} />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </React.Fragment>
            );
          }}
          title="Stock Update"
          trigger="hover"
        >
          <Button type="primary"><MoreOutlined /></Button>
        </Popover>
      </Input.Group>
    </Space>
  }

  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;

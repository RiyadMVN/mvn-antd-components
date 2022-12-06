import { Button, Form, InputNumber, Space } from 'antd';
import React from 'react';

const SetDefaultCellValue = (props) => {
  const {
    defaultValues,
    handleSetValueChange,
    handleClearSetValues
  } = props;

  return (
    <div className="setMeta">
      <h3>Set all values</h3>
      <Space key="set_default_value_space">
        <Form.Item>
          <InputNumber
            min={1}
            placeholder="Actual"
            value={defaultValues.actual}
            onChange={(value) => handleSetValueChange('actual', value)}
          />
        </Form.Item>
        <Form.Item>
          <InputNumber
            min={1}
            placeholder="Offer"
            value={defaultValues.offer}
            onChange={(value) => handleSetValueChange('offer', value)}
          />
        </Form.Item>
        <Form.Item>
          <InputNumber
            min={1}
            placeholder="Preorder"
            value={defaultValues.preorder}
            onChange={(value) => handleSetValueChange('preorder', value)}
          />
        </Form.Item>
        <Form.Item>
          <InputNumber
            min={1}
            placeholder="Min"
            value={defaultValues.min}
            onChange={(value) => handleSetValueChange('min', value)}
          />
        </Form.Item>
        <Form.Item>
          <InputNumber
            min={1}
            placeholder="Limit"
            value={defaultValues.limit}
            onChange={(value) => handleSetValueChange('limit', value)}
          />
        </Form.Item>
        <Form.Item>
          <InputNumber
            min={1}
            placeholder="Available"
            value={defaultValues.available}
            onChange={(value) => handleSetValueChange('available', value)}
          />
        </Form.Item>
        <Form.Item>
          {/* <Button
            type="primary"
            htmlType="button"
            onClick={handleSetValueSubmit}
          >
            Set all
          </Button> */}
          <Button
            htmlType="button"
            onClick={handleClearSetValues}
          >Clear</Button>
        </Form.Item>
      </Space>
    </div>
  )
}

export default SetDefaultCellValue;

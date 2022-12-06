import React, { useEffect, useState } from 'react';
import Button from 'antd/lib/button/index'
import Divider from 'antd/lib/divider/index';
import Row from 'antd/lib/row/index'
import Col from 'antd/lib/col/index'
import Form from 'antd/lib/form/index'
import Input from 'antd/lib/input/index'
import InputNumber from 'antd/lib/input-number/index';
import message from 'antd/lib/message/index'
import Space from 'antd/lib/space/index'
import Select from 'antd/lib/select/index'
import Tag from 'antd/lib/tag/index'
import { ArrowRightOutlined, CloudUploadOutlined, LinkOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Title from 'antd/lib/typography/Title';
import { Switch } from 'antd';
import { useCustomProductEdit } from '../../useCustomProductEdit';
import { CasaderElm } from '../FormElement';
import { SingleImageUpload } from '../../../SingleImageUpload';

const countryData = ['All', 'Banglaldesh', 'India', 'USA', 'Japan', 'Nepal'];
const currencyData = {
  All: 'USD',
  Banglaldesh: 'BDT',
  India: 'Rupi',
  USA: 'USD',
  Japan: 'Yan',
  Nepal: 'Nepali'
};

const BasicInfo = ({ next }) => {
  const [country, setCountry] = React.useState([]);
  const [form] = Form.useForm();
  const [showImgLink, setShowImgLink] = useState(true);
  const [showGalleryLink, setShowGalleryLink] = useState(true);
  const activeWholesale = Form.useWatch(['basicMeta', 'active_wholesales'], form);

  const {
    productData,
    isEditableProduct,
    propFields,
    storeList,
    handlePrimaryInfo,
    imageUploadActionURL,
    imageUploadActionToken
  } = useCustomProductEdit();


  useEffect(() => {
    if (isEditableProduct || productData) {
      let copiedProduct = { ...productData }
      if (copiedProduct?.variation?.skus?.length) {
        copiedProduct['skus'] = copiedProduct.variation.skus;
        copiedProduct['props'] = copiedProduct.variation.proprs;
      }
      form?.setFieldsValue({
        basicMeta: copiedProduct,
      })

      const fields = form.getFieldsValue()
      const { basicMeta } = fields
      let specifications = [];
      if (isEditableProduct) {
        specifications = productData?.specifications?.map(item => {
          return {
            label: item?.label?.name,
            label_id: item?.label?.id,
            value: item?.value?.name,
            value_id: item?.value?.id
          }
        })
      } else {
        specifications = productData?.specifications
      }

      Object.assign(basicMeta, {
        gallery: productData?.gallery,
        specifications
      })

      form?.setFieldsValue({
        basicMeta,
        ...fields
      })
    } else {
      form?.setFieldsValue({
        basicMeta: {
          active_wholesales: true
        }
      })
    }

  }, [isEditableProduct, productData, form])


  useEffect(() => {
    setCountry([]);
  }, []);

  const handleCountryChange = (value) => {
    setCountry([...value]);
  };

  return (
    <React.Fragment>
      <Row>
        <Col offset={3} span={18}>
          <Form
            form={form}
            name="basicInfo"
            layout="vertical"
            onFinish={(v) => {
              handlePrimaryInfo({ form, next, message })
            }}
          >
            <Space align="start" size={[30, 0]}>
              {
                propFields?.country &&
                <>
                  <Form.Item>
                    <Form.Item
                      name={['basicMeta', 'country']}
                      label='Country' style={{ marginBottom: 0 }}
                      initialValue={['All']}
                    >
                      <Select
                        mode='multiple'
                        allowClear
                        style={{ width: '100%' }}
                        placeholder='Select country'
                        onChange={handleCountryChange}>
                        {countryData.map((country) => (
                          <Select.Option value={country} key={`country_${country}`}>
                            {country}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    {
                      country && country.length > 0 &&
                      <Form.Item label="Selected currency" style={{ marginTop: '1em', marginBottom: 0 }}>
                        <div>
                          {country.map((country, idx) => (
                            <Tag key={`${currencyData[country]}_${idx}`}>
                              {currencyData[country]}
                            </Tag>
                          ))}
                        </div>
                      </Form.Item>
                    }
                  </Form.Item>
                  <Form.Item
                    name={['basicMeta', 'currency']}
                    label='Currency'
                    hidden
                    initialValue={['USD']}
                  >
                    <Select
                      mode='multiple'
                      allowClear
                      style={{ width: '100%' }}
                      placeholder='Select Currency'
                    >
                      {country.map((country) => (
                        <Select.Option value={currencyData[country]} key={currencyData[country]}>
                          {currencyData[country]}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </>
              }
              {
                propFields?.sourcing_agent &&
                <Form.Item
                  name={['basicMeta', 'sourcing_agent']}
                  label='Sourcing Agent'
                  initialValue='MoveOn'
                >
                  <Select
                    allowClear
                    style={{ width: '100%' }}
                    placeholder='Select Sourcing Type'
                  >
                    <Select.Option value='MoveOn'>MoveOn</Select.Option>
                    <Select.Option value='Seller'>Seller</Select.Option>
                    <Select.Option value='Supplier'>Supplier</Select.Option>
                    <Select.Option value='Manufacturer'>Manufacturer</Select.Option>
                  </Select>
                </Form.Item>
              }
              {
                propFields?.shop_id &&
                <>
                  <Form.Item
                    name={['basicMeta', 'shop_id']}
                    label='Store'
                    rules={[{
                      required: true,
                      message: 'Store is required'
                    }]}
                  >
                    <Select
                      allowClear
                      style={{ minWidth: '150px' }}
                      placeholder='Select Store'
                      onSelect={(v, t) => {
                        let desiredStore = storeList.find(item => item.storeId === v);
                        const fields = form.getFieldsValue();
                        const { basicMeta } = fields;
                        Object.assign(basicMeta, { store_id: desiredStore?.id });
                        form.setFieldsValue({
                          basicMeta,
                          ...fields
                        });
                      }}
                    >
                      {
                        storeList?.map(store => (
                          <Select.Option key={`soStore_${store?.id}`} value={store?.storeId}>{store?.name}</Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </>
              }
            </Space>
            {
              propFields?.title &&
              <Form.Item
                name={['basicMeta', 'title']}
                label={<strong>Title</strong>}
                rules={[{
                  required: true,
                  message: 'Title is required'
                }]}
              >
                <Input />
              </Form.Item>
            }
            {
              propFields?.link &&
              <Form.Item
                name={['basicMeta', 'link']}
                label={<strong>Link</strong>}
                rules={[{
                  required: true,
                  message: 'Link is required'
                }]}
              >
                <Input type="url" />
              </Form.Item>
            }
            <Form.Item
              name={['basicMeta', 'image']}
              label={
                <Space>
                  <strong>Image</strong>
                  <Switch
                    checkedChildren={<Space><span>Paste Link</span><LinkOutlined /></Space>}
                    unCheckedChildren={<Space><span>Upload Image</span><CloudUploadOutlined /></Space>}
                    checked={showImgLink}
                    onChange={() => {
                      setShowImgLink((prevState) => !prevState)
                    }}
                  />
                </Space>
              }
              rules={[{
                required: true,
                message: 'Image is required'
              }]}
            >
              {
                showImgLink ?
                  <Input type="url" />
                  :
                  <SingleImageUpload
                    handleUploadedImage={(img) => {
                      const fields = form.getFieldsValue();
                      const { basicMeta } = fields;
                      Object.assign(basicMeta, { image: img.imageURL });
                      form.setFieldsValue({
                        basicMeta,
                        ...fields
                      });
                    }}
                    imageURL={productData?.image ?? null}
                  />
              }

            </Form.Item>
            <Form.Item
              label={
                <Space>
                  <strong>Gallery</strong>
                  <Switch
                    checkedChildren={<Space><span>Paste Link</span><LinkOutlined /></Space>}
                    unCheckedChildren={<Space><span>Upload Image</span><CloudUploadOutlined /></Space>}
                    checked={showGalleryLink}
                    onChange={() => {
                      setShowGalleryLink((prevState) => !prevState)
                    }}
                  />
                </Space>
              }
            >
              {/* {
                showGalleryLink ?
                  <> */}
              {/* <Title level={4}>Wholesale Prices: </Title> */}
              <Form.List
                name={['basicMeta', 'gallery']}
              >
                {
                  (fields, { add, remove }) => (
                    <React.Fragment>
                      {
                        fields.map((field, idx) => (
                          <React.Fragment key={`${idx}_pwhs`}>
                            <Input.Group compact>
                              {
                                !showGalleryLink ?
                                  <>
                                    <Form.Item label="Image">
                                      <SingleImageUpload
                                        handleUploadedImage={(img) => {
                                          const fields = form.getFieldsValue();
                                          const { basicMeta } = fields;
                                          const { gallery } = basicMeta;
                                          let updatedGallery = [...gallery];
                                          updatedGallery[idx] = {
                                            ...updatedGallery[idx],
                                            url: img.imageURL
                                          }
                                          Object.assign(basicMeta, { gallery: updatedGallery });
                                          form.setFieldsValue({
                                            basicMeta,
                                            ...fields
                                          });
                                        }}
                                        imageURL={productData?.gallery?.[idx]?.url ?? null}
                                      />
                                    </Form.Item>
                                    <Form.Item label="thumb">
                                      <SingleImageUpload
                                        handleUploadedImage={(img) => {
                                          const fields = form.getFieldsValue();
                                          const { basicMeta } = fields;
                                          const { gallery } = basicMeta;
                                          let updatedGallery = [...gallery];
                                          updatedGallery[idx] = {
                                            ...updatedGallery[idx],
                                            thumb: img.imageURL
                                          }
                                          Object.assign(basicMeta, { gallery: updatedGallery });
                                          form.setFieldsValue({
                                            basicMeta,
                                            ...fields
                                          });
                                        }}
                                        imageURL={productData?.gallery?.[idx]?.thumb ?? null}
                                      />
                                    </Form.Item>
                                  </>
                                  :
                                  <>
                                    <Form.Item
                                      style={{ width: '30%' }}
                                      {...field}
                                      key={`${field.key}_url`}
                                      name={[field.name, 'url']}
                                      label="Image URL"
                                    >
                                      <Input placeholder="Image URL" style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item
                                      style={{ width: '30%' }}
                                      {...field}
                                      key={`${field.key}_thumb`}
                                      name={[field.name, 'thumb']}
                                      label="Thumb url"
                                    >
                                      <Input placeholder="Thumb url" style={{ width: '100%' }} />
                                    </Form.Item>
                                  </>
                              }

                              <Form.Item
                                style={{ width: '30%' }}
                                {...field}
                                key={`${field.key}_title`}
                                name={[field.name, 'title']}
                                label="Title"
                              >
                                <Input placeholder="Title" style={{ width: '100%' }} />
                              </Form.Item>
                              <Form.Item style={{ marginLeft: '10px', marginTop: '4%' }}>
                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                              </Form.Item>
                            </Input.Group>
                          </React.Fragment>
                        ))
                      }
                      <Form.Item
                        style={{
                          width: '20%',
                        }}
                      >
                        <Button
                          type='dashed'
                          onClick={() => {
                            add();
                          }}
                          block
                        >
                          <PlusOutlined /> Add Image
                        </Button>
                      </Form.Item>
                    </React.Fragment>
                  )
                }
              </Form.List>
              {/* </>
                  :
                  <MultipleImageUpload handleUpload={handleGallery} />
              } */}
            </Form.Item>
            {
              propFields?.originalPrice &&
              <Space align="start" size={[30, 0]}>
                <Form.Item
                  label={<strong>Original Price</strong>}
                >
                  <Input.Group compact>
                    <Form.Item
                      name={['basicMeta', 'price', 'original', 'min']}
                      label='Min'
                      rules={[{
                        required: true,
                        message: 'Min price is required'
                      }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={['basicMeta', 'price', 'original', 'max']}
                      label='Max'
                      rules={[{
                        required: true,
                        message: 'Max price is required'
                      }]}
                    >
                      <Input />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
                {
                  propFields?.discountPrice &&
                  <Form.Item label={<strong>Discount Price</strong>}>
                    <Input.Group compact>
                      <Form.Item
                        name={['basicMeta', 'price', 'discount', 'min']}
                        label='Min'
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name={['basicMeta', 'price', 'discount', 'max']}
                        label='Max'
                      >
                        <Input />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                }
                {
                  propFields?.preorderPrice &&
                  <Form.Item label={<strong>Preorder Price</strong>}>
                    <Input.Group compact>
                      <Form.Item
                        name={['basicMeta', 'price', 'preorder', 'min']}
                        label='Min'
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name={['basicMeta', 'price', 'preorder', 'max']}
                        label='Max'
                      >
                        <Input />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                }
              </Space>
            }

            {
              propFields?.category &&
              <Form.Item
                name={['basicMeta', 'category']}
                label={<strong>Category</strong>}>
                <CasaderElm />
              </Form.Item>
            }
            {
              propFields?.video &&
              <Form.Item
                name={['basicMeta', 'videoURL']}
                label={<strong>Video URL</strong>}>
                <Input />
              </Form.Item>
            }
            <Space align="start" size={[30, 0]}>
              {
                propFields?.sales &&
                <Input.Group compact>
                  <Form.Item
                    name={['basicMeta', 'sales']}
                    label={<strong>Sales</strong>}
                  >
                    <InputNumber />
                  </Form.Item>
                  {
                    propFields?.stock &&
                    <Form.Item
                      name={['basicMeta', 'stock']}
                      label={<strong>Stock</strong>}
                    >
                      <InputNumber />
                    </Form.Item>
                  }
                </Input.Group>
              }
              <Form.Item
                name={['basicMeta', 'active_wholesales']}
                label={<strong>Active Wholesale?</strong>}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Space>

            {
              activeWholesale &&
              <>
                <Title level={5}>Wholesale Prices: </Title>
                <Form.List
                  name={['basicMeta', 'wholesale']}
                >
                  {
                    (fields, { add, remove }) => (
                      <React.Fragment>
                        {
                          fields.map((field, idx) => (
                            <React.Fragment key={`${idx}_pwhs`}>
                              <Input.Group compact>
                                <Form.Item
                                  style={{ width: '30%' }}
                                  {...field}
                                  key={`${field.fieldKey}_qty`}
                                  name={[field.name, 'qty']}
                                  fieldKey={[field.fieldKey, 'qty']}
                                  label="Quantity"
                                >
                                  <Input placeholder="Quantity" style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item
                                  style={{ width: '30%' }}
                                  {...field}
                                  key={`${field.fieldKey}_discount`}
                                  name={[field.name, 'discount']}
                                  fieldKey={[field.fieldKey, 'discount']}
                                  label="Discount"
                                >
                                  <Input placeholder="Discount" style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item
                                  style={{ width: '30%' }}
                                  {...field}
                                  key={`${field.fieldKey}_original`}
                                  name={[field.name, 'original']}
                                  fieldKey={[field.fieldKey, 'original']}
                                  label="Original"
                                >
                                  <Input placeholder="Original" style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item style={{ marginLeft: '10px', marginTop: '4%' }}>
                                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                                </Form.Item>
                              </Input.Group>
                            </React.Fragment>
                          ))
                        }
                        <Form.Item
                          style={{
                            width: '20%',
                          }}
                        >
                          <Button
                            type='dashed'
                            onClick={() => {
                              add();
                            }}
                            block
                          >
                            <PlusOutlined /> Add Wholesale info
                          </Button>
                        </Form.Item>
                      </React.Fragment>
                    )
                  }
                </Form.List>
              </>
            }

            <Title level={5}>Product Specifications: </Title>
            <Form.List
              name={['basicMeta', 'specifications']}
            >
              {
                (fields, { add, remove }) => (
                  <React.Fragment>
                    {
                      fields.map((field, idx) => (
                        <div key={`${idx}_pattr`}>
                          <Input.Group compact>
                            <Form.Item
                              {...field}
                              key={`${field.key}_label`}
                              name={[field.name, 'label']}
                              label="Label"
                            >
                              <Input placeholder="Specification label/name" style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              key={`${field.key}_value`}
                              name={[field.name, 'value']}
                              label="Value"
                            >
                              <Input placeholder="Specification value" style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item style={{ marginLeft: '10px', marginTop: '4%' }}>
                              <MinusCircleOutlined onClick={() => remove(field.name)} />
                            </Form.Item>
                          </Input.Group>
                        </div>
                      ))
                    }
                    <Form.Item
                      style={{
                        width: '20%',
                      }}
                    >
                      <Button
                        type='dashed'
                        onClick={() => {
                          add();
                        }}
                        block
                      >
                        <PlusOutlined /> Add an Attribute
                      </Button>
                    </Form.Item>
                  </React.Fragment>
                )
              }
            </Form.List>
            <Divider />
            <Space style={{ width: "100%", justifyContent: "center" }} className='steps-action'>
              <Button
                type='primary' htmlType='submit'>
                Next <ArrowRightOutlined />
              </Button>
            </Space>
          </Form>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BasicInfo;

import React, { useState } from "react";
import Button from 'antd/lib/button/index'
import Collapse from 'antd/lib/collapse/index';
import Row from 'antd/lib/row/index'
import Col from 'antd/lib/col/index'
import Form from 'antd/lib/form/index'
import Input from 'antd/lib/input/index'
import Divider from 'antd/lib/divider/index';
import message from 'antd/lib/message/index'
import Space from 'antd/lib/space/index'
import Table from 'antd/lib/table/index'

import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  LinkOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { nanoid } from "nanoid";
import { Switch } from "antd";
import { EditableContext, useCustomProductEdit } from "../../useCustomProductEdit";
import { EditableCell, SetDefaultCellValue } from "../FormElement";
import { SingleImageUpload } from "../../../SingleImageUpload";

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const PriceAndStock = ({ next, prev }) => {

  const {
    productData,
    isEditableProduct,
    setFormVariationProps,
    properties,
    setProperties,
    propsArray,
    setPropsArray,
    propsNameArray,
    setPropsNameArray,
    dataObj,
    setDataObj,
    editableProduct,
    handleSkuVariations,
    imageUploadActionURL,
    imageUploadActionToken,
  } = useCustomProductEdit();

  let columns = [
    {
      title: "Availability",
      dataIndex: "availability",
      width: "10%",
      editable: true,
      fixed: "left",
      align: "center",
      inputType: "switch",
    },
    {
      title: "Price",
      dataIndex: "price",
      editable: true,
      align: "center",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      align: "center",
      editable: true,
    },
    {
      title: "Weight",
      dataIndex: "weight",
      align: "center",
      editable: true,
      width: "10%",
      inputType: "number",
    },
    {
      title: "CBM",
      dataIndex: "cbm",
      align: "center",
      editable: true,
      width: "10%",
      inputType: "number",
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: "right",
      width: 80,
      align: "center",
      render: (_, record, idx) => {
        return idx > 0 ? (
          <Button
            onClick={() => {
              handleDelete(record.key);
            }}
          >
            <DeleteOutlined />
          </Button>
        ) : null;
      },
    },
  ];

  const [form] = Form.useForm();
  const [skusLoading, setSkusLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});
  const [showImgLink, setShowImgLink] = useState(true);
  const [tableColumns, setTableColumns] = useState(columns);

  /**
   * Generating props columns to show on skus Table
   */
  const handleCols = React.useCallback(() => {
    let newPropsCols = properties && properties?.map((prop, idx) => {
      let title = prop?.name;
      let keyName = title && title?.toLowerCase();
      return {
        title: title,
        dataIndex: keyName,
        editable: true,
        fixed: "left",
        align: "center",
        inputType: "select",
      };
    });

    let allTableColumns = [...tableColumns];

    newPropsCols?.forEach((col, idx) => {
      let newCol = tableColumns.some((tc) => tc.dataIndex !== col.dataIndex);

      if (newCol) {
        allTableColumns.splice(1, 0, col);
      }
    });

    const uniqueArray = allTableColumns.reduce((newArray, item) => {
      let isInclude = newArray.some((tc) => tc.dataIndex === item.dataIndex);
      if (isInclude) {
        return newArray;
      } else {
        return [...newArray, item];
      }
    }, []);

    setTableColumns(() => [...uniqueArray]);
  }, [properties, tableColumns]);

  /**
   * Regenerate skus to show skus data on antd table
   */
  const handlePropCols = React.useCallback(() => {
    // Generating props columns
    handleCols();

    let allCmbnProps = generateCombination(propsArray);
    const { count } = dataObj;
    let newCount = count;

    let newDataSource = allCmbnProps?.map((prop, idx) => {
      let newCols = {};

      prop.forEach((item, iidx) => {
        newCols[propsNameArray[idx][iidx]?.name?.toLowerCase()] = item.name;
      });

      let combinedProps = prop.map((item) => item.id).join();

      newCount = newCount + 1;

      return {
        id: newCount,
        key: combinedProps,
        availability: true,
        ...newCols,
        quantity: 0,
        price: {
          offer: defaultValues?.offer || 0,
          actual: defaultValues?.actual || 0,
          preorder: defaultValues?.preorder || 0
        },
        stock: {
          min: defaultValues?.min || 0,
          available: defaultValues?.available || 0,
          limit: defaultValues?.limit || 0,
        },
        wholesalePrice: 0,
        weight: defaultValues?.weight || 0,
        cbm: defaultValues?.cbm || 0,
        props: combinedProps,
      };
    });

    setDataObj(() => {
      return {
        dataSource: newDataSource,
        count: newCount,
      };
    });

  }, [handleCols, propsArray, propsNameArray, dataObj, setDataObj, defaultValues]);

  const handleSetDefaultValue = (actionType = "set") => {
    if (dataObj?.dataSource) {
      let copiedDataSource = []
      if (actionType === 'set') {
        copiedDataSource = dataObj?.dataSource?.map(item => {
          return {
            ...item,
            key: nanoid(6),
            price: {
              offer: defaultValues?.offer || item?.price?.offer || 0,
              actual: defaultValues?.actual || item?.price?.actual || 0,
              preorder: defaultValues?.preorder || item?.price?.preorder || 0
            },
            stock: {
              min: defaultValues?.min || item?.stock?.min || 0,
              available: defaultValues?.available || item?.stock?.available || 0,
              limit: defaultValues?.limit || item?.stock?.stock || 0,
            },
            wholesalePrice: 0,
            weight: defaultValues?.weight || item?.weight || 0,
            cbm: defaultValues?.cbm || item?.cbm || 0,
          };
        })

      } else if (actionType === 'clear') {
        copiedDataSource = dataObj?.dataSource?.map(item => {
          return {
            ...item,
            key: nanoid(6),
            price: {
              offer: 0,
              actual: 0,
              preorder: 0
            },
            stock: {
              min: 0,
              available: 0,
              limit: 0,
            },
            wholesalePrice: 0,
            weight: 0,
            cbm: 0,
          };
        })
      } else if (actionType === 'revert') {
        let revertedSkus = [...editableProduct?.variation?.skus];
        copiedDataSource = dataObj?.dataSource?.map((current, idx) => {
          let item = revertedSkus[idx];
          return {
            ...current,
            key: nanoid(5),
            price: {
              offer: item?.price?.offer || 0,
              actual: item?.price?.actual || 0,
              preorder: item?.price?.preorder || 0
            },
            stock: {
              min: item?.stock?.min || 0,
              available: item?.stock?.available || 0,
              limit: item?.stock?.stock || 0,
            },
            weight: item?.weight || 0,
            cbm: item?.cbm || 0,
          };
        })
      }

      setDataObj(() => {
        return {
          ...dataObj,
          dataSource: copiedDataSource,
        };
      });
    }
  }

  /**
   *  Storing props and props combination to generate skus data
   *  @Params {Array} properties - Product properties data
   */

  const handleProps = React.useCallback(
    (properties) => {
      let propertiesData = properties?.map((item, id) => {
        let newValues = item?.values?.map((value, vid) => {
          return {
            id: value?.id ?? vid + 1,
            ...value
          }
        });

        item && Object.assign(item, {
          id: item?.id ?? id + 1,
          values: newValues && [...newValues],
        })

        return item;
      });

      setProperties(() => [...propertiesData]);
      setFormVariationProps(() => propertiesData);

      let preparePropsAra = [];
      let preparedPropsName = propertiesData?.map((item, id) => {
        let itemValues = item && item?.values;

        preparePropsAra.push(itemValues);

        return itemValues?.map(() => ({
          ...item,
        }));

      });

      setPropsArray(() => [...preparePropsAra]);
      let propsNameList = generateCombination(preparedPropsName);
      setPropsNameArray(() => [...propsNameList]);

    },
    [setProperties, setFormVariationProps, setPropsArray, setPropsNameArray]
  );

  /**
   * On Edit generate products props
   */
  React.useEffect(() => {
    let propsData = (productData && productData.properties) || (productData && productData.variation && productData.variation.props);
    if (isEditableProduct || propsData) {
      handleProps(propsData);
    }
  }, [isEditableProduct, productData, handleProps]);

  /**
   * Formatting skus data to show on antd table on edit
   */
  const genProductSKUs = React.useCallback(
    (productSkus, propsData) => {
      if (productSkus && propsData) {
        /**
         * Generating Props columns
         */
        setSkusLoading(true);
        let newPropsCols =
          propsData &&
          propsData?.map((prop, idx) => {
            let title = prop?.name;
            let keyName = title && title?.toLowerCase();
            return {
              title: title,
              dataIndex: keyName,
              editable: true,
              fixed: "left",
              align: "center",
              inputType: "select",
            };
          });

        newPropsCols &&
          newPropsCols?.forEach((col) => {
            setTableColumns((currentState) => {
              currentState.splice(1, 0, col);

              const uniqueArray = currentState.reduce((newArray, item) => {
                let isInclude = newArray.some(
                  (tc) => tc.dataIndex === item.dataIndex
                );
                if (isInclude) {
                  return newArray;
                } else {
                  return [...newArray, item];
                }
              }, []);

              return uniqueArray;
            });
          });

        /**
         * Generating skus data
         */
        let skuReform = propsData && productSkus?.map((sku, idx) => {
          const skuProps = sku && sku.props && sku.props.split(",");

          let newCols = {};

          skuProps && skuProps.forEach((propValueID, pvdx) => {
            let prop = propsData[pvdx];
            let pname = prop.name.toLowerCase();
            let propValue = prop?.values?.find(item => {
              if (typeof item.id === 'number') {
                return item.id === parseInt(propValueID);
              }
              return item.id === propValueID;
            });
            let skuValue = propValue?.name ?? prop?.name;
            newCols[pname] = skuValue;
          })

          return {
            id: sku.id,
            key: sku.props,
            ...newCols,
            price: sku.price,
            stock: sku.stock,
            props: sku.props,
          };
        });

        let newCount = skuReform[skuReform?.length - 1].key;

        setDataObj(() => {
          return {
            dataSource: [...skuReform],
            count: newCount,
          };
        });

        setSkusLoading(false);
      }
    },
    [setDataObj]
  );

  /**
   * Load skus data after formating on Edit
   */
  React.useEffect(() => {
    let productSkus = (productData && productData.skus) || (productData && productData.variation && productData.variation.skus);

    let propsData = (productData && productData.properties) || (productData && productData.variation && productData.variation.props);

    if (isEditableProduct || (propsData && productSkus)) {
      genProductSKUs(productSkus, propsData);
    }
  }, [isEditableProduct, productData, genProductSKUs]);


  /**
   *
   * @param {int} key - Product sku key/ID
   */
  const handleDelete = (key) => {
    setDataObj((currentState) => {
      return {
        count: currentState?.count,
        dataSource: currentState?.dataSource?.filter(
          (item) => item.key !== key
        ),
      };
    });
  };

  /**
   *
   * @param {Object} row - Product Sku Object
   */
  const handleSave = (row) => {
    const newData = [...dataObj?.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });

    let newCount = newData[newData?.length - 1].key;
    setDataObj(() => {
      return {
        dataSource: newData,
        count: newCount,
      };
    });
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const tColumns = tableColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        inputType: col.inputType,
        handleSave: handleSave,
      }),
    };
  });

  /**
   * Generating skus combinations to show props value and store props data
   * @param {Arrays} args - collection of arrays
   * @returns Array
   */
  function generateCombination(args) {
    let r = [],
      max = args?.length - 1;
    function cmbRecurse(arr, i) {
      for (let j = 0, l = args?.[i]?.length; j < l; j++) {
        let a = arr?.slice(0); // clone arr
        a.push(args[i][j]);
        if (i === max) r.push(a);
        else cmbRecurse(a, i + 1);
      }
    }
    cmbRecurse([], 0);

    return r;
  }

  return (
    <React.Fragment>
      <Form
        form={form}
        name="priceAndStock"
        layout="vertical"
        onFinish={(v) => {
          handleSkuVariations({form, next, message});
        }}
        onValuesChange={(cv, av) => {
          handleProps(av?.properties ?? []);
        }}
        initialValues={{
          properties: productData?.properties || productData?.variation?.props,
        }}
      >
        <div className="product-props">
          <Form.Item label="Variations">
            <Form.List name="properties">
              {(fields, { add, remove }) => (
                <React.Fragment>
                  {fields.map((field, idx) => (
                    <React.Fragment key={`${field.key}_pig`}>
                      <Input.Group compact>
                        <Form.Item
                          {...field}
                          hidden={true}
                          key={`${field.key}_pid`}
                          name={[field.name, "id"]}
                        >
                          <Input placeholder="ID" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          key={`${field.key}_pname`}
                          name={[field.name, "name"]}
                          rules={[{
                            required: true,
                            message: 'Variation Name required'
                          }]}
                        >
                          <Input placeholder="Variation Name" />
                        </Form.Item>
                        <div style={{ marginLeft: "10px", marginTop: "5px" }}>
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                          />
                        </div>
                      </Input.Group>
                      <Row>
                        <Col offset={3} span={18}>
                          <Form.Item label="Values">
                            <Form.List name={[field.name, "values"]}>
                              {(values, { add, remove }) => (
                                <Space
                                  direction="vertical"
                                  style={{
                                    width: "100%",
                                  }}
                                >
                                  <Collapse
                                    defaultActiveKey={[`0`]}
                                    style={{
                                      marginBottom: "1em",
                                    }}
                                    accordion
                                  >
                                    {values.map((propValue, pvidx) => {
                                      return (
                                        <Collapse.Panel
                                          forceRender
                                          header={`Variant - ${propValue.name + 1}`}
                                          key={propValue.key}
                                        >
                                          <Form.Item
                                            hidden
                                            {...propValue}
                                            key={`${propValue.name}_pvid`}
                                            name={[propValue.name, "id"]}
                                            fieldKey={[
                                              propValue.fieldKey,
                                              "id",
                                            ]}
                                          >
                                            <Input />
                                          </Form.Item>
                                          <Input.Group compact>
                                            <Form.Item
                                              {...propValue}
                                              key={`${propValue.name}_pvname`}
                                              name={[propValue.name, "name"]}
                                              fieldKey={[
                                                propValue.fieldKey,
                                                "name",
                                              ]}
                                            >
                                              <Input placeholder="Variant Name" />
                                            </Form.Item>
                                            <Form.Item
                                              {...propValue}
                                              key={`${propValue.name}_pvcolor`}
                                              name={[propValue.name, "color"]}
                                              fieldKey={[
                                                propValue.fieldKey,
                                                "color",
                                              ]}
                                            >
                                              <Input placeholder="Variant color" />
                                            </Form.Item>
                                            <Form.Item
                                              {...propValue}
                                              key={`${propValue.name}_pvtitle`}
                                              name={[propValue.name, "title"]}
                                              fieldKey={[
                                                propValue.fieldKey,
                                                "title",
                                              ]}
                                            >
                                              <Input placeholder="Variant title" />
                                            </Form.Item>
                                            <div
                                              style={{
                                                marginLeft: "10px",
                                                marginTop: "5px",
                                              }}
                                            >
                                              <MinusCircleOutlined
                                                onClick={() =>
                                                  remove(propValue.name)
                                                }
                                              />
                                            </div>
                                          </Input.Group>
                                          <Form.Item
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
                                          >
                                            {
                                              showImgLink ?
                                                <>
                                                  <Form.Item
                                                    style={{ width: '70%' }}
                                                    {...field}
                                                    key={`${propValue.name}_pvimage`}
                                                    name={[propValue.name, "image"]}
                                                    label="Image URL"
                                                  >
                                                    <Input placeholder="Image URL" style={{ width: '100%' }} />
                                                  </Form.Item>
                                                  <Form.Item
                                                    style={{ width: '70%' }}
                                                    {...field}
                                                    key={`${propValue.name}_pvthumb`}
                                                    name={[propValue.name, "thumb"]}
                                                    label="Thumb URL"
                                                  >
                                                    <Input placeholder="Thumb URL" style={{ width: '100%' }} />
                                                  </Form.Item>
                                                </>
                                                :
                                                <Space>
                                                  <Form.Item label="Image">
                                                    <SingleImageUpload
                                                      actionURL={imageUploadActionURL}
                                                      actionToken={imageUploadActionToken}
                                                      handleUploadedImage={(img) => {
                                                        const fields = form.getFieldsValue();
                                                        const { properties } = fields;
                                                        let updatedProps = [...properties];
                                                        let updatedValues = [...updatedProps[idx]?.values]
                                                        updatedValues[pvidx] = {
                                                          ...updatedValues[pvidx],
                                                          image: img.imageURL
                                                        }
                                                        updatedProps[idx] = {
                                                          ...updatedProps[idx],
                                                          values: updatedValues,
                                                        }
                                                        Object.assign(fields, { properties: updatedProps });
                                                        form.setFieldsValue({
                                                          properties,
                                                          ...fields
                                                        });
                                                      }}
                                                      imageURL={productData?.props?.[idx]?.values?.[pvidx]?.image ?? null}
                                                    />
                                                  </Form.Item>
                                                  <Form.Item label="Thumb">
                                                    <SingleImageUpload
                                                      actionURL={imageUploadActionURL}
                                                      actionToken={imageUploadActionToken}
                                                      handleUploadedImage={(img) => {
                                                        const fields = form.getFieldsValue();
                                                        const { properties } = fields;
                                                        let updatedProps = [...properties];
                                                        let updatedValues = [...updatedProps[idx]?.values]
                                                        updatedValues[pvidx] = {
                                                          ...updatedValues[pvidx],
                                                          thumb: img.imageURL
                                                        }
                                                        updatedProps[idx] = {
                                                          ...updatedProps[idx],
                                                          values: updatedValues,
                                                        }
                                                        Object.assign(fields, { properties: updatedProps });
                                                        form.setFieldsValue({
                                                          properties,
                                                          ...fields
                                                        });
                                                      }}
                                                      imageURL={productData?.props?.[idx]?.values?.[pvidx]?.thumb ?? null}
                                                    />
                                                  </Form.Item>
                                                </Space>
                                            }
                                          </Form.Item>

                                        </Collapse.Panel>
                                      );
                                    })}
                                  </Collapse>
                                  <Form.Item
                                    style={{
                                      width: "20%",
                                    }}
                                  >
                                    <Button
                                      type="dashed"
                                      onClick={() => {
                                        add();
                                      }}
                                      block
                                    >
                                      <PlusOutlined /> Add a Variant
                                    </Button>
                                  </Form.Item>
                                </Space>
                              )}
                            </Form.List>
                          </Form.Item>
                        </Col>
                      </Row>
                    </React.Fragment>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      Add a Variantion
                    </Button>
                  </Form.Item>
                </React.Fragment>
              )}
            </Form.List>
          </Form.Item>
        </div>

        <div>
          <SetDefaultCellValue
            handleSetDefaultValue={() => handleSetDefaultValue()}
            defaultValues={defaultValues}
            handleSetValueChange={(field, value) => {
              setDefaultValues({
                ...defaultValues,
                [field]: value
              })
            }}
            handleClearSetValues={() => {
              setDefaultValues({
                actual: null,
                offer: null,
                preorder: null,
                min: null,
                limit: null,
                available: null,
              })
            }}
          />
          <Button.Group>
            <Button
              onClick={handlePropCols}
              type="primary"
              style={{
                marginBottom: 16,
              }}
            >
              Generate SKUs with Provided Default Values
            </Button>
            <Button
              onClick={() => handleSetDefaultValue()}
              type="default"
              style={{
                marginBottom: 16,
                marginLeft: 20
              }}
            >
              Set All Values after SKU Generations
            </Button>
            {
              isEditableProduct &&
              <Button
                onClick={() => handleSetDefaultValue('revert')}
                type="default"
                style={{
                  marginBottom: 16,
                  marginLeft: 20
                }}
              >
                Revert to product's original Values
              </Button>
            }
          </Button.Group>
          <Table
            components={components}
            rowClassName={() => "editable-row"}
            columns={tColumns}
            size="small"
            dataSource={dataObj?.dataSource}
            scroll={{ x: 1500 }}
            pagination={false}
            loading={skusLoading}
          />
        </div>

        <Divider />

        <Space
          style={{ width: "100%", justifyContent: "center" }}
          className="steps-action"
        >
          <Button.Group>
            <Button onClick={() => prev()} type="primary">
              Prev <ArrowLeftOutlined />
            </Button>
            <Button type="primary" htmlType="submit">
              Next <ArrowRightOutlined />
            </Button>
          </Button.Group>
        </Space>
      </Form>
    </React.Fragment>
  );
};

export default PriceAndStock;

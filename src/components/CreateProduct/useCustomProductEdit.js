import React, { useEffect, useState } from "react";
import message from 'antd/lib/message/index'


const CustomProductEditContext = React.createContext()
const CustomProductEditableContext = React.createContext(null)
const EditableContext = React.createContext(null)

function CustomProductEditProvider(props) {
  const { 
    fetchProductForEdit, 
    updateProductService, 
    toastErrors,
    imageUploadActionURL,
    imageUploadActionToken,
    productID,
    isEdit,
  } = props;
  const [productData, setProductData] = useState(null);
  const [editableProduct, setEditableProduct] = useState(null);
  const [currentProductID, setCurrentProductID] = useState(null);
  const [isEditableProduct, setIsEditableProduct] = useState(null);
  const [formVariationProps, setFormVariationProps] = useState(null);
  const [properties, setProperties] = useState([]);
  const [propsArray, setPropsArray] = useState([]);
  const [propsNameArray, setPropsNameArray] = useState([]);
  const [propFields, setPropFields] = useState({
    country: false,
    currency: true,
    sourcing_agent: true,
    shop_id: true,
    title: true,
    link: true,
    image: true,
    stock: false,
    sales: true,
    price: true,
    originalPrice: false,
    discountPrice: false,
    preorderPrice: false,
    gallery: true,
    category: false,
    video: false,
  });

  const [dataObj, setDataObj] = useState({
    dataSource: [
      {
        key: "0:1",
        availability: false,
        quantity: 0,
        price: {},
        stock: {},
        wholesalePrice: 0,
        weight: 0,
        cbm: 0,
        props: "0:1",
      },
    ],
    count: 1,
  })

  const [current, setCurrent] = useState(0);
  const [storeList,] = React.useState(props?.storeList || []);
  // let { productID } = useParams();
  // let queryParams = new URLSearchParams(useLocation().search.slice(1));
  // let isEdit = queryParams.get('edit');

  const fetchEditProduct = React.useCallback((id) => {
    fetchProductForEdit(id)
      .then(res => {
        let pdata = res?.data?.product ?? {};
        setProductData(pdata);
        setEditableProduct(pdata)
      })
      .catch(err => {
        message.error('Error arose while trying to fetching product for edit.')
      })
  }, [fetchProductForEdit])

  React.useEffect(() => {
    setIsEditableProduct(isEdit);

  }, [setIsEditableProduct, isEdit,])


  React.useEffect(() => {
    if (isEditableProduct && isEdit) {
      fetchEditProduct(productID)
      setCurrentProductID(productID)
    }
  }, [isEditableProduct, isEdit, fetchEditProduct, productID, setCurrentProductID])

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleStep = (currentCount) => {
    setCurrent(currentCount)
  };

  React.useEffect(() => {
    return () => {
      setProductData(null);
    }
  }, [setProductData])

  const handlePrimaryInfo = ({ form, next, message }) => {
     form.validateFields(['basicMeta'])
      .then((values) => {
        let { basicMeta } = values;
        let findStore = storeList?.find(el => el.id === basicMeta.shop_id)
        basicMeta.meta = {
          vendor: findStore?.vendor_name ? findStore?.vendor_name : "NotFound"
        }
        setProductData({ ...basicMeta })
        next();
      })
      .catch(() => {
        message.warning('Please provide correct data');
      });

  };


  const handleDetails = ({ form, next, message = null }) => {
    form.validateFields(['description'])
      .then(values => {
        if (values?.description) {
          setProductData((currentState) => {
            return {
              ...currentState,
              ...values,
            }
          })
        }

        next()
      })
      .catch(() => {
        if (message) {
          message.warning('Please provide correct data');
        }
      })

  }

  /**
   * Format skus data and store in the productData to submit on post requests
   */
  const handleSkuVariations = ({ form, next, message }) => {
    if (properties?.[0]?.values?.length > 0 && dataObj?.dataSource?.length > 0) {
      form.validateFields(["properties"])
        .then((values) => {
          const { properties } = values;
          let skuReform = dataObj?.dataSource?.map((sku) => {
            return {
              id: sku.id,
              price: sku.price,
              stock: sku.stock,
              props: sku.props,
            };
          });
          setProductData((currentState) => {
            return {
              ...currentState,
              properties: [...properties],
              skus: [...skuReform],
            };
          });

          next();
        })
        .catch(() => {
          message.warning("Please provide correct data");
        });
    }
    else {
      message.warning("Mininum one variation and it's skus are required")
    }
  };


  const handleDeliveryOptions = ({ form, next, message }) => {
    form.validateFields(['warranty', 'delivery'])
      .then(values => {
        const { warranty, delivery } = values;
        setProductData(currentState => {
          return {
            ...currentState,
            ...warranty,
            ...delivery,
          }
        })
        next()
      })
      .catch(() => {
        message.warning('Please provide correct data');
      })
  }


  const handleFinalSubmit = ({ message, history }) => {
    let copiedProduct = { ...productData }
    // const {skus, properties: props, ...payload} = copiedProduct;
    // copiedProduct['variation'] = {skus, props}
    if (isEditableProduct) {
      let epSpecs = editableProduct?.specifications;
      let currentSpecs = copiedProduct?.specifications;
      copiedProduct['specifications'] = epSpecs?.map((item, idx) => {
        return {
          label: {
            ...item?.label,
            name: currentSpecs[idx]?.label,
          },
          value: {
            ...item?.value,
            name: currentSpecs[idx]?.value,
          }
        }
      })
    } else {
      copiedProduct['specifications'] = copiedProduct?.specifications?.map((item, idx) => {
        return {
          label: {
            id: item?.label_id || `${item.label?.split(' ')?.join('_')}_${idx}`,
            name: item.label,
          },
          value: {
            id: item?.value_id || `${item.value?.split(' ')?.join('_')}_${idx}`,
            name: item.value,
          }
        }
      })
    }

    updateProductService(copiedProduct, isEditableProduct ? currentProductID : null)
      .then(res => {
        if (res?.status === 200 && res?.data.status === "success") {
          message.success(res?.data?.message)
          history.push('/products-manage/products')
        } else {
          message.warning(res?.data?.message)
        }

      })
      .catch(({ response }) => {
        if (response?.data?.errors) {
          toastErrors(response.data);
        }
      })
  }

  return <CustomProductEditContext.Provider value={{
    productData,
    setProductData,
    fetchEditProduct,
    isEditableProduct,
    setIsEditableProduct,
    formVariationProps,
    setFormVariationProps,
    properties,
    setProperties,
    propsArray,
    setPropsArray,
    propsNameArray,
    setPropsNameArray,
    dataObj, setDataObj,
    currentProductID,
    setCurrentProductID,
    propFields, setPropFields,
    editableProduct,
    isEdit,
    productID,
    current,
    storeList,
    next,
    prev,
    handleStep,
    handlePrimaryInfo,
    handleDetails,
    handleSkuVariations,
    handleDeliveryOptions,
    handleFinalSubmit,
    imageUploadActionURL,
    imageUploadActionToken,
  }} {...props} />
}

function useCustomProductEdit() {
  const context = React.useContext(CustomProductEditContext)
  if (context === undefined) {
    throw new Error(`useProductEdit must be used within a CustomProductEditProvider`)
  }
  return context
}

export { CustomProductEditProvider, useCustomProductEdit, CustomProductEditableContext, EditableContext }

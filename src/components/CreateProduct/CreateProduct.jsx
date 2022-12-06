import React from 'react';
import PageHeader from 'antd/lib/page-header/index'
import Row from 'antd/lib/row/index'
import Col from 'antd/lib/col/index'
import Divider from 'antd/lib/divider/index'
import Form from 'antd/lib/form/index'
import Steps from 'antd/lib/steps/index'
import 'antd/dist/antd.css'

import { BasicInfo, DetailsInfo, PriceAndStock, ServiceAndDelivery, SummaryPage } from './components/FormStep';
import { useCustomProductEdit } from './useCustomProductEdit';

const CreateProduct = () => {

  const {
    current,
    isEditableProduct,
    isEdit,
    next,
    prev,
    handleStep,
    productID
  }  = useCustomProductEdit();

  const steps = [
    {
      title: 'Basic Info',
      description: 'name, price, etc',
      content: <BasicInfo next={next} prev={prev} />
    },
    {
      title: 'Details',
      description: 'description',
      content: <DetailsInfo next={next} prev={prev} />
    },
    {
      title: 'Variations & Price',
      description: 'Variations and skus',
      content: <PriceAndStock next={next} prev={prev} />
    },
    {
      title: 'Service & Delivery',
      description: 'Warranty, delivery',
      content: <ServiceAndDelivery next={next} prev={prev} />
    },
    {
      title: 'Confirm',
      content: <SummaryPage next={next} prev={prev} />
    }
  ];


  return (
    <React.Fragment>
      <PageHeader
        ghost={false}
        className='site-page-header'
        onBack={() => window.history.back()}
        title={ isEditableProduct && isEdit ? `Edit Product #${productID}`  : 'Add a New Product'}
      />
      <div style={{ backgroundColor: '#fff', marginTop: '1rem', padding: '3rem' }}>
        {
          (
            <Row>
              <Col span={24}>
                {
                  <React.Fragment>
                    <Steps
                      current={current}
                      onChange={handleStep}
                      items={steps}
                    />
                    <Divider />
                    <div className='steps-content'>
                      <Form.Provider>
                        {steps[current].content}
                      </Form.Provider>
                    </div>
                  </React.Fragment>
                }
              </Col>
            </Row>
          )}
      </div>
    </React.Fragment>
  );
};

export default CreateProduct;

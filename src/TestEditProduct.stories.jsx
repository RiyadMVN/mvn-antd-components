import TestEditProduct from "./TestEditProduct";

const fetchProductForEdit = () => {
    return new Promise((resolve, reject) => {
        try {
            resolve('Done');
        } catch (e) {
            reject();
        }
    });
}

const getStores = () => {
    return new Promise((resolve, reject) => {
        try {
            resolve('Done');
        } catch (e) {
            reject();
        }
    });
}

const updateProductService = () => {
    return new Promise((resolve, reject) => {
        try {
            resolve('Done');
        } catch (e) {
            reject();
        }
    });
}

const storeList = [
    {
        "id": 1,
        "name": "1688",
        "vendor_name": "1688",
        "storeId": 10,
        "url": "www.1688.com",
        "totalFx": 16.65,
        "fx": 15,
        "mvn_commission": 11,
        "min_order_amount": "2500.00"
    },
    {
        "id": 2,
        "name": "Taobao",
        "vendor_name": "Taobao",
        "storeId": 4,
        "url": "https://taobao.com",
        "totalFx": 16.254,
        "fx": 14,
        "mvn_commission": 16.1,
        "min_order_amount": "500.00"
    },
    {
        "id": 3,
        "name": "AliExpress",
        "vendor_name": "AliExpress",
        "storeId": 1,
        "url": "https://www.aliexpress.com",
        "totalFx": 92.0028,
        "fx": 86,
        "mvn_commission": 6.98,
        "min_order_amount": "2500.00"
    },
    {
        "id": 4,
        "name": "Alibaba",
        "vendor_name": "alibaba",
        "storeId": 11,
        "url": "https://alibaba.com",
        "totalFx": 91.0052,
        "fx": 86,
        "mvn_commission": 5.82,
        "min_order_amount": "3000.00"
    },
    {
        "id": 5,
        "name": "AmazonUSA",
        "vendor_name": "amazon",
        "storeId": 12,
        "url": "https://amazon.com",
        "totalFx": 92.0028,
        "fx": 86,
        "mvn_commission": 6.98,
        "min_order_amount": null
    },
    {
        "id": 6,
        "name": "Pinduoduo",
        "vendor_name": "Pingduoduo",
        "storeId": 14,
        "url": "https://pingduoduo.com",
        "totalFx": 17.5,
        "fx": 14,
        "mvn_commission": 25,
        "min_order_amount": null
    },
    {
        "id": 7,
        "name": "Ebay",
        "vendor_name": "ebay USA",
        "storeId": 16,
        "url": "https://ebay.com",
        "totalFx": 92.0028,
        "fx": 86,
        "mvn_commission": 6.98,
        "min_order_amount": null
    },
    {
        "id": 8,
        "name": "AmazonIndia",
        "vendor_name": "amazon",
        "storeId": 13,
        "url": "https://www.amazon.in/",
        "totalFx": 1.197,
        "fx": 1.1400000000000001,
        "mvn_commission": 5,
        "min_order_amount": null
    },
    {
        "id": 9,
        "name": "Flipkart",
        "vendor_name": "Amazon UAE",
        "storeId": 23,
        "url": "https://amazon.ae",
        "totalFx": 16.5,
        "fx": 15,
        "mvn_commission": 10,
        "min_order_amount": null
    },
    {
        "id": 10,
        "name": "Ulta",
        "vendor_name": "Amazon UAE",
        "storeId": 17,
        "url": "https://amazon.ae",
        "totalFx": 11,
        "fx": 10,
        "mvn_commission": 10,
        "min_order_amount": null
    }
]

export default {
    title: "Test Edit Product",
    component: TestEditProduct,
    args: {
        getStores: getStores,
        fetchProductForEdit: fetchProductForEdit,
        updateProductService: updateProductService,
        toastErrors: (data) => {
            console.error({data})
        },
        storeList,
    }
};

const Template = args => <TestEditProduct {...args} />;

const Standard = Template.bind({});

export { Standard };
import { CreateProduct, CustomProductEditProvider } from "./components";


const TestEditProduct = ({fetchProductForEdit, getStores, updateProductService, toastErrors, storeList}) => (
    <CustomProductEditProvider
    fetchProductForEdit={fetchProductForEdit}
    getStores={getStores}
    updateProductService={updateProductService}
    toastErrors={toastErrors}
    storeList={storeList}
    >
        <CreateProduct />
    </CustomProductEditProvider>
);

export default TestEditProduct;
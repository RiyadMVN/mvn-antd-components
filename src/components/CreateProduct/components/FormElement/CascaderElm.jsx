import { Cascader } from 'antd';
import React from 'react';
import { categories as catData } from './categories';

const CasaderElm = () => {

    let categories = catData;

    const onChange = (v, selected) => {
        // console.log('v', v);
        // console.log('selected', selected);
    }

    // function filter(inputValue, path) {
    //     return path.some(option => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) >= -1);
    // }

    return (
        <Cascader
            // showSearch={{filter}}
            fieldNames={{ label: 'name', value: 'name', children: 'children', id: 'categoryId' }}
            options={categories}
            onChange={onChange}
            placeholder="Please select"
        />
    );
}

export default CasaderElm;
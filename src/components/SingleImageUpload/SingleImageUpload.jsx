import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React from "react";

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isValidFileFormat = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'video/mp4';
    if (!isValidFileFormat) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLtFifty = file.size / 1024 / 1024 < 50;
    if (!isLtFifty) {
        message.error('Image must smaller than 2MB!');
    }
    return isLtFifty;
}

class SingleImageUpload extends React.Component {
    state = {
        loading: false,
        imageUrl: this.props.imageURL,
        showProgress: this.props.showProgress || false,
        isVideo: this.props.isVideo
    };

    handleChange = info => {
        const status = info.file.status;

        if (status === 'uploading') {
            this.setState({ loading: true });
            return;
        }

        if (status === 'done') {
            const response = info.file.response;
            this.props.handleUploadedImage(response);
            getBase64(info.file.originFileObj, imageUrl => {
                if (this.props.isVideo) {
                    this.setState({
                        imageUrl: null,
                        loading: false,
                    })
                } else {
                    this.setState({
                        imageUrl,
                        loading: false,
                    })
                }
            }
            );
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }

    };

    render() {
        const uploadButton = (
            <div>
                {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = this.state;
        return (
            <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={`${this.props?.actionURL}/files`}
                method="POST"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
                headers={{
                    "authorization": " Bearer " + localStorage.getItem(this.props?.actionToken)
                }}
                progress={
                    {
                        strokeColor: {
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        },
                        strokeWidth: 3,
                        format: percent => `${parseFloat(percent.toFixed(2))}%`,
                    }
                }
            >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
        );
    }
}
export default SingleImageUpload

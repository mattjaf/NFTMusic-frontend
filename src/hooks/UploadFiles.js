import { Upload, message } from 'antd';

const axios = require('axios');
const MORALIS_API_KEY = process.env.REACT_MORALIS_API_KEY;

export const uploadFiles = async (files) => {
    let ipfsArray = [];
    let promises = [];

    for (let i = 0; i < files.length; i++) {
        promises.push(
            new Promise((res, rej) => {
                let reader = new FileReader();
                reader.onload = (e) => {
                    ipfsArray.push({
                        path: `media/${i}`,
                        content: e.target.result.toString('base64'),
                    });
                    res();
                };
                reader.readAsDataURL(files[i]);
            })
        );
    }

    await Promise.all(promises).then(() => {
        axios
            .post(
                'https://deep-index.moralis.io/api/v2/ipfs/uploadFolder',
                ipfsArray,
                {
                    headers: {
                        'X-API-KEY': MORALIS_API_KEY,
                        'Content-Type': 'application/json',
                        accept: 'application/json',
                    },
                }
            )
            .then((res) => {
                console.log(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    });
};

export const FileUploader = () => {
    const handleChange = ({ fileList }) => {
        const uploadedFiles = fileList.map(file => file.originFileObj);
        uploadFiles(uploadedFiles);
    };

    return (
        <Upload
            onChange={handleChange}
            multiple
            customRequest={() => { }}
            showUploadList={false}
        >
            <p>Click or drag files here to upload</p>
        </Upload>
    );
};

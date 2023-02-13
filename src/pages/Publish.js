import React, { useState, useEffect } from "react";
import "./Publish.css";
import { Tabs } from "antd";
import { useMoralisFile, useMoralis, useWeb3ExecuteFunction } from "react-moralis"
import { InboxOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { message, Upload, Button, Space } from 'antd';
import NetworkMapping from "../config/NetworkMapping.json"
import NFTMusicFactoryABI from "../config/NFTMusicFactory.json"


const { Dragger } = Upload;
const { TabPane } = Tabs;

const beforeUploadingImage = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    return isJpgOrPng;
};

const Publish = () => {
    const { saveFile } = useMoralisFile();
    const { Moralis, chainId, user, isAuthenticated } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "80001"
    const NFTMusicFactoryAddress = NetworkMapping[chainString] ? NetworkMapping[chainString].NFTMusicFactory[0] : NetworkMapping["80001"].NFTMusicFactory[0]
    const [fileToSongMapping, setFileToSongMapping] = useState({})
    const [metaDataArray, setMetaDataArray] = useState([])
    const contractProcessor = useWeb3ExecuteFunction();


    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }

    };
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload Album cover
            </div>
        </div>
    );

    const uploadMusicProps = {
        name: 'file',
        multiple: true,
        customRequest(event) {
            const file = event.file;
            if (!file) return;
            const metadata = { createdById: user.id };
            saveFile(file?.name, file, {
                onSuccess(result) {
                    console.log(result)
                    fileToSongMapping[file.name] = result._ipfs
                    console.log(fileToSongMapping)
                },
                type: event.file.type,
                metadata,
                saveIPFS: true,
            })
        },
        onChange(info) {
            const { status } = info.file;
            console.log(info) // this might need some work
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === "removed") {
                delete fileToSongMapping[info.file.name]
                console.log(fileToSongMapping)
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    const getAudioDuration = async (url) => {
        const audio = new Audio();
        audio.src = url;
        return new Promise((resolve) => {
            audio.onloadedmetadata = function () {
                const minutes = Math.floor(audio.duration / 60);
                const seconds = Math.floor(audio.duration % 60);
                resolve(`${minutes}:${String(seconds).padStart(2, '0')}`);
            };
        });
    };

    const uploadNftMetada = async () => {
        console.log(fileToSongMapping)
        for (const key in fileToSongMapping) {
            console.log(fileToSongMapping[key])
            console.log("hello")
            const metadataNft = {
                image: imageUrl,
                name: "songName", //?
                animation_url: fileToSongMapping[key],
                duration: await getAudioDuration(fileToSongMapping[key]),
                artist: "",
                year: ""
            };
            const resultNft = await saveFile(
                "metadata.json",
                { base64: btoa(JSON.stringify(metadataNft)) },
                {
                    type: "base64",
                    saveIPFS: true,
                }
            );
            metaDataArray.push(resultNft._ipfs)
        }
    };

    const deployAndMint = async () => {
        let options = {
            contractAddress: NFTMusicFactoryAddress,
            functionName: "deployNFTMusicSimple",
            abi: NFTMusicFactoryABI,
            params: {
                _name: "test",
                _symbol: "symbol",
                _songs: metaDataArray,
                _albumCover: imageUrl
            },
        }
        await contractProcessor.fetch({
            params: options,
            onSuccess: () => {
                alert("Succesful Mint");
                setFileToSongMapping({})
                setMetaDataArray([])
                setImageUrl(undefined)
            },
            onError: (error) => {
                alert(error.message);
            },
        });
    }

    const handlePublish = async () => {
        await uploadNftMetada()
        await deployAndMint()
        console.log("hello")
    }

    useEffect(() => {
        console.log(fileToSongMapping)
        console.log(metaDataArray)
    }, [fileToSongMapping, metaDataArray]);

    return (
        <>
            <Tabs defaultActiveKey="1" centered>
                <TabPane tab="FEATURED" key="1">
                    <h1 className="featuredTitle">Publish New Album</h1>
                    {isAuthenticated ?
                        <div className="upload">
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                customRequest={(event) => {
                                    const file = event.file;
                                    if (!file) return;
                                    const metadata = { createdById: user.id };
                                    saveFile(file?.name, file, {
                                        onSuccess(result) {
                                            console.log(result)
                                            setImageUrl(result._ipfs)
                                            setLoading(false);
                                        },
                                        type: event.file.type,
                                        metadata,
                                        saveIPFS: true,
                                    })
                                }}
                                beforeUpload={beforeUploadingImage}
                                onChange={handleChange}
                            >
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="avatar"
                                        style={{
                                            width: '100%',
                                        }}
                                    />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                            <div style={{ backgroundColor: 'white' }}>
                                <Dragger {...uploadMusicProps}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">
                                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                        band files
                                    </p>
                                </Dragger>
                            </div>
                            <br />
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button type="primary" block onClick={() => { handlePublish() }}>
                                    Publish
                                </Button>
                            </Space>
                        </div> :
                        <div className="featuredTitle">
                            Please connect ur wallet to use this feature!
                        </div>
                    }
                </TabPane>

            </Tabs>
        </>
    );
};

export default Publish;

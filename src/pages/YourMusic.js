import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Search.css";
import { Tabs } from "antd";
import { useMoralis } from "react-moralis"
import { placeholderImage } from "../config/constants";
import { useAlbumFromDatabase } from "../hooks/useAlbumFromDatabase";


const { TabPane } = Tabs;

const YourMusic = () => {
    const { isAuthenticated, account, isInitialized } = useMoralis()
    const {fetchYourAlbums} = useAlbumFromDatabase()
    const [library, setLibrary] = useState([]);
    

    useEffect(() => {
        if (isInitialized && isAuthenticated && account) {
            fetchYourAlbums(account).then((albums) => {
            setLibrary(albums);
            });
        }
    }, [isInitialized, isAuthenticated, account]);

    return (
        <>

            <Tabs defaultActiveKey="1" centered>
                <TabPane tab="Your Albums" key="1">
                    {isAuthenticated ?
                        <>
                            {library && library.length != 0 ?
                                <div className="albums">
                                    {library.map((e) => (
                                        <Link to="/album" state={e} className="albumSelection">
                                            <img
                                                src={e.image ? e.image : placeholderImage}
                                                alt="bull"
                                                onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage }}
                                                style={{ width: "150px", marginBottom: "10px" }}
                                            ></img>
                                            <p>{e.title}</p>
                                        </Link>
                                    ))}
                                </div>
                                : <div className="featuredTitle">No albums Found!</div>}
                        </>
                        : <div className="featuredTitle">Please Login to use this feature!</div>}
                </TabPane>
            </Tabs>
        </>
    );
};

export default YourMusic;

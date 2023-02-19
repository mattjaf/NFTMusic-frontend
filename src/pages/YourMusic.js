import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Search.css";
import { Tabs } from "antd";
import { useSearch } from "../hooks/useSearch";
import { useMoralis } from "react-moralis"
import { placeholderImage } from "../config/constants";


const { TabPane } = Tabs;

const YourMusic = () => {
    const { searchForAlbums, library, addressArray, setLibrary } = useSearch();
    const { Moralis, chainId, user, isAuthenticated, account, isInitialized } = useMoralis()


    useEffect(() => {
        if (isInitialized && isAuthenticated && account && addressArray) {
            setLibrary(undefined);
            searchForAlbums(account);
        }
    }, [isInitialized, isAuthenticated, account, addressArray]);

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

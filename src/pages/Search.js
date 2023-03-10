import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Search.css";
import { Tabs, Input } from "antd";
import {useSearchFromDatabase} from "../hooks/useSearchFromDatabase"


const { TabPane } = Tabs;

const Search = () => {
    const { Search } = Input;
    const [searchInput, setSearchInput] = useState()
    const searchSongs = useSearchFromDatabase(searchInput)

    return (
        <>

            <Tabs defaultActiveKey="1" centered>
                <TabPane tab="SEARCH" key="1">
                    <h1 className="featuredTitle">
                        <Search style={{ width: "1000px" }} placeholder="Song Name, Album Name, Genre, Artist, Symbol, Year, Song Duration, Publisher Address..." enterButton="Search" size="large"
                            onChange={event => setSearchInput(event.target.value)}
                            onSearch={() => {}} 
                            />
                    </h1>
                    {searchSongs && searchSongs.length != 0 ?
                        <div className="albums">
                            {searchSongs.map((e) => (
                                <Link to="/album" state={e} className="albumSelection">
                                    <img
                                        src={e.image}
                                        alt="bull"
                                        style={{ width: "150px", marginBottom: "10px" }}
                                    ></img>
                                    <p>{e.title}</p>
                                </Link>
                            ))}
                        </div>
                        : <div className="featuredTitle">No search Found!</div>}
                </TabPane>
            </Tabs>
        </>
    );
};

export default Search;

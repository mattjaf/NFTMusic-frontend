import React from 'react';
import { useState } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Album from './pages/Album';
import Publish from "./pages/Publish"
import Search from "./pages/Search"
import YourMusic from "./pages/YourMusic"
import './App.css';
import { Link } from "react-router-dom";
import Player from "./components/AudioPlayer";
import { Layout } from "antd";
import Spotify from "./images/Spotify.png";
import { SearchOutlined, DownCircleOutlined } from "@ant-design/icons";
import { ConnectButton } from "@web3uikit/web3";

const { Content, Sider, Footer } = Layout;

const App = () => {
  let location = useLocation();
  const [nftAlbum, setNftAlbum] = useState();
  return (
    <>
      <Layout>
        <Layout>
          <Sider width={300} className="sideBar">
            <img src={Spotify} alt="Logo" className="logo"></img>
            <Link to="/Search">
              <div className="searchBar" style={location.pathname == "/Search" ? { color: "#1DB954" } : { color: "#FFFFFF" }}>
                <span> Search </span>
                <SearchOutlined style={{ fontSize: "30px" }} />
              </div>
            </Link>
            <Link to="/">
              <p style={location.pathname == "/" ? { color: "#1DB954" } : { color: "#FFFFFF" }}> Home </p>
            </Link>
            <Link to="/YourMusic">
              <p style={location.pathname == "/YourMusic" ? { color: "#1DB954" } : { color: "#FFFFFF" }}> Your Music </p>
            </Link>
            <Link to="/Publish">
              <p style={location.pathname == "/Publish" ? { color: "#1DB954" } : { color: "#FFFFFF" }}> Publish </p>
            </Link>
            <div className="recentPlayed">
              <p className="recentTitle">RECENTLY PLAYED</p>
              <div className="connectButton">
                <ConnectButton />
              </div>
              <div className="install">
                <span> Install App </span>
                <DownCircleOutlined style={{ fontSize: "30px" }} />
              </div>
            </div>
          </Sider>
          <Content className="contentWindow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/album" element={<Album setNftAlbum={setNftAlbum} />} />
              <Route path="/Publish" element={<Publish />} />
              <Route path="/Search" element={<Search />} />
              <Route path="/YourMusic" element={<YourMusic />} />
            </Routes>
          </Content>
        </Layout>
        <Footer className="footer">
          {nftAlbum &&
            <Player
              url={nftAlbum.album}
              songIndex={nftAlbum.songIndex}
            />
          }
        </Footer>
      </Layout>
    </>
  );
}


export default App;

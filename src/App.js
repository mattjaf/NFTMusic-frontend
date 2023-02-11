import React from 'react';
import { useState } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Album from './pages/Album';
import Publish from "./pages/Publish"
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
            <div className="searchBar">
              <span> Search </span>
              <SearchOutlined style={{ fontSize: "30px" }} />
            </div>
            <Link to="/">
              <p style={location.pathname == "/" ? { color: "#1DB954" } : { color: "#FFFFFF" }}> Home </p>
            </Link>
            <p> Your Music </p>
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

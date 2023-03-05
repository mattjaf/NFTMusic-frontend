import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";

export const useAlbumFromDatabase = (contractAddress) => {
  const { Moralis, isInitialized } = useMoralis();
  const [album, setAlbum] = useState();

  const fetchAlbum = async () => {
    const Library = Moralis.Object.extend("Library");
    const Song = Moralis.Object.extend("Song");

    // Query for the Library object with matching contractAddress
    const libraryQuery = new Moralis.Query(Library);
    libraryQuery.equalTo("contractAddress", contractAddress);
    const library = await libraryQuery.first();

    if (!library) {
      return [];
    }

    // Query for all songs related to the matching Library object
    const songQuery = new Moralis.Query(Song);
    songQuery.equalTo("library", library);
    const songs = await songQuery.find();

    const albumData = songs.map((song) => {
      return {
        metadata: song.attributes.metadata,
      };
    });
    setAlbum(albumData)
  };

  const fetchYourAlbums = async (accountAddress) => {
    const Library = Moralis.Object.extend("Library");
    const query = new Moralis.Query(Library);
    query.equalTo("publisher", accountAddress);
    const results = await query.find();
    const uniqueAlbums = [];
  
    results.forEach((album) => {
      const albumName = album.attributes.albumName;
      const albumCover = album.attributes.albumCover;
      const contractAddress = album.attributes.contractAddress;
      if (albumName && albumCover && contractAddress) {
        uniqueAlbums.push({
          title: albumName,
          image: albumCover,
          contract: contractAddress,
        });
      }
    });
    return uniqueAlbums;
  };

  useEffect(() => {
    if ((isInitialized && contractAddress)) {
      fetchAlbum();
    }
  }, [isInitialized, contractAddress]);

  return { album, fetchAlbum, fetchYourAlbums };
};

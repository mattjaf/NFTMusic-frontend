import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";

export const AlbumListFromDataBase = () => {
  const { Moralis, isInitialized } = useMoralis();
  const [library, setLibrary] = useState([]);

  const fetchLibrary = async () => {
    const Library = Moralis.Object.extend("Library");
    const query = new Moralis.Query(Library);
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
    setLibrary(uniqueAlbums);
  };

  useEffect(() => {
    if (isInitialized) {
      fetchLibrary();
    }
  }, [isInitialized]);

  return { library, fetchLibrary };
};

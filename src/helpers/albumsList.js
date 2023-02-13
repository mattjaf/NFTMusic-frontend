import { useState, useEffect } from 'react';
import { useMoralisWeb3Api, useMoralis } from "react-moralis"
import NetworkMapping from "../config/NetworkMapping.json"
import NFTMusicFactoryABI from "../config/NFTMusicFactory.json"

export const AlbumList = () => {
  const NFTMusicFactoryAddress = NetworkMapping["80001"].NFTMusicFactory[0]
  const Web3Api = useMoralisWeb3Api();
  const { isInitialized } = useMoralis();
  const [library, setLibrary] = useState();

  //could pull the data from the database as well? might be faster?? with better sorting options
  async function fetchAllAlbumMetaData() {
    return await Web3Api.native.runContractFunction({
      address: NFTMusicFactoryAddress,
      function_name: 'getAllAlbumMetaData',
      chain: '0x13881',
      params: {
      },
      abi: NFTMusicFactoryABI,
    }).then((result) => result.map((album) => {
      return {
        title: album[0],
        image: album[1],
        contract: album[2]
      }
    }))
  };

  useEffect(() => {
    if (isInitialized && !library) {
      fetchAllAlbumMetaData().then((metadata) => {
        setLibrary(metadata)
      });
    }
  }, [isInitialized]);

  return { fetchAllAlbumMetaData, library };

}


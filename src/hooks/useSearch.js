import { useState, useEffect } from 'react';
import { useMoralisWeb3Api, useMoralis } from "react-moralis"
import NetworkMapping from "../config/NetworkMapping.json"
import NFTMusicFactoryABI from "../config/NFTMusicFactory.json"

export const useSearch = () => {
    const NFTMusicFactoryAddress = NetworkMapping["80001"].NFTMusicFactory[0]
    const Web3Api = useMoralisWeb3Api();
    const { isInitialized } = useMoralis();
    const [searchResult, setSearchResult] = useState();
    const [addressArray, setAddressArray] = useState()
    const [library, setLibrary] = useState()


    //could pull the data from the database as well? might be faster?? with better sorting options
    async function fecthAllContractAddresses() {
        await Web3Api.native.runContractFunction({
            address: NFTMusicFactoryAddress,
            function_name: 'allcontractAddresses',
            chain: '0x13881',
            params: {
            },
            abi: NFTMusicFactoryABI,
        }).then((contractAddresses) => {
            console.log(contractAddresses)
            setAddressArray(contractAddresses)
        })
    };

    const searchNFTs = async (searchInput) => {
        return await Web3Api.token.searchNFTs({
            q: searchInput,
            chain: "0x13881",
            filter: "global",
            addresses: addressArray
        }).then((result) => setSearchResult(result))
    };

    const searchForAlbums = async (searchInput) => {
        await Web3Api.token.searchNFTs({
            q: searchInput,
            chain: "0x13881",
            filter: "global",
            addresses: addressArray
        }).then((response) => setLibrary(response.result.map((album) => {
            if (album.metadata) { // might need some checks
                const metadata = JSON.parse(album.metadata)
                console.log(metadata)
                return {
                    title: metadata.album,
                    image: metadata.image,
                    contract: album.token_address
                }
            }
        })))
    };

    useEffect(() => {
        if (isInitialized && !addressArray) {
            fecthAllContractAddresses()
        }
    }, [isInitialized]);

    useEffect(() => {
        if (isInitialized && searchResult) {
            console.log(searchResult)
        }
    }, [searchResult]);

    useEffect(() => {
        if (isInitialized && library) {
            console.log(library)
        }
    }, [library]);

    return { searchNFTs, searchForAlbums, searchResult, library };

}


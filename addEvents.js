const Moralis = require("moralis/node")
require("dotenv").config()
let chainId = process.env.chainId || 31337
let moralisChainId = chainId == "31337" ? "1337" : chainId
const contractAddress = "0x05550d2A0096cC764A7Ccc81d88b80eaAeBb1B74"

const serverUrl = process.env.REACT_APP_SERVER_URL
const appId = process.env.REACT_APP_ID
const masterKey = process.env.masterKey

async function main() {
    console.log(masterKey)
    await Moralis.start({ serverUrl, appId, masterKey })
    console.log(`Working with contract address ${contractAddress}`)

    let PublishedAlbumOptions = {
        // Moralis understands a local chain is 1337
        chainId: moralisChainId,
        sync_historical: true,
        topic: "PublishedAlbum(address,uint256,string[],string,string,string)",
        address: contractAddress,
        abi: {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "contractAddress",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "contractIndex",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string[]",
                    "name": "songURIs",
                    "type": "string[]"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "albumName",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "symbol",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "albumCover",
                    "type": "string"
                }
            ],
            "name": "PublishedAlbum",
            "type": "event"
        },
        tableName: "PublishedAlbum",
    }

    let BurnAlbumOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        topic: "BurnAlbum(address,uint256)",
        abi: {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "contractAddress",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "contractIndex",
                    "type": "uint256"
                }
            ],
            "name": "BurnAlbum",
            "type": "event"
        },
        tableName: "BurnAlbum",
    }

    let BurnSongOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        topic: "BurnSong(address,uint256,uint256)",
        sync_historical: true,
        abi: {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "contractAddress",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "contractIndex",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "BurnSong",
            "type": "event"
        },
        tableName: "BurnSong",
    }


    const PublishedAlbumResponse = await Moralis.Cloud.run("watchContractEvent", PublishedAlbumOptions, {
        useMasterKey: true,
    })
    const BurnAlbumResponse = await Moralis.Cloud.run("watchContractEvent", BurnAlbumOptions, {
        useMasterKey: true,
    })
    const BurnSongResponse = await Moralis.Cloud.run("watchContractEvent", BurnSongOptions, {
        useMasterKey: true,
    })
    if (PublishedAlbumResponse.success && BurnAlbumResponse.success && BurnSongResponse.success) {
        console.log(`Success! Database Updated with watching events on chainId ${chainId}`)
    } else {
        console.log("Something went wrong...")
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
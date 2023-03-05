//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;

import "./NFTMusicSimple.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMusicFactory is Ownable {
    /** Notes
     * Factory could be set as the owner of the contract
     * Could possibly implement a multicall or/and controller contract
     * Could intialize owner() as tx.origin or GUI renouce
     * Could implement a selfDestruct feature for reported projects
     * Could implement a Admin only modifier
     * Possibly launch a interface contract and make copies of different logic
     */
    //spelled wrong*
    event PublishedAlbum(
        address indexed contractAddress,
        uint256 indexed contractIndex,
        string[] songURIs, //is this a bit much?
        string albumName, //removed indexed
        string symbol,
        string albumCover //couldn't this be extracted from the first NFT's metadata
    );

    event BurnAlbum(
        address indexed contractAddress,
        uint256 indexed contractIndex
    );

    event BurnSong(
        address indexed contractAddress,
        uint256 indexed contractIndex,
        uint256 indexed tokenId
    );

    struct AlbumMetaData {
        string title;
        string albumCover;
        address contractAddress;
    }

    bool public publicMintStatus;
    NFTMusicSimple[] private NFTMusicSimpleArray;
    uint256 albumCounter; //might not need this

    constructor() {
        publicMintStatus = true;
    }

    ////////////////////
    // CORE FUNCTIONS //
    ////////////////////

    function deployNFTMusicSimple(
        string memory _name,
        string memory _symbol,
        string[] memory _songs,
        string memory _albumCover
    ) public {
        require(
            publicMintStatus || owner() == msg.sender,
            "Public mint is closed"
        );
        albumCounter++;
        NFTMusicSimple NFTMusicSimpleContract = new NFTMusicSimple(
            _name,
            _symbol,
            _songs,
            address(this),
            _albumCover
        );
        NFTMusicSimpleArray.push(NFTMusicSimpleContract);
        emit PublishedAblum(
            address(NFTMusicSimpleContract),
            albumCounter,
            _songs, //is this a bit much?
            _name,
            _symbol,
            _albumCover
        );
    }

    function burnAlbum(uint256 _index) public onlyOwner {
        NFTMusicSimpleArray[_index].burnAlbum();
        emit BurnAlbum(address(NFTMusicSimpleArray[_index]), _index);
    }

    function burnSong(uint256 _index, uint256 _tokenId) public onlyOwner {
        NFTMusicSimpleArray[_index].burnSong(_tokenId);
        emit BurnSong(address(NFTMusicSimpleArray[_index]), _index, _tokenId);
    }

    //////////////////////
    // GETTER FUNCTIONS //
    //////////////////////

    function getAlbumMetaDataByIndex(uint256 _index)
        public
        view
        returns (AlbumMetaData memory)
    {
        AlbumMetaData memory metaData;
        (
            metaData.title,
            metaData.albumCover,
            metaData.contractAddress
        ) = NFTMusicSimpleArray[_index].albumMetaData();
        return metaData;
    }

    //these function increase the code size to 26638
    function getAllAlbumMetaData()
        public
        view
        returns (AlbumMetaData[] memory)
    {
        AlbumMetaData[] memory metaDataArray = new AlbumMetaData[](
            totalSupply()
        );
        uint256 counter = 0;
        for (uint256 i = 0; i < totalSupply(); i++) {
            (
                metaDataArray[counter].title,
                metaDataArray[counter].albumCover,
                metaDataArray[counter].contractAddress
            ) = NFTMusicSimpleArray[i].albumMetaData();
            counter++;
        }
        return metaDataArray;
    }

    function whoOwns(uint256 _index) public view returns (address) {
        return NFTMusicSimpleArray[_index].owner();
    }

    function contractAddressByIndex(uint256 _index)
        public
        view
        returns (address)
    {
        return address(NFTMusicSimpleArray[_index]);
    }

    //fix camel case
    function allcontractAddresses() public view returns (address[] memory) {
        address[] memory result = new address[](totalSupply());
        for (uint256 i = 0; i < totalSupply(); i++) {
            result[i] = address(NFTMusicSimpleArray[i]);
        }
        return result;
    }

    function totalSupply() public view returns (uint256) {
        return NFTMusicSimpleArray.length;
    }

    //////////////////////
    // SETTER FUNCTIONS //
    //////////////////////

    function togglePublicMintStatus() public onlyOwner {
        publicMintStatus = !publicMintStatus;
    }
}

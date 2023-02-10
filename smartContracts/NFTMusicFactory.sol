//SPDX-License-Identifier: MIT

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
    bool public publicMintStatus;
    NFTMusicSimple[] private NFTMusicSimpleArray;

    constructor() {
        publicMintStatus = true;
    }

    ////////////////////
    // CORE FUNCTIONS //
    ////////////////////

    function deployNFTMusicSimple(
        string memory _name,
        string memory _symbol,
        string[] memory _songs
    ) public {
        require(
            publicMintStatus || owner() == msg.sender,
            "Public mint is closed"
        );
        NFTMusicSimple NFTMusicSimpleContract = new NFTMusicSimple(
            _name,
            _symbol,
            _songs,
            address(this)
        );
        NFTMusicSimpleArray.push(NFTMusicSimpleContract);
    }

    function burnAlbum(uint256 _index) public onlyOwner {
        NFTMusicSimpleArray[_index].burnAlbum();
    }

    function burnSong(uint256 _index, uint256 _tokenId) public onlyOwner {
        NFTMusicSimpleArray[_index].burnSong(_tokenId);
    }

    //////////////////////
    // GETTER FUNCTIONS //
    //////////////////////

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

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMusicSimple is ERC721, Ownable {
    string albumCover;
    uint256 tokenCounter; // might not need this
    address admin;
    mapping(uint256 => string) tokenIdToSong;

    modifier onlyAdmin() {
        require(msg.sender == admin, "You are not the admin");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        string[] memory _songs,
        address _admin,
        string memory _albumCover
    ) ERC721(_name, _symbol) {
        admin = _admin;
        albumCover = _albumCover;
        if (_songs.length > 0) {
            publishSongArray(_songs);
        }
        _transferOwnership(tx.origin);
    }

    function publishSong(string memory _song) public onlyOwner {
        tokenCounter++;
        tokenIdToSong[tokenCounter] = _song;
        _safeMint(tx.origin, tokenCounter);
    }

    function publishSongArray(string[] memory _songs) public onlyOwner {
        for (uint256 i = 0; _songs.length > i; i++) {
            publishSong(_songs[i]);
        }
    }

    function totalSupply() public view returns (uint256) {
        return tokenCounter;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return tokenIdToSong[_tokenId];
    }

    function albumMetaData()
        public
        view
        returns (
            string memory,
            string memory,
            address
        )
    {
        return (name(), albumCover, address(this));
    }

    function burnSong(uint256 _tokenId) public {
        require(
            msg.sender == admin || ownerOf(_tokenId) == owner(),
            "You are not authorized"
        );
        _burn(_tokenId);
        delete (tokenIdToSong[_tokenId]);
    }

    function burnAlbum() public onlyAdmin {
        selfdestruct(payable(admin));
    }

    function tranferAdminAddress(address _admin) public onlyAdmin {
        admin = _admin;
    }
}

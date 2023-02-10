// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMusicSimple is ERC721, Ownable {
    uint256 tokenCounter;
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
        address _admin
    ) ERC721(_name, _symbol) {
        admin = _admin;
        if (_songs.length > 0) {
            for (uint256 i = 0; _songs.length > i; i++) {
                publishSong(_songs[i]);
            }
        }
        _transferOwnership(tx.origin);
    }

    function publishSong(string memory _song) public onlyOwner {
        tokenCounter++;
        tokenIdToSong[tokenCounter] = _song;
        _safeMint(tx.origin, tokenCounter);
    }

    function publishSongArray(string[] memory _songs) public onlyOwner {
        if (_songs.length > 0) {
            for (uint256 i = 0; _songs.length > i; i++) {
                publishSong(_songs[i]);
            }
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

    function burnSong(uint256 _tokenId) public {
        require(
            msg.sender == admin || msg.sender == owner(),
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

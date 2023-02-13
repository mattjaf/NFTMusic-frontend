// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";

contract NFTMusicOnChain is ERC721, Ownable {
    struct SongMetaData {
        string songName;
        string discription;
        string songURL;
        string duration;
    }

    uint256 tokenCounter;
    address admin;
    string albumCover;
    mapping(uint256 => SongMetaData) tokenIdToSongMetaData;

    modifier onlyAdmin() {
        require(msg.sender == admin, "You are not the admin");
        _;
    }

    constructor(
        //mintAlbum
        string memory _albumName,
        string memory _symbol,
        string[] memory _songURLs,
        string[] memory _songNames,
        string[] memory _durations,
        string memory _albumCover,
        address _admin
    ) ERC721(_albumName, _symbol) {
        admin = _admin;
        albumCover = _albumCover;
        if (_songURLs.length > 0) {
            publishSongArray(_songURLs, _songNames, _durations);
        }
        _transferOwnership(tx.origin);
    }

    function publishSong(
        string memory _songURL,
        string memory _songName,
        string memory _duration
    ) public onlyOwner {
        tokenCounter++;
        tokenIdToSongMetaData[tokenCounter].songName = _songName;
        tokenIdToSongMetaData[tokenCounter].songURL = _songURL;
        tokenIdToSongMetaData[tokenCounter].duration = _duration;
        _safeMint(tx.origin, tokenCounter); // might revise
    }

    function publishSongArray(
        string[] memory _songURLs,
        string[] memory _songNames,
        string[] memory _durations
    ) public onlyOwner {
        for (uint256 i = 0; _songURLs.length > i; i++) {
            publishSong(_songURLs[i], _songNames[i], _durations[i]);
        }
    }

    //////////////////////
    // GETTER FUNCTIONS //
    //////////////////////

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
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                tokenIdToSongMetaData[_tokenId].songName,
                                '", "description":"',
                                "", //
                                '", "attributes":"',
                                "", //
                                '", "image":"',
                                albumCover,
                                '", "animation_url":"',
                                tokenIdToSongMetaData[_tokenId].songURL,
                                '", "duration":"',
                                tokenIdToSongMetaData[_tokenId].duration,
                                '", "artist":"',
                                "", //
                                '", "year":"',
                                "", //
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    /////////////////////
    // ADMIN FUNCTIONS //
    /////////////////////

    function burnSong(uint256 _tokenId) public {
        require(
            msg.sender == admin || ownerOf(_tokenId) == owner(),
            "You are not authorized"
        );
        _burn(_tokenId);
        delete (tokenIdToSongMetaData[_tokenId]);
    }

    function burnAlbum() public onlyAdmin {
        selfdestruct(payable(admin));
    }

    function tranferAdminAddress(address _admin) public onlyAdmin {
        admin = _admin;
    }
}

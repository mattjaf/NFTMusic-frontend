import { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import console from "console-browserify";

export const useSearchFromDatabase = (searchInput) => {
  const [songs, setSongs] = useState([]);
  const { isInitialized, Moralis } = useMoralis();

  useEffect(() => {
    if (isInitialized) {
      const searchSongs = async () => {
        const Song = Moralis.Object.extend('Song');
        const query1 = new Moralis.Query(Song);
        query1.matches('songName', searchInput, 'i');
        const query2 = new Moralis.Query(Song);
        query2.matches('albumName', searchInput, 'i');
        const query3 = new Moralis.Query(Song);
        query3.matches('artist', searchInput, 'i');
        const query4 = new Moralis.Query(Song);
        query4.matches('genre', searchInput, 'i');
        const query5 = new Moralis.Query(Song);
        query5.matches('symbol', searchInput, 'i');
        const query6 = new Moralis.Query(Song);
        query6.matches('year', searchInput, 'i');
        const query7 = new Moralis.Query(Song);
        query7.matches('publisher', searchInput, 'i');
        const query8 = new Moralis.Query(Song);
        query8.matches('contractAddress', searchInput, 'i');
        const query = Moralis.Query.or(
          query1,
          query2,
          query3,
          query4,
          query5,
          query6,
          query7,
          query8
        );
        query.include('library'); // include the library relational class
        const results = await query.find();
        const uniqueResults = new Set(); // create a Set to filter out duplicates
        results.forEach((song) => {
          const title = song.get('albumName');
          const image = song.get('library')?.get('albumCover');
          const contract = song.get('library')?.get('contractAddress');
          uniqueResults.add(JSON.stringify({ image, title, contract }));
        });
        const mappedResults = Array.from(uniqueResults).map((result) =>
          JSON.parse(result)
        );
        console.log(mappedResults);
        setSongs(mappedResults);
      };

      if (searchInput) {
        searchSongs();
      }
    }
  }, [searchInput, isInitialized]);

  return songs;
};
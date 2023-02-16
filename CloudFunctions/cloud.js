const axios = require('axios');

Moralis.Cloud.afterSave("PublishedAblum", async (request) => { // spelled wrong in contract fix on redeployment
    const confirmed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info("Looking for confirmed transaction...");

    if (!confirmed) {
        const Library = Moralis.Object.extend("Library");
        const Song = Moralis.Object.extend("Song");
        const library = new Library();
        const txHash = request.object.get("transactionHash");
        const contractAddress = request.object.get("contractAddress");
        const contractIndex = request.object.get("contractIndex");
        const name = request.object.get("name");
        const symbol = request.object.get("symbol");
        const albumCover = request.object.get("albumCover");
        const songURIs = request.object.get("songURIs");
        const songDataArray = [];

        library.set("transactionHash", txHash);
        library.set("contractAddress", contractAddress);
        library.set("contractIndex", contractIndex);
        library.set("albumName", name);
        library.set("symbol", symbol);
        library.set("albumCover", albumCover);

        logger.info("Saving event data...");
        await library.save();

        logger.info("Extracting metadata...");

        try {
            for (const song of songURIs) {
                const response = await axios.get(song);
                const metadata = response.data;
                logger.info(`metadata: ${metadata}`);
                const songObj = new Song();
                songDataArray.push(metadata);

                songObj.set("albumName", metadata.album);
                songObj.set("songName", name);
                songObj.set("uri", song);
                songObj.set("animation_url", metadata.animation_url);
                songObj.set("publisher", metadata.publisher);
                songObj.set("artist", metadata.artist);
                songObj.set("year", metadata.year);
                songObj.set("title", metadata.name);
                songObj.set("genre", metadata.description);
                songObj.set("duration", metadata.duration);
                songObj.set("symbol", metadata.symbol);
                songObj.set("metadata", metadata);

                songObj.set("library", library); // set up the relationship

                await songObj.save();
            }

            const firstSongMetadata = songDataArray[0];
            library.set("publisher", firstSongMetadata.publisher);
            library.set("artist", firstSongMetadata.artist);
            library.set("year", firstSongMetadata.year);
            library.set("title", firstSongMetadata.name);
            library.set("genre", firstSongMetadata.description);
            library.set("metadata", songDataArray);

            await library.save();
            logger.info("Metadata saved.");

        } catch (error) {
            logger.error(`Error extracting metadata: ${error}`);
        }
    }
});

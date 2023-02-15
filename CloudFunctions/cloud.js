const axios = require('axios');
Moralis.Cloud.afterSave("PublishedAblum", async (request) => { // spelled wrong in contract fix on redeployment
    const confirmed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info("Looking for confirmed transaction...");

    if (confirmed) {
        const Library = Moralis.Object.extend("Library");
        const library = new Library();
        const txHash = request.object.get("transactionHash");
        const contractAddress = request.object.get("contractAddress");
        const contractIndex = request.object.get("contractIndex");
        const songURIs = request.object.get("songURIs");
        const name = request.object.get("name");
        const symbol = request.object.get("symbol");
        const albumCover = request.object.get("albumCover");

        library.set("transactionHash", txHash);
        library.set("contractAddress", contractAddress);
        library.set("contractIndex", contractIndex);
        library.set("songURIs", songURIs);
        library.set("albumName", name);
        library.set("symbol", symbol);
        library.set("albumCover", albumCover);

        logger.info("Saving event data...");
        await library.save();

        logger.info("Extracting metadata...");
        const songDataArray = [];

        try {
            for (const song of songURIs) {
                const response = await axios.get(song);
                const metadata = response.data;
                logger.info(`metadata: ${metadata}`);
                songDataArray.push(metadata);
            }

            library.set("publisher", songDataArray[0].publisher);
            library.set("artist", songDataArray[0].artist);
            library.set("year", songDataArray[0].year);
            library.set("title", songDataArray[0].name);
            library.set("genre", songDataArray[0].description);
            library.set("metadata", songDataArray);

            await library.save();
            logger.info("Metadata saved.");
        } catch (error) {
            logger.error(`Error extracting metadata: ${error}`);
        }
    }
});
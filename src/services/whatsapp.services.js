const fs = require("fs").promises;
const path = require("path");
const config = require("../config/app.config");

/**
 * Downloads and saves a WhatsApp media file to disk.
 *
 * @async
 * @function downloadFile
 * @param {Object} media - The media object from msg.downloadMedia().
 * @returns {Promise<string>} The full path of the saved file.
 */
module.exports.downloadFile = async (media) => {
    try {
        // Validate input
        if (!media || !media.data || !media.mimetype) {
            throw new Error("Invalid media object: missing data or mimetype");
        }

        // Decode base64 data
        const baseToBuffer = Buffer.from(media.data, "base64");

        // Determine folder path (from config or fallback)
        const absolutePath = config.folderPath || path.join(process.cwd(), "downloads");

        // Ensure folder exists
        await fs.mkdir(absolutePath, { recursive: true });

        // Extract file type and name
        const fileType = media.mimetype.split("/")[1] || "bin";
        const filename = media.filename || `media_${Date.now()}.${fileType}`;

        // Full file path
        const fullPath = path.join(absolutePath, filename);

        // Write file
        await fs.writeFile(fullPath, baseToBuffer);

        console.log(`✅ File saved: ${fullPath}`);
        return fullPath;
    } catch (err) {
        console.error("some error when download file")
    }
};

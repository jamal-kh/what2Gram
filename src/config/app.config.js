const {config} = require("dotenv");

config();

module.exports = {
    telegramBotID: process.env.TELEGRAM_TOKEN_BOT,
    telegramUserID: Number(process.env.TELEGRAM_USER_ID),
    folderPath: process.env.FOLDER_PATH.toString() | "",
    mongoUrl: `${process.env.MONGO_DB_URL}` | ""
}
const appConfig = require("../config/app.config");

module.exports.isOwner = (msg) => {

    return msg.from.id === appConfig.telegramUserID
};
const qr = require("qrcode");

module.exports.qrToBuffer = async (qrString)=> qr.toBuffer(qrString);
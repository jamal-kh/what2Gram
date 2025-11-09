const config = require("./config/app.config");

const { Client, LocalAuth } = require("whatsapp-web.js");
const TelegramBot = require("node-telegram-bot-api");
const { qrToBuffer } = require("./lib/generate.qr");
const { downloadFile } = require("./services/whatsapp.services");
const path = require("path");
const { isOwner } = require("./lib/is_owner");


const bot = new TelegramBot(config.telegramBotID, { polling: true });


const whatsappClient = new Client({
    puppeteer: { headless: false },
    authStrategy: new LocalAuth({
        dataPath: path.join(`${process.cwd()}`, "./auth"),
        clientId: this.clientID,
    }),
});



bot.onText("/start", async (msg) => {
    if (!isOwner(msg)) {
        return bot.sendMessage(msg.chat.id, "⛔ You are not authorized to use this bot.");
    }
    const clientID = msg.from.id;
    const clientFirstName = msg.from.first_name;
    const clientLastName = msg.from.last_name
    const welcomeMessage = `Hello Mr/Ms ${clientFirstName} ${clientLastName}, here you can get your WhatsApp messages.`;


    bot.sendMessage(clientID, welcomeMessage);
});

/**
 * In this step, the user sends a login command. 
 * WhatsApp will then generate a QR code in the browser, 
 * which we capture and convert to a Base64 image to send through Telegram. 
 * Once the user scans the QR code, the WhatsApp session is initialized.
 */
bot.onText("/login", (msg) => {
    if (!isOwner(msg)) {
        return bot.sendMessage(msg.chat.id, "⛔ You are not authorized to use this bot.");
    }

    const clientID = msg.from.id;
    const qrLifetime = 15; // seconds before QR is deleted

    whatsappClient.on("qr", async (qr) => {
        const qrBase = await qrToBuffer(qr);
        const messageText = `📱 Scan this QR to login to WhatsApp.\n\n⚠️ This QR will be deleted in ${qrLifetime} seconds!`;

        const currentMessage = await bot.sendPhoto(clientID, qrBase, { caption: messageText })

        setTimeout(async () => {
            await bot.deleteMessage(clientID, currentMessage.message_id);
        }, qrLifetime * 1000)
    })

});


whatsappClient.on("message", async (msg) => {
    const fileType = msg.type;
    // Get sender contact info
    const contact = await msg.getContact();
    const senderName = contact.name || contact.pushname || contact.number;

    // Get chat info (for group or private)
    const chat = await msg.getChat();
    const isGroup = chat.isGroup;
    const chatName = isGroup ? chat.name : senderName;

    const caption = `📩 From: ${senderName}\n💬 Chat: ${chatName}\n\n${msg.body || ""}`;


    try {
        if (msg.hasMedia) {
            const mediaDownload = await msg.downloadMedia()
            const filePath = await downloadFile(mediaDownload)
            if (fileType === "image") {
                await bot.sendPhoto(config.telegramUserID, filePath, { caption });
            } else if (fileType === "video") {
                await bot.sendVideo(config.telegramUserID, filePath, { caption });
            } else if (fileType === "document") {
                await bot.sendDocument(config.telegramUserID, filePath, { caption });
            } else if (fileType === "sticker") {
                await bot.sendSticker(config.telegramUserID, filePath);
            }
        }
    } catch (err) {
        console.log("some error happend: " + err)
    }

    if (msg.type === "chat") {
        bot.sendMessage(config.telegramUserID, msg.body);
    }
})


whatsappClient.initialize();
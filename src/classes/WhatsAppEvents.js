/**
 * @file WhatsAppEvents.js
 * @description Attaches all WhatsApp event handlers (QR, message, ready, disconnect)
 */

const { qrToBuffer } = require("../lib/generate.qr");
const downloadFile = require("../services/whatsapp.services");

class WhatsAppEvents {
  /**
   * @param {import('whatsapp-web.js').Client} client - WhatsApp client instance
   * @param {import('node-telegram-bot-api')} bot - Telegram bot instance
   * @param {number|string} telegramUserID - Telegram user ID
   */
  constructor(client, bot, telegramUserID) {
    this.client = client;
    this.bot = bot;
    this.telegramUserID = telegramUserID;
  }

  /**
   * Registers all WhatsApp events.
   */
  register() {
    this.#onQR();
    this.#onReady();
    this.#onMessage();
    this.#onDisconnected();
  }

  #onQR() {
    const qrLifetime = 15;
    this.client.on("qr", async (qr) => {
      const qrBase = await qrToBuffer(qr);
      const messageText = `📱 Scan this QR to login.\n⚠️ Expires in ${qrLifetime}s.`;

      const sentMsg = await this.bot.sendPhoto(this.telegramUserID, qrBase, {
        caption: messageText,
      });

      setTimeout(async () => {
        try {
          await this.bot.deleteMessage(this.telegramUserID, sentMsg.message_id);
        } catch {
          console.log("⚠️ QR message already expired.");
        }
      }, qrLifetime * 1000);
    });
  }

  #onReady() {
    this.client.on("ready", async () => {
      await this.bot.sendMessage(this.telegramUserID, "✅ WhatsApp connected successfully!");
    });
  }

  #onMessage() {
    this.client.on("message", async (msg) => {
      const fileType = msg.type;
      const contact = await msg.getContact();
      const senderName = contact.name || contact.pushname || contact.number;
      const chat = await msg.getChat();
      const chatName = chat.isGroup ? chat.name : senderName;

      const caption = `📩 From: ${senderName}\n💬 Chat: ${chatName}\n\n${msg.body || ""}`;

      try {
        if (msg.hasMedia) {
          const media = await msg.downloadMedia();
          const filePath = await downloadFile(media);

          switch (fileType) {
            case "image":
              await this.bot.sendPhoto(this.telegramUserID, filePath, { caption });
              break;
            case "video":
              await this.bot.sendVideo(this.telegramUserID, filePath, { caption });
              break;
            case "document":
              await this.bot.sendDocument(this.telegramUserID, filePath, { caption });
              break;
            case "sticker":
              await this.bot.sendSticker(this.telegramUserID, filePath);
              break;
          }
        } else if (msg.type === "chat") {
          await this.bot.sendMessage(this.telegramUserID, caption);
        }
      } catch (err) {
        console.error("❌ Message forwarding failed:", err);
      }
    });
  }

  #onDisconnected() {
    this.client.on("disconnected", async () => {
      await this.bot.sendMessage(this.telegramUserID, "⚠️ WhatsApp disconnected. Please /login again.");
    });
  }
}

module.exports = WhatsAppEvents;

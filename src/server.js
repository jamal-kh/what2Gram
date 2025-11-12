/**
 * @file index.js
 * @description Entry point — initializes bot and manages commands.
 */

const TelegramBot = require("node-telegram-bot-api");
const SessionStore = require("./classes/SessionStore");
const WhatsAppSession = require("./classes/WhatsAppSession");
const { isOwner } = require("./lib/is_owner");
const config = require("./config/app.config");

(async () => {
  const bot = new TelegramBot(config.telegramBotID, { polling: true });

  // Initialize Mongo store
  const sessionStore = new SessionStore("mongodb://localhost:27017/what2gram");
  await sessionStore.init();

  // Initialize session manager
  const whatsappSession = new WhatsAppSession(sessionStore, bot);

  bot.onText(/\/start/, async (msg) => {
    if (!isOwner(msg)) return bot.sendMessage(msg.chat.id, "⛔ Not authorized.");
    bot.sendMessage(msg.chat.id, "👋 Welcome! Use /login to connect your WhatsApp.");
  });

  bot.onText(/\/login/, async (msg) => {
    if (!isOwner(msg)) return bot.sendMessage(msg.chat.id, "⛔ Not authorized.");
    await whatsappSession.create(msg.from.id);
  });
})();

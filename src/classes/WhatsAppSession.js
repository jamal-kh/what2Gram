/**
 * @file WhatsAppSession.js
 * @description Handles creation and management of WhatsApp clients.
 */

const { Client, RemoteAuth } = require("whatsapp-web.js");
const WhatsAppEvents = require("./WhatsAppEvents");

class WhatsAppSession {
  /**
   * @param {import('./SessionStore')} store - SessionStore instance
   * @param {import('node-telegram-bot-api')} bot - Telegram bot
   */
  constructor(store, bot) {
    this.store = store;
    this.bot = bot;
    this.sessions = new Map(); // key: telegramUserID, value: Client
  }

  /**
   * Creates a new WhatsApp session or returns an existing one.
   * @param {string|number} telegramUserID - Unique Telegram user ID
   * @returns {Promise<Client>}
   */
  async create(telegramUserID) {
    if (this.sessions.has(telegramUserID)) {
      console.log(`♻️ Using existing session for ${telegramUserID}`);
      return this.sessions.get(telegramUserID);
    }

    const client = new Client({
      authStrategy: new RemoteAuth({
        store: this.store.getStore(),
        clientId: String(telegramUserID),
        backupSyncIntervalMs: 300000,
      }),
      puppeteer: { headless: false },
    });

    // Attach all event handlers
    const eventHandler = new WhatsAppEvents(client, this.bot, telegramUserID);
    eventHandler.register();

    await client.initialize();
    this.sessions.set(telegramUserID, client);

    console.log(`✅ New WhatsApp session created for ${telegramUserID}`);
    return client;
  }
}

module.exports = WhatsAppSession;

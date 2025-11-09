# 📱 WhatsApp → Telegram Bridge Bot

This Node.js project connects your **WhatsApp account** to your **Telegram bot** — allowing you to **receive and view your WhatsApp messages (text, images, videos, documents, stickers, etc.) directly in Telegram**.

---

## 🚀 Features

✅ Login to WhatsApp using QR code (sent to Telegram)
✅ Automatically forward all incoming WhatsApp messages to Telegram
✅ Support for all media types: text, image, video, document, and sticker
✅ Secure authentication using `whatsapp-web.js` with local session storage
✅ Telegram command interface (`/start`, `/login`)
✅ Automatic QR deletion after a short time for security

---

## 🧩 Tech Stack

* **Node.js**
* **whatsapp-web.js** — WhatsApp Web API library
* **node-telegram-bot-api** — Telegram Bot API
* **puppeteer** — headless browser automation
* **LocalAuth** — persistent WhatsApp session storage
* **path, fs** — for local file handling

---

## 📁 Project Structure

```
📦 project/
├── config/
│   └── app.config.js           # Contains Telegram bot ID and user config
├── lib/
│   ├── generate.qr.js          # Converts QR text into image buffer
│   └── is_owner.js             # Checks if Telegram user is authorized
├── services/
│   └── whatsapp.services.js    # Handles WhatsApp media downloads
├── auth/                       # Stores WhatsApp session data (auto-created)
├── index.js                    # Main entry file (this script)
└── package.json
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/whatsapp-telegram-bot.git
cd whatsapp-telegram-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a file at `config/app.config.js` with the following:

```js
module.exports = {
  telegramBotID: "YOUR_TELEGRAM_BOT_TOKEN",
  telegramUserID: "YOUR_TELEGRAM_USER_ID"
}
```

* You can get your **bot token** from [@BotFather](https://t.me/BotFather) on Telegram.
* To find your **user ID**, use [@userinfobot](https://t.me/userinfobot).

---

## 🔑 Commands

| Command  | Description                                     |
| -------- | ----------------------------------------------- |
| `/start` | Starts the bot and checks user authorization    |
| `/login` | Sends a QR code to Telegram to connect WhatsApp |

---

## 🖼️ How It Works

1. Run the bot:

   ```bash
   node index.js
   ```
2. Go to your **Telegram bot chat**.
3. Send `/start` → you’ll receive a greeting message.
4. Send `/login` → a QR code appears in Telegram.
5. Scan it with your **WhatsApp mobile app** (Link Device).
6. Once linked, all your WhatsApp messages will start appearing in Telegram.

---

## 📦 Example

**WhatsApp Message → Telegram Output**

| WhatsApp Type | Telegram Output |
| ------------- | --------------- |
| Text          | Text Message    |
| Image         | Photo           |
| Video         | Video File      |
| Document      | File Upload     |
| Sticker       | Sticker         |

---

## 🔐 Security Notes

* Only authorized Telegram users (checked via `is_owner.js`) can access the bot.
* QR codes expire and are deleted automatically after a few seconds.
* WhatsApp session data is stored locally under `/auth`.

---

## 🧠 Future Improvements

* Multi-user WhatsApp session support
* Two-way message synchronization
* Cloud storage integration for media

---

## 🧑‍💻 Author

**Jamalaldeen Khalil**
🔗 GitHub: [@yourusername](https://github.com/yourusername)
💬 Telegram: [@yourtelegramhandle](https://t.me/yourtelegramhandle)

---

## 🪪 License

MIT License © 2025 — Feel free to use and modify with credit.

---

Would you like me to generate this as a downloadable `.md` file for you (so you can directly upload it to GitHub)?  
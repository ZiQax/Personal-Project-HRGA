// services/hrgaService/notificationService.js
import axios from "axios";

/**
 * Mengirim notifikasi ke Telegram
 * @param {string} message - Isi pesan notifikasi
 */
export const sendNotification = async (message) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    await axios.post(url, {
      chat_id: chatId,
      text: message,
    });

    if(chatId && token === undefined){
      throw new Error("Telegram bot token atau chat ID tidak ditemukan di environment variables.");
    }

    console.log("✅ Notifikasi terkirim:", message);
  } catch (err) {
    console.error("❌ Gagal mengirim notifikasi:", err.message);
  }
};

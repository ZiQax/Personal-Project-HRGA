import axios from "axios";
import { SendNotification } from "../hrga/notificationService.js";
import { act } from "react";


/** * Mengirim notifikasi izin ke Telegram
 * @param {Object} izinData - Data izin karyawan
 * @param {string} izinData.nama - Nama karyawan
 * @param {string} izinData.tanggal - Tanggal izin
 * @param {string} izinData.alasan - Alasan izin
 */

export const handlePermitNotificaton = async (izinData) => {
     try{
        await SendNotification(`📢 Notifikasi Izin Karyawan\n\nNama: ${izinData.nama}\nTanggal: ${izinData.tanggal}\nAlasan: ${izinData.alasan}`);

        await axios.post('http://localhost:3000/hrga/izin/notif', {
            action: 'izin_submitted',
            data: izinData.nama,
            time: new Date().toISOString()
        });

        console.log("✅ Notifikasi izin terkirim.");
        } catch (err) {
            console.error("❌ Gagal mengirim notifikasi izin:", err.message);
        }
     };

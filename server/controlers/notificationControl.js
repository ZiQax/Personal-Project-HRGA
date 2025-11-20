const { getIo } = require('../config/koneksiWebSocket');
let notifications = []; // Menyimpan array notifikasi

// Fungsi untuk menambahkan notifikasi baru
function addNotification(message) {
    const newNotification = {
        id: notifications.length + 1,
        message: message,
        read: false // Notifikasi baru dimulai dengan 'read' sebagai false
    };
    notifications.push(newNotification);  // Menambahkan notifikasi ke array
}

// Fungsi untuk menandai notifikasi sebagai dibaca
function markAsRead(id) {
    const notification = notifications.find(notification => notification.id === id);
    if (notification) {
        notification.read = true; // Menandai notifikasi sebagai dibaca
    }
}

// Fungsi untuk mengirimkan jumlah notifikasi yang belum dibaca ke frontend
function getNotification() {
    const newNotificationCount = notifications.filter(notification => !notification.read).length;

    const io = getIo();

    if (io) {
        io.emit('notification', { newNotificationCount });  // Mengirimkan jumlah notifikasi ke frontend
    } else {
        console.log('Socket.IO not initialized');
    }
}

module.exports = { addNotification, getNotification, markAsRead };

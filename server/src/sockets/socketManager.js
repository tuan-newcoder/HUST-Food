let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    // Client registers their userId to join user-specific private room
    socket.on('register_user', (data) => {
      if (data && data.userId) {
        const roomName = `user_${data.userId}`;
        socket.join(roomName);
        console.log(`[Socket] User ${data.userId} joined room ${roomName}`);
      }
    });

    socket.on('disconnect', () => {
      // Clean up if needed
    });
  });
};

const getIO = () => ioInstance;

const sendNotificationToUser = (recipientId, notificationData) => {
  if (ioInstance) {
    const roomName = `user_${recipientId}`;
    ioInstance.to(roomName).emit('new_notification', notificationData);
  }
};

module.exports = {
  initSocket,
  getIO,
  sendNotificationToUser,
};

const io = require('socket.io')(8000, {
    cors: {
        origin: "http://127.0.0.1:5500",  // Adjust as needed
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', (socket) => {
    // Handle new user joining
    socket.on('New-user-joined', (userName) => {
        users[socket.id] = userName;
        socket.broadcast.emit('user-joined', userName);
    });

    // Handle message sending
    socket.on('send', (message) => {
        socket.broadcast.emit('receive', {
            message: message,
            userName: users[socket.id]
        });
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
        const userName = users[socket.id];
        if (userName) {
            socket.broadcast.emit('left', userName);  // Emit 'left' event
            delete users[socket.id];
        }
    });
});

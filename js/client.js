const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
var audio = new Audio('ting.mp3');

// Helper function to append messages to the chat container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }

};

// Form submission listener to send messages
form.addEventListener('submit', (e) => {  
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');  // Show your message on the right
    socket.emit('send', message);  // Send message to the server
    messageInput.value = '';  // Clear input field
});

// Prompt the user to enter their name
const userName = prompt("Enter your name to join");
socket.emit('New-user-joined', userName);  // Notify server of new user

// Listen for 'user-joined' events from the server
socket.on('user-joined', (userName) => {
    append(`${userName} joined the chat`, 'right');  // Display join message
});

// Listen for 'receive' events to display incoming messages
socket.on('receive', (data) => {
    append(`${data.userName}: ${data.message}`, 'left');  // Show received message on the left
});

// Listen for 'left' events when a user leaves
socket.on('left', (name) => {
    append(`${name} left the chat`, 'right');  // Use 'name' instead of 'userName'
});

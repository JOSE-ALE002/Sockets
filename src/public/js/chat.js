$(document).ready(function () {    
    const socket = io();

    // DOM ELEMENTS
    let message = document.getElementById("message");
    let username = document.getElementById("username");
    let btnSend = document.getElementById("send");
    let output = document.getElementById("output");
    let actions = document.getElementById("actions");

    btnSend.addEventListener("click", function () {    
        socket.emit('chat:message', {
            username: username.value,
            message: message.value
        });     
    });

    message.addEventListener("keypress", function () {

        // Mandamos datos al servidor
        socket.emit("user:typing", username.value);
        console.log("click");        
    });

    // Recibimos o escuchamos datos enviados por el servidor
    socket.on('chat:message', function (data) {
        actions.innerHTML = ''; 

        output.innerHTML += `
        <p><strong>${data.username}</strong>: ${data.message}</p>            
        `;
    });

    socket.on('user:typing', function (user) {
        actions.innerHTML = `
        <p><em>${user}</em>: esta escribiendo ...</p>            
        `;     

        console.log(user);
    });
});
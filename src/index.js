const express = require('express');
const app = express();
const morgan = require("morgan");
const SocketIO = require('socket.io');
const path = require('path');
require('dotenv').config();

// Server configurations
app.set("port", process.env.PORT || 3000);

// Middleawares
app.use(express.static(path.join(__dirname, "public")))
app.use(morgan("dev"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Routes
app.use(require("./routes/index.routes"));


const server = app.listen(app.get("port"), () => {
    console.log("Server on port", app.get("port"));
})

// SocketIO Configurations

// Se le pasa de parametro un servidor inicializado en este caso la variable app que tiene toda la configuracion del server, despues de ejecutar su metodo listen();
// Guardamos en una variable desdepues de la ejecucion y le pasamos esa variable al metodo listen() del Socket

const io = SocketIO(server);

// Evento que se ejecuta cuaando hay una nueva conecion o un nuevo usuario conectado
io.on('connection', (socket) => {
    console.log("New connection", socket.id);

    // Evento que se ejecuta para recibir los datos provenientes del fronted
    socket.on('chat:message', (data) => {

        // Evento para enviar DATOS a la vista ("A TODOS LOS USUARIOS, HASTA EL MISMO USUARIO QUE LOS DATOS")
        // Reenviamos el dato a todos los usuarios o sockets conectados
        io.sockets.emit('chat:message', data);
    });
    
    socket.on("user:typing", (user) => {
        // Evento para enviar DATOS a la vista ("A TODOS LOS USUARIOS, MENOS AL USUARIO QUE ENVIO LOS DATOS")        
        socket.broadcast.emit('user:typing', user);
    });
});
const express=require('express');

const http=require('http');
const {Server}=require('socket.io');

const app=express();

//ejs view from ./views folder
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//server static files from ./public folder
app.use(express.static(__dirname + '/public'));

//routes
app.get('/',(req,res)=>{
    res.render('index');
});

const server=http.createServer(app);
const io=new Server(server);

io.on('connection',(socket)=>{
    console.log("User connected", socket.id);

    socket.on("join",(username)=>{
        socket.username=username;
        io.emit("user joined", `${username} joined the chat`);
    });

    socket.on("chat message",(msg)=>{
        io.emit("chat message", {username: socket.username, message: msg});
    });

    socket.on("disconnect",()=>{
        console.log("User disconnected!", socket.id);
        if(socket.username){
            io.emit("user left", `${socket.username} has left the chat`);
        }
    });

}); 

server.listen(3000,()=>{
    console.log("listening on port 3000");
})








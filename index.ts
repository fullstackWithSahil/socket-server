import { Server, Socket } from "socket.io";
import http from 'http';
import axios from "axios";
const server = http.createServer();
const io = new Server(server,{
    cors: {
		origin:"*",
	},
});

const bannedUsers:any = {};
const adminUsers:any ={};

io.on("connection", (socket: Socket): void => {
	console.log("a user connected");

	socket.on("joinRoom", (chat) => {
		socket.join(chat.chat);
		if(!bannedUsers[chat.teacher]){
			axios.get(
				`${process.env.WORKER_URL}/public/user/banned/teacher/${chat.teacher}`
			).then(({data})=>{
				const users = data.data.map((user:{userId:string})=>user.userId);
				bannedUsers[chat.teacher] = users;
			});
		}
		if(!adminUsers[chat.teacher]){
			axios.get(
				`${process.env.WORKER_URL}/public/user/admin/teacher/${chat.teacher}`,
			).then(({data})=>{
				const users = data.data.map((user:{id:string})=>user.id);
				adminUsers[chat.teacher] = users;
			});
		}
	});

	socket.on("addReaction",(reaction)=>{
		io.to(reaction.chatId).emit("sendReaction",reaction);
	})

	socket.on("sendMessage", (message) => {
		if(
			bannedUsers[message.teacher] && 
			bannedUsers[message.teacher].includes(message.senderId)
		){
			return;
		}
		io.to(message.chatId).emit("receiveMessage", message);
	});
	
	socket.on("editMessage", (message) => {
		io.to(message.chatId).emit("receiveEditMessage", message);
	});

	socket.on("deleteMessage", (message) => {
		io.to(message.chatId).emit("receiveDeleteMessage", message.id);
	});

    socket.on("leaveRoom", (chat) => {
        socket.leave(chat);
    });
});

io.listen(8080);
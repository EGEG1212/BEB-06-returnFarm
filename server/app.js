<<<<<<< HEAD
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

// 서버 4000, 클라이언트 3000
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express());
app.use(cors());

// 서버 생성
const webServer = createServer(app);
// 서버 - 소켓 연결
const io = new Server(webServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

webServer.listen(PORT, () => console.log(` Server is running on ${PORT}`));

// * ------------ socket ------------ *

let users = [];
let messages = [];

// socket.이벤트 - client 전송
// io.이벤트 - server 전송

// socket.on("connection", (data) => {
//   console.log(data);
//   console.log(`${socket.id} user just connected!`);
//   io.on("connection");
// });

io.on("connection", (socket) => {
  // 소켓 연결 알림
  console.log(`${socket.id} user just connected!`);
  //Listens when a new user joins the server
  socket.on("newUser", (data) => {
    // users.push(data.userData.id); 스토리지 사용
    // io.emit("newUserResponse", users);

    users.push(data);
    io.emit("newUserResponse", users);
  });

  socket.on("message", (data) => {
    io.emit("messageResponse", data);
  });

  // 소켓 연결 해제
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    users = users.filter((user) => user.socketID !== socket.id);
    // 유저 이탈 시 채팅 참가 목록에서 제외 코드 작성하기
    io.emit("newUserResponse", users);
    socket.disconnect();
  });
=======
import dotenv from "dotenv";
// dotenv.config() 내에 아무것도 명시해주지 않으면 루트에 있는 .env 파일을 찾아 적용한다.
dotenv.config();
import express from "express";
import cors from "cors";
import { sequelize } from "./models/index";
const app = express();
const port = process.env.SERVER_PORT || 4000;

app.use(cors());

sequelize
  .sync({ force: false }) //기존데이터유지
  .then(() => {
    console.log("데이터 베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = app.listen(port, () => {
  console.log("Listening ....port", port);
>>>>>>> solo
});

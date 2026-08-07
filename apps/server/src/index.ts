import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import apiRouter from "./routes";

const app = express();
const httpServer = createServer(app);

const clientUrl = process.env.CLIENT_URL || "https://taskflow-flax-psi.vercel.app/";
const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const io = new Server(httpServer, {
  cors: corsOptions,
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({ strict: false }));
app.use(cookieParser());
app.use(apiRouter);

app.use((err: any, req: any, res: any, next: any) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  return res.status(err?.status || 500).json({ error: err?.message || "Internal server error" });
});

io.of("/board").on("connection", (socket) => {
  socket.on("join", (boardId) => {
    socket.join(`board:${boardId}`);
  });
  socket.on("leave", (boardId) => {
    socket.leave(`board:${boardId}`);
  });
});

const port = Number(process.env.PORT || 4000);
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

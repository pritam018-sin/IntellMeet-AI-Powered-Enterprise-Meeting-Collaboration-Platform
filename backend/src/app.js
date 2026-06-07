
import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(helmet());
app.use(morgan("dev"));

app.use(express.json({ limit: '30kb' }));
app.use(express.urlencoded({ extended: true, limit: '30kb' }));
app.use(express.static("public"));
app.use(cookieParser());

import rateLimit from "express-rate-limit";

// Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
});
app.use(limiter);

//Routes
import userRoutes from "./routes/user.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/meetings", meetingRoutes);

export default app;
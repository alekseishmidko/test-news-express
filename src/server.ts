import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import connectDB from "./db/db-connect";
// import newsRoutes from "./routes/news";

dotenv.config();

const app = express();

connectDB();
const clientUrl = process.env.CLIENT_URL;
if (!clientUrl) {
  throw new Error("clientUrl required");
}
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

app.use("/api/auth", authRoutes);
// app.use("/api/news", newsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

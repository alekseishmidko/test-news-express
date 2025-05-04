import express, { Request, Response } from "express";
import News from "../models/News";

import multer from "multer";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// Настройка загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Создание новости
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const { title, content, publishDate } = req.body;

    try {
      const news = new News({
        title,
        content,
        author: req.user?.id,
        publishDate: publishDate || Date.now(),
        image: req.file?.path, // Путь к загруженному изображению
      });

      await news.save();
      res.json(news);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Реализация других CRUD операций (редактирование, удаление, публикация)

// Настройка real-time уведомлений
// Пример использования socket.io для уведомлений при создании/редактировании/удалении новости
router.post(
  "/:id/publish",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const news = await News.findById(req.params.id);

      if (!news) {
        return res.status(404).json({ msg: "News not found" });
      }

      if (news.author.toString() !== req.user?.id) {
        return res.status(403).json({ msg: "Not authorized" });
      }

      news.isPublished = true;
      news.publishDate = new Date();

      await news.save();

      const io = req.app.get("io");
      io.emit("news-updated", news);

      res.json(news);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

export default router;

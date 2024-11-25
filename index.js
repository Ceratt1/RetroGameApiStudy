import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Configurar __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.listen(3000, () => {
    console.log("ouvindo na porta 3000");
});

app.get("/", (req, res) => {
    const imagePath = path.join(__dirname, "img1.jpeg");
    res.sendFile(imagePath);
});

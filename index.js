import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const convertImageToMatrix = async (imagePath) => {
    const { data, info } = await sharp(imagePath)
        .resize({ width: 128, height: 64 }) // Ajuste ao tamanho do LCD
        .raw() // Retorna dados brutos (sem cabeçalhos de arquivo)
        .toBuffer({ resolveWithObject: true });

    return { data, width: info.width, height: info.height };
};

// Criar aplicação Express
const app = express();

app.listen(3000, () => {
    console.log("ouvindo na porta 3000");
});

app.get("/", async (req, res) => {
    try {
        const imagePath = path.join(__dirname, "img1.jpeg");
        
        const { data, width, height } = await convertImageToMatrix(imagePath);

        const outputFilePath = path.join(__dirname, "output.bin");
        fs.writeFileSync(outputFilePath, data);
        
        console.log(`Imagem convertida para ${width}x${height}`);
        
        res.status(200).send(data);
    } catch (error) {
        console.error("Erro ao processar a imagem:", error);
        res.status(500).send("Erro ao processar a imagem.");
    }
});

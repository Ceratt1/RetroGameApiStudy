import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

// Configurar __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para converter imagem para matriz de pixels
const convertImageToMatrix = async (imagePath) => {
    const { data, info } = await sharp(imagePath)
        .resize({ width: 128, height: 64 }) // Ajuste ao tamanho do LCD
        .raw() // Retorna dados brutos (sem cabeçalhos de arquivo)
        .toBuffer({ resolveWithObject: true });

    return { data, width: info.width, height: info.height };
};

// Função para gerar a matriz como string HTML
const generateHtmlMatrix = (data, width, height) => {
    let html = "<!DOCTYPE html><html><head><title>Matriz</title><style>";
    html += "body { font-family: monospace; line-height: 1; } .row { white-space: nowrap; }</style></head><body>";

    for (let y = 0; y < height; y++) {
        html += '<div class="row">';
        for (let x = 0; x < width; x++) {
            // Cada pixel tem 3 valores RGB, simplificando para escala de cinza
            const offset = (y * width + x) * 3;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const grayscale = (r + g + b) / 3;

            // Mapeando escala de cinza para caracteres
            html += grayscale < 128 ? "#" : ".";
        }
        html += "</div>";
    }

    html += "</body></html>";
    return html;
};

// Criar aplicação Express
const app = express();

app.listen(3000, () => {
    console.log("ouvindo na porta 3000");
});

app.get("/", async (req, res) => {
    try {
        const imagePath = path.join(__dirname, "img1.jpeg");
        
        // Converter imagem
        const { data, width, height } = await convertImageToMatrix(imagePath);

        // Gerar e enviar HTML da matriz
        const htmlMatrix = generateHtmlMatrix(data, width, height);
        res.status(200).send(htmlMatrix);
    } catch (error) {
        console.error("Erro ao processar a imagem:", error);
        res.status(500).send("Erro ao processar a imagem.");
    }
});

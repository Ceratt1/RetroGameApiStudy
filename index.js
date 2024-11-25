import express from "express";
import fs from "fs";
import path from "path";

// Usar import.meta.url para definir __dirname em ES Modules
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const jsonFilePath = path.join(__dirname, "messages.json");

app.listen(3000, () => {
    console.log("ouvindo na porta 3000");
});

app.get("/", (req, res) => {
    res.send("hello!");
});

app.post("/", (req, res) => {
    const getMessage = req.body.message;
    
    // Criar o objeto para salvar
    const newMessage = { message: getMessage, timestamp: new Date() };

    // Função para salvar a mensagem no arquivo JSON
    const saveMessageToFile = () => {
        // Verificar se o arquivo já existe
        fs.readFile(jsonFilePath, "utf8", (err, data) => {
            let messages = [];

            // Se o arquivo já existe, adiciona a nova mensagem ao arquivo existente
            if (!err && data) {
                messages = JSON.parse(data);
            }

            // Adiciona a nova mensagem à lista
            messages.push(newMessage);

            // Salva o novo conteúdo no arquivo JSON
            fs.writeFile(jsonFilePath, JSON.stringify(messages, null, 2), "utf8", (err) => {
                if (err) {
                    console.error("Erro ao salvar mensagem:", err);
                    return res.status(500).send("Erro ao salvar mensagem.");
                }
                return res.send(`Mensagem recebida e salva: ${getMessage}`);
            });
        });
    };

    // Chama a função para salvar
    saveMessageToFile();
});

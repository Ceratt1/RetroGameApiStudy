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

app.get("/:message", (req, res) => {
    const getMessage = req.params.message; // Obtendo a mensagem via parâmetro de URL
    
    const newMessage = { message: getMessage, timestamp: new Date() };

    const saveMessageToFile = () => {
        // Tenta ler o arquivo JSON
        fs.readFile(jsonFilePath, "utf8", (err, data) => {
            let messages = [];

            // Se o arquivo existe e contém dados, fazer o parse e adicionar a nova mensagem
            if (!err && data) {
                try {
                    messages = JSON.parse(data);
                } catch (parseError) {
                    console.error("Erro ao analisar o arquivo JSON:", parseError);
                }
            }

            // Adiciona a nova mensagem à lista
            messages.push(newMessage);

            // Escreve as mensagens atualizadas de volta no arquivo JSON
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


app.get("/", (req, res) => {
    // Lê o arquivo JSON com as mensagens
    fs.readFile(jsonFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Erro ao ler o arquivo.");
        }

        let messages = [];

        try {
            messages = JSON.parse(data);
        } catch (parseError) {
            return res.status(500).send("Erro ao processar os dados.");
        }

        // Adiciona hora e minuto à cada mensagem
        const messagesWithTime = messages.map((msg) => {
            const timestamp = new Date(msg.timestamp);
            const hours = timestamp.getHours().toString().padStart(2, "0");
            const minutes = timestamp.getMinutes().toString().padStart(2, "0");

            return {
                message: msg.message,
                time: `${hours}:${minutes}`,
            };
        });

        // Construa o HTML para mostrar as mensagens
        let html = "<!DOCTYPE html><html><head><title>Mensagens</title></head><body>";
        html += "<h1>Mensagens com Hora e Minuto</h1>";
        html += "<ul>";

        // Exibe todas as mensagens com hora e minuto
        messagesWithTime.forEach((msg) => {
            html += `<li>${msg.message} - ${msg.time}</li>`;
        });

        html += "</ul></body></html>";

        // Envia o HTML para o cliente
        res.send(html);
    });
});

app.get("/receber/messages", (req, res) => {
    fs.readFile(jsonFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Erro ao ler o arquivo.");
        } else {
            return res.send(data);
        }
    });
});
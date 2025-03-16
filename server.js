const express = require("express");
const axios = require("axios");
const { Parser } = require("m3u8-parser");

const app = express();
app.use(express.static("public"));

app.get("/api/canales", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send("Falta la URL");

    try {
        const { data } = await axios.get(url);
        const parser = new Parser();
        parser.push(data);
        parser.end();
        const canales = parser.manifest.segments.map(seg => ({
            titulo: seg.title || "Canal sin nombre",
            url: seg.uri,
        }));
        res.json(canales);
    } catch (err) {
        res.status(500).send("Error al obtener la lista");
    }
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));

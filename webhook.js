const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
const fs = require("fs"); // untuk membaca file sertifikat
const https = require("https"); // Modul HTTPS
require("dotenv").config();

const app = express().use(body_parser.json());

const mytoken = process.env.WEBHOOK_VERIFY_TOKEN;
const token = process.env.WHATSAPP_TOKEN;

const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.crt"),
};

const server = https.createServer(options, app);

app.listen(8000 || process.env.PORT, () => {
  console.log("Webhook Is Listening");
});

// untuk verifikasi callback url dari sisi dashboard - cloup api side
app.get("/webhook", (req, res) => {
  res.send("Ini adalah endpoint GET untuk webhook");

  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  //   const mytoken =
  //     "EAAHSEn4v16IBOzlPYsFEjLiBIfvQfSf5VIrRJ6ZAW4brZAFRoFK18m5esaUNSgvNUS1NqUv6RJczUhUZCyVPrb4f1nTiux48KjcBCOfGwIHysEFfhDWZAfNci2xfL6W0pbtZB1uCRTUXXXSklnaMefvdbfwcPmZCleiiv5367e1HRXtW4JZAUQuNH5ZB1masL96GvoGRX9rGJ2ctAZBh1GClZBSTcaJHIZD";

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.WHATSAPP_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.status(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  let body_param = req.body;
  console.log(JSON.stringify(body_param, null, 2));
  if (body_param.object) {
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0].from
    ) {
      let phon_nod_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

      axios({
        method: "POST",
        url:
          "https://graph.facebook.com/v21.0/" +
          phon_nod_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "Hi, Im Imanuel Tito",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      res.sendStatus(200);
    } else {
      res.sendStatus(404); // Not found
    }
  } else {
    res.sendStatus(400); //Bad Request
  }
});

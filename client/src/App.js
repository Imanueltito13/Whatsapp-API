require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function sendTemplateMessage() {
  const response = await axios({
    url: `https://graph.facebook.com/${process.env.API_VERSION}/${process.env.BUSINESS_PHONE_NUMBER_ID}/messages`,
    method: "POST",
    headers: {
      Authorization: " Bearer " + process.env.WHATSAPP_TOKEN,
      "Content-Type": "application/json",
    },

    data: JSON.stringify({
      messaging_product: "whatsapp",
      to: process.env.RECIPIENT_NUMBER,
      type: "template",
      template: {
        name: "reborn",
        language: {
          code: "en_US",
        },
      },
    }),
  });

  console.log(response.data);
}

async function sendTextMessage() {
  const response = await axios({
    url: "https://graph.facebook.com/v21.0/382607701608638/messages",
    method: "POST",
    headers: {
      Authorization: " Bearer " + process.env.WHATSAPP_TOKEN,
      "Content-Type": "application/json",
    },

    data: JSON.stringify({
      messaging_product: "whatsapp",
      to: process.env.RECIPIENT_NUMBER,
      type: "text",
      text: {
        body: "apakah ingin upgrade ke premium plan kak?",
      },
    }),
  });

  console.log(response.data);
}

async function sendImageMessage() {
  const response = await axios({
    url: "https://graph.facebook.com/v21.0/382607701608638/messages",
    method: "POST",
    headers: {
      Authorization: " Bearer " + process.env.WHATSAPP_TOKEN,
      "Content-Type": "application/json",
    },

    data: JSON.stringify({
      messaging_product: "whatsapp",
      to: process.env.RECIPIENT_NUMBER,
      type: "image",
      image: {
        // link: "https://dummyimage.com/600x400/000/fff&text=halo,+imanuel+tito!",
        id: "1113163957209716",
        caption: "This is a media message",
      },
    }),
  });

  console.log(response.data);
}

async function uploadImage() {
  const data = new FormData();
  data.append("messaging_product", "whatsapp");
  data.append("file", fs.createReadStream(process.cwd() + "/reborn_logo.png"), {
    contentType: "image/png",
  });

  data.append("type", "image/png");

  const response = await axios({
    url: "https://graph.facebook.com/v21.0/382607701608638/media",
    method: "POST",
    headers: {
      Authorization: " Bearer " + process.env.WHATSAPP_TOKEN,
    },

    data: data,
  });

  console.log(response.data);
}

async function sendMessage() {
  const response = await fetch("http://localhost:3000/send-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "template",
      templateName: "reborn",
    }),
  });

  const data = await response.json();
  console.log(data);
}

// sendTemplateMessage();
// uploadImage();
// sendImageMessage();
sendMessage();

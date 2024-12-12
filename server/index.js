const express = require("express");
const axios = require("axios"); // Import axios di sini
const app = express();
const cors = require("cors");

require("dotenv").config(); // Pastikan Anda memiliki file .env dengan variabel-variabel yang diperlukan

app.use(cors());
app.use(express.json()); // Middleware untuk membaca JSON body

app.get("/", (req, res) => {
  res.send("Like and Subscribe");
});

app.post("/", async (req, res) => {
  try {
    const response = await sendMessage();
    res
      .status(200)
      .json({ message: "Message sent successfully", data: response.data });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

async function sendMessage() {
  const response = await axios({
    url: `https://graph.facebook.com/${process.env.API_VERSION}/${process.env.BUSINESS_PHONE_NUMBER_ID}/messages`,
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.WHATSAPP_TOKEN,
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

  return response;
}

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

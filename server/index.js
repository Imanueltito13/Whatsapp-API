const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Like and Subscribe");
});

app.post("/", async (req, res) => {
  const { template } = req.body;

  if (!template) {
    return res.status(400).json({ error: "Template is required" });
  }

  try {
    const response = await sendMessage(template);
    res
      .status(200)
      .json({ message: "Message sent successfully", data: response.data });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

async function sendMessage(template) {
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
        name: template.name,
        language: {
          code: template.language || "en_US",
        },
      },
    }),
  });

  return response;
}

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

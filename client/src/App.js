import axios from "axios";

import "./App.css";
import { useState, useEffect } from "react";

const token =
  "EAAHSEn4v16IBO2zYZCkF0jPUkbuh9ZABwEKlPVS4PXZCCEiwgqmpJPr1IGP0ZCuzM1oogfsg5CyagGdUZBjk2lLZAaH5zAoYhfSytkzmmCbARbqGoqi8CZC0l6y25GbviXOJ9fpzZCQVdGBn1RwQH2uR4swXGMDAZC8Vd6bRHh9nVOQ4Sm0Xl5NAdZBDUsxTzuKgMZAXwZDZD";
export default function App() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const sendMessage = () => {
    if (!selectedTemplate) {
      alert("Silakan pilih template terlebih dahulu!");
      return;
    }

    axios
      .post("http://localhost:8080", { template: selectedTemplate })
      .then((response) => {
        console.log("Message Sent Successfully", response.data);
        alert("Pesan berhasil dikirim!");
      })
      .catch((error) => {
        console.error("Error sending message", error);
        alert("Gagal mengirim pesan!");
      });
  };

  return (
    <div className="App">
      <Template
        onSelectTemplate={setSelectedTemplate}
        selectedTemplate={selectedTemplate}
      />
      <button
        className="bg-blue-500 px-5 py-2 mx-24 rounded-md text-white font-normal hover:bg-blue-700 transform transition duration-500 ease-in-out "
        onClick={sendMessage}
      >
        Kirim Pesan WA
      </button>
    </div>
  );
}

const Template = ({ onSelectTemplate, selectedTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(
          `https://graph.facebook.com/v21.0/523107387551459/message_templates?access_token=${token}`
          // `https://graph.facebook.com/${process.env.API_VERSION}/${process.env.BUSINESS_PHONE_NUMBER_ID}/message_templates?access_token=EAAHSEn4v16IBO83ZAVNZAlLlPqrmaNyOxzypFT1QN8B0y5Jx7yPuaeFA8vgQZCetU6UiTvwQKnt31ZBOiHHYJYJCLwYR87UJpLqOpNW5INom5IyJp17KB5ZApuVwU2wRUuWDCKsAENijoCXFegFjQcMQyJvkJXSRrx6cK0nrtfPZBJcjfsh1EJ3Q5moLRnWnLB7Trmzs3p8xLwZC6P5im8xIKqMIBgZD`
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data");
        }

        const data = await response.json();
        setTemplates(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        Memuat data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-2xl">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl sm:text-3xl font-bold text-center mb-6">
        Template Pesan Facebook
      </h1>
      <div className="grid grid-cols-1  md:grid-cols-3  gap-4">
        {templates.map((template, index) => (
          <div
            key={template.id}
            className={`cursor-pointer bg-white border-l-4 border-grey-500  border rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow duration-300 ${
              selectedTemplate?.id === template.id
                ? "border-blue-500 bg-blue-100"
                : ""
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            <div className="text-xl font-semibold mb-2 truncate">
              {template.name || `Template ${index + 1}`}
            </div>
            <div className="space-y-2">
              <div className="flex text-xs">
                <strong>ID:</strong> {template.id}
              </div>
              <div className="flex text-xs">
                <strong>Kategori:</strong>{" "}
                {template.category || "Tidak Diketahui"}
              </div>
              <div className="flex text-xs">
                <strong>Bahasa:</strong>{" "}
                {template.language || "Tidak Diketahui"}
              </div>
              <div className="text-sm text-gray-600 truncate">
                <strong>Konten:</strong>{" "}
                {template.components?.[0]?.text || "Tidak Ada Konten"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

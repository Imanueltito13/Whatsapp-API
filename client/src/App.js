import axios from "axios";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

export default function App() {
  const sendMessage = () => {
    axios
      .post("http://localhost:8080")
      .then((response) => {
        console.log("Message Sent Succesfuly", response.data);
      })
      .catch((error) => {
        console.error("error nih", error);
      });
  };
  return (
    <div className="App">
      <Template />
      <button
        className="bg-blue-500 px-5 py-2 mx-24 rounded-md text-white font-normal hover:bg-blue-700 transform transition duration-500 ease-in-out hover:-translate-y-2"
        onClick={sendMessage}
      >
        Kirim Pesan WA
      </button>
    </div>
  );
}

const Template = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(
          "https://graph.facebook.com/v21.0/333098329898197/message_templates?access_token=EAAHSEn4v16IBOZBlssq5fCeM0l8NmzdFmvnsQ3WPpfQZANPAjrfnrDBurodtdLUbG1pjxtVsqpvv4zgZBRND4GX1Y1aOAP2rEnwO41igy9ErouFtjq8Ev2JncYAcphs7OZBnDF308JiGZBwgGBSZBYZAasvh28Fw0Se3iKkoOIEtyK3f5xgKYuzmCwvGZBnCi9LsBKJHv0UioxGyistmXIoZBu4hKk1aZB"
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
      <h1 className="text-3xl font-bold text-center mb-6">
        Template Pesan Facebook
      </h1>
      <div className="grid grid-cols-4 gap-4 ">
        {templates.map((template, index) => (
          <div
            key={template.id}
            className="cursor-pointer bg-white border rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-2 truncate">
              {template.name || `Template ${index + 1}`}
            </h2>
            <div className="space-y-2">
              <p>
                <strong>ID:</strong> {template.id}
              </p>
              <p>
                <strong>Kategori:</strong>{" "}
                {template.category || "Tidak Diketahui"}
              </p>
              <p>
                <strong>Bahasa:</strong>{" "}
                {template.language || "Tidak Diketahui"}
              </p>
              <p className="text-sm text-gray-600 truncate">
                <strong>Konten:</strong>{" "}
                {template.components?.[0]?.text || "Tidak Ada Konten"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

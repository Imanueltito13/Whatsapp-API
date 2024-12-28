import axios from "axios";
import "./App.css";
import { useState, useEffect } from "react";

const token =
  "EAAHSEn4v16IBO2zYZCkF0jPUkbuh9ZABwEKlPVS4PXZCCEiwgqmpJPr1IGP0ZCuzM1oogfsg5CyagGdUZBjk2lLZAaH5zAoYhfSytkzmmCbARbqGoqi8CZC0l6y25GbviXOJ9fpzZCQVdGBn1RwQH2uR4swXGMDAZC8Vd6bRHh9nVOQ4Sm0Xl5NAdZBDUsxTzuKgMZAXwZDZD";

export default function App() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts([...contacts, newContact]);
      setNewContact({ name: "", phone: "" });
    } else {
      alert("Silakan masukkan nama dan nomor telepon!");
    }
  };

  const sendMessage = () => {
    if (!selectedTemplate) {
      alert("Silakan pilih template terlebih dahulu!");
      return;
    }

    if (selectedContacts.length === 0) {
      alert("Silakan pilih setidaknya satu nomor telepon!");
      return;
    }

    const numbersArray = selectedContacts.map((contact) => contact.phone);

    axios
      .post("http://localhost:8080", {
        template: selectedTemplate,
        phoneNumbers: numbersArray,
      })
      .then((response) => {
        console.log("Message Sent Successfully", response.data);
        alert("Pesan berhasil dikirim!");
      })
      .catch((error) => {
        console.error("Error sending message", error);
        alert("Gagal mengirim pesan!");
      });
  };

  const toggleContactSelection = (contact) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(contact)
        ? prevSelected.filter((c) => c !== contact)
        : [...prevSelected, contact]
    );
  };

  return (
    <div className="App">
      <Template
        onSelectTemplate={setSelectedTemplate}
        selectedTemplate={selectedTemplate}
      />
      <div className="mt-4 px-6 sm:px-24 ">
        <div className="mb-4 sm:flex grid grid-cols-1 gap-4 w-full">
          <input
            type="text"
            placeholder="Masukkan nama"
            value={newContact.name}
            onChange={(e) =>
              setNewContact({ ...newContact, name: e.target.value })
            }
            className="border p-2 rounded-md sm:w-80 w-full text-xs mr-2"
          />
          <input
            type="text"
            placeholder="Masukkan nomor telepon"
            value={newContact.phone}
            onChange={(e) =>
              setNewContact({ ...newContact, phone: e.target.value })
            }
            className="border p-2 rounded-md sm:w-80 w-full text-xs mr-2"
          />
          <button
            className="bg-green-500 px-5 py-2 rounded-md text-white font-normal hover:bg-green-700 transform transition duration-300 ease-in-out text-xs"
            onClick={addContact}
          >
            Tambah Kontak
          </button>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Daftar Kontak</h3>
          {contacts.map((contact, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedContacts.includes(contact)}
                onChange={() => toggleContactSelection(contact)}
                className="mr-2"
              />
              <span className="text-sm">
                {contact.name} - {contact.phone}
              </span>
            </div>
          ))}
        </div>
      </div>
      <button
        className="bg-blue-500 px-5 py-2 mx-24 rounded-md text-white font-normal hover:bg-blue-700 transform transition duration-500 ease-in-out mt-4 text-xs"
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
      <div className="grid grid-cols-1  md:grid-cols-4  gap-4">
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
                <strong className="pr-1">Status: </strong>{" "}
                <span
                  className={
                    template.status === "APPROVED"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {template.status === "APPROVED" ? "Approved" : "Pending"}
                </span>
              </div>
              <div className="flex text-xs">
                <strong className="pr-1">Kategori:</strong>{" "}
                {template.category || "Tidak Diketahui"}
              </div>
              <div className="flex text-xs">
                <strong className="pr-1">Bahasa:</strong>{" "}
                {template.language || "Tidak Diketahui"}
              </div>
              <div className="text-sm text-gray-600 truncate">
                <strong className="pr-1">Konten:</strong>{" "}
                {template.components?.[0]?.text || "Tidak Ada Konten"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

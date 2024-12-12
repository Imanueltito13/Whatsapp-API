import axios from "axios";
import "./App.css";

function App() {
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
      <button className="bg-blue-500" onClick={sendMessage}>
        Kirim Pesan WA
      </button>
    </div>
  );
}

export default App;

import axios from "axios";
import "./App.css";

function App() {
  const sendMessage = () => {
    axios.get("http://localhost:8080").then(() => {
      console.log("test");
    });
  };
  return (
    <div className="App">
      <button className="bg-blue-500" onClick={sendMessage}>Kirim Pesan WA</button>
    </div>
  );
}

export default App;

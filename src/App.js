import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader"; 
import Hammer from 'hammerjs';

function App() {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [serverStatus, setServerStatus] = useState('ready');

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const fetchSuggestions = useCallback(async () => {
    setServerStatus('working');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/autocomplete', { prompt }); 
      setSuggestions(prevSuggestions => [...prevSuggestions, ...response.data.suggestions.map(suggestion => ({ message: suggestion, type: 'suggestion' }))]); 
    } catch (error) {
      console.error(error);
    } finally {
      setServerStatus('ready');
      setIsLoading(false);
      setSuggestions(prevSuggestions => [...prevSuggestions, { message: prompt, type: 'user' }]);
      setPrompt(''); 
    }
  }, [prompt]);

  useEffect(() => {
    const chatHistory = document.querySelector('.chat-history'); 
    chatHistory.scrollTop = chatHistory.scrollHeight;  
  }, [suggestions]); 

  return (
    <div className="App">
      <div className="status-bar">
        <span className={serverStatus === 'working' ? 'status-active' : ''}>
          {serverStatus === 'working' ? 'Server Working...' : 'Server Ready'}
        </span>
        {serverStatus === 'working' &&  // Show animation when working
          <img src={require('./hammer.gif')} alt="Hammer Animation" className="hammer-animation" />
        } 
      </div>
      <h1>UE5 Autocomplete</h1>
      <div className="chat-container"> 
        <div className="chat-history">
          <ul> 
            {suggestions.map((item, index) => (
              <li key={index} className={item.type === "suggestion" ? "suggestion-message" : "user-message"}>
                {item.message}
              </li>
            ))}
          </ul>
        </div>
        <div className="input-area">
          <input type="text" value={prompt} onChange={handleInputChange} placeholder="Enter your UE5 code or documentation prompt..." />
          <button onClick={fetchSuggestions}>Send</button> 
          {isLoading && 
            <div className="loader-container">
              <ClipLoader color="#007bff" loading={isLoading} size={20} />
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App; 

import React, { useState } from 'react';
import axios from 'axios';

const ChatbotPage = () => {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const sessionId = 'my_session'; // You can generate/manage this dynamically.
  const backendUrl = "https://newchatbot-ryna.onrender.com";

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }
    if (!query) {
      alert('Please enter a question.');
      return;
    }

    // Add user's query to conversation
    setConversation(prev => [...prev, { sender: 'user', text: query }]);
    setLoading(true);

    try {
      // Upload the file (this can be done once per session)
      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('file', file);

      await axios.post(`${backendUrl}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Send the question
      const res = await axios.post(`${backendUrl}/chat`, {
        session_id: sessionId,
        question: query,
      });

      // Use the "answer" key from the response.
      const answer = res.data.answer || 'No answer returned';
      setConversation(prev => [...prev, { sender: 'bot', text: answer }]);
    } catch (error) {
      console.error('Error:', error);
      setConversation(prev => [
        ...prev,
        { sender: 'bot', text: 'Error processing request.' }
      ]);
    }
    setLoading(false);
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
          Sales Chatbot
        </h1>

        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block text-xl font-medium text-gray-700 mb-2">
            Upload a File
          </label>
          <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition">
            <span className="text-gray-700">Choose File</span>
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </label>
          {file && (
            <p className="mt-2 text-sm text-gray-500">
              Selected file: <span className="font-semibold">{file.name}</span>
            </p>
          )}
        </div>

        {/* Question Input Section */}
        <div className="mb-6">
          <label className="block text-xl font-medium text-gray-700 mb-2">
            Your Question
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            placeholder="Type your question here..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Send Button and Loading Indicator */}
        <div className="flex items-center justify-end space-x-4 mb-6">
          {loading && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-indigo-600 font-semibold">Generating response...</span>
            </div>
          )}
          <button
            onClick={handleSend}
            disabled={loading}
            className={`px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Send
          </button>
        </div>

        {/* Conversation Display */}
        <div className="bg-gray-50 rounded-lg p-6 shadow-inner max-h-96 overflow-y-auto">
          {conversation.length === 0 ? (
            <p className="text-center text-gray-500">No conversation yet. Start by asking a question!</p>
          ) : (
            conversation.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                  <div className={`max-w-md p-4 rounded-xl shadow-md ${isUser ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                    <p className="text-lg">{msg.text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;

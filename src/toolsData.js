// src/data/toolsData.js

export const categories = [
    'All',
    'Agents',
    'Customer Support',
    'Entertainment',
    'Finance',
    'HR',
    'Marketing',
    'Sales', // We'll have a Chatbot in this category
  ];
  
  export const tools = [
    {
      title: 'Voice Chat',
      description:
        'Use Whisper to transcribe speech in real-time, passing the text to ChatGPT for quick responses.',
      category: 'Agents',
    },
    {
      title: 'Voice Answers',
      description:
        'Provide voice-based answers to user queries in real-time using ElevenLabs or other TTS APIs.',
      category: 'Agents',
    },
    {
      title: 'Realtime Avatar Chat',
      description:
        'Use your HeyGen AI Avatar to answer questions in real-time, integrated with your data.',
      category: 'Agents',
    },
    {
      title: 'Chatbot with Internet',
      description:
        'A chatbot that can answer user questions with real-time internet context if local data is insufficient.',
      category: 'Customer Support',
    },
    {
      title: 'Character Chat',
      description:
        'Bring stories to life with a role-playing style chat. Define character traits and let AI handle the rest.',
      category: 'Entertainment',
    },
    {
      title: 'Website Chatbot',
      description:
        'A chatbot that can answer user questions based on your website content, easily embedded on any page.',
      category: 'Marketing',
    },
    // Our special "Chatbot" tool in "Sales" category
    {
      title: 'Sales Chatbot',
      description:
        'Upload a file and ask questions. Python backend processes the file and returns answers.',
      category: 'Sales',
      route: '/sales-chatbot', // We'll navigate to a dedicated page
    },
  ];
  
"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, Globe, PenTool, Bot, User, Sparkles } from 'lucide-react';

interface SearchInfo {
  stages: string[];
  query: string;
  urls: string[];
  error?: string;
}

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  type: string;
  isLoading?: boolean;
  searchInfo?: SearchInfo;
}

// Header Component
const Header = () => (
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
    <div className="flex items-center justify-center space-x-3">
      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
        <Sparkles className="w-5 h-5" />
      </div>
      <h1 className="text-xl font-semibold">AI Assistant</h1>
    </div>
  </div>
);

// Search Status Component
const SearchStatus = ({ searchInfo }: { searchInfo: SearchInfo }) => {
  if (!searchInfo || (!searchInfo.stages.length && !searchInfo.error)) return null;

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'searching': return <Search className="w-3 h-3" />;
      case 'reading': return <Globe className="w-3 h-3" />;
      case 'writing': return <PenTool className="w-3 h-3" />;
      default: return <Search className="w-3 h-3" />;
    }
  };

  if (searchInfo.error) {
    return (
      <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
        Search error: {searchInfo.error}
      </div>
    );
  }

  return (
    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
      {searchInfo.stages.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {searchInfo.stages.map((stage, index) => (
            <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-blue-500 text-white rounded-full text-xs">
              {getStageIcon(stage)}
              <span className="capitalize">{stage}</span>
            </div>
          ))}
        </div>
      )}
      {searchInfo.query && (
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Query:</span> {searchInfo.query}
        </p>
      )}
      {searchInfo.urls && searchInfo.urls.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Sources:</p>
          {searchInfo.urls.slice(0, 3).map((url, index) => (
            <a key={index} href={url} target="_blank" rel="noopener noreferrer" 
               className="block text-xs text-blue-600 hover:underline mb-1 truncate">
              {url}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

// Message Component
const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.isUser;
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start space-x-2 max-w-[85%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-purple-500' : 'bg-blue-500'
        }`}>
          {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
        </div>
        
        <div className={`rounded-lg px-3 py-2 ${
          isUser 
            ? 'bg-purple-500 text-white' 
            : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
        }`}>
          {message.searchInfo && <SearchStatus searchInfo={message.searchInfo} />}
          
          {message.isLoading ? (
            <div className="flex items-center space-x-2 py-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-gray-500">Thinking...</span>
            </div>
          ) : message.content ? (
            <div className="whitespace-pre-wrap">
              {message.content}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// Message Area Component
const MessageArea = ({ messages }: { messages: Message[] }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

interface InputBarProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  onSubmit: () => void;
}


// Input Bar Component
const InputBar = ({ currentMessage, setCurrentMessage, onSubmit }: InputBarProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
        />
        <button
          onClick={handleButtonClick}
          disabled={!currentMessage.trim()}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Main Component
const Home = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: 'Hi there, how can I help you?',
      isUser: false,
      type: 'message'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [checkpointId, setCheckpointId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      const newMessageId = messages.length > 0 ? Math.max(...messages.map(msg => msg.id)) + 1 : 1;

      setMessages(prev => [
        ...prev,
        {
          id: newMessageId,
          content: currentMessage,
          isUser: true,
          type: 'message'
        }
      ]);

      const userInput = currentMessage;
      setCurrentMessage("");

      try {
        const aiResponseId = newMessageId + 1;
        setMessages(prev => [
          ...prev,
          {
            id: aiResponseId,
            content: "",
            isUser: false,
            type: 'message',
            isLoading: true,
            searchInfo: {
              stages: [],
              query: "",
              urls: []
            }
          }
        ]);

        let url = `https://perplexity-latest-f50r.onrender.com/chat_stream/${encodeURIComponent(userInput)}`;
        if (checkpointId) {
          url += `?checkpoint_id=${encodeURIComponent(checkpointId)}`;
        }

        const eventSource = new EventSource(url);
        let streamedContent = "";
        let searchData: SearchInfo | null = null;

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'checkpoint') {
              setCheckpointId(data.checkpoint_id);
            }
            else if (data.type === 'content') {
              streamedContent += data.content;

              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiResponseId
                    ? { ...msg, content: streamedContent, isLoading: false }
                    : msg
                )
              );
            }
            else if (data.type === 'search_start') {
              const newSearchInfo = {
                stages: ['searching'],
                query: data.query,
                urls: []
              };
              searchData = newSearchInfo;

              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiResponseId
                    ? { ...msg, content: streamedContent, searchInfo: newSearchInfo, isLoading: false }
                    : msg
                )
              );
            }
            else if (data.type === 'search_results') {
              try {
                const urls = typeof data.urls === 'string' ? JSON.parse(data.urls) : data.urls;

                const newSearchInfo = {
                  stages: searchData ? [...searchData.stages, 'reading'] : ['reading'],
                  query: searchData?.query || "",
                  urls: urls
                };
                searchData = newSearchInfo;

                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === aiResponseId
                      ? { ...msg, content: streamedContent, searchInfo: newSearchInfo, isLoading: false }
                      : msg
                  )
                );
              } catch (err) {
                console.error("Error parsing search results:", err);
              }
            }
            else if (data.type === 'search_error') {
              const newSearchInfo = {
                stages: searchData ? [...searchData.stages, 'error'] : ['error'],
                query: searchData?.query || "",
                error: data.error,
                urls: []
              };
              searchData = newSearchInfo;

              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiResponseId
                    ? { ...msg, content: streamedContent, searchInfo: newSearchInfo, isLoading: false }
                    : msg
                )
              );
            }
            else if (data.type === 'end') {
              if (searchData) {
                const finalSearchInfo = {
                  ...searchData,
                  stages: [...searchData.stages, 'writing']
                };

                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === aiResponseId
                      ? { ...msg, searchInfo: finalSearchInfo, isLoading: false }
                      : msg
                  )
                );
              }

              eventSource.close();
            }
          } catch (error) {
            console.error("Error parsing event data:", error, event.data);
          }
        };

        eventSource.onerror = (error) => {
          console.error("EventSource error:", error);
          eventSource.close();

          if (!streamedContent) {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === aiResponseId
                  ? { ...msg, content: "Sorry, there was an error processing your request.", isLoading: false }
                  : msg
              )
            );
          }
        };

        eventSource.addEventListener('end', () => {
          eventSource.close();
        });
      } catch (error) {
        console.error("Error setting up EventSource:", error);
        setMessages(prev => [
          ...prev,
          {
            id: newMessageId + 1,
            content: "Sorry, there was an error connecting to the server.",
            isUser: false,
            type: 'message',
            isLoading: false
          }
        ]);
      }
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen py-4 px-4">
      <div className="w-full max-w-4xl bg-white flex flex-col rounded-lg shadow-lg overflow-hidden h-[95vh]">
        <Header />
        <MessageArea messages={messages} />
        <InputBar currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Home;
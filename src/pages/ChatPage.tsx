import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Settings, Sun, Moon, ChevronDown, X } from 'lucide-react';
import OpenAI from 'openai';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import { Chat, Message, UserProfile } from './types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const getRandomAvatar = () => `https://api.dicebear.com/7.x/avatars/svg?seed=${Math.random()}`;

export function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Loki Variant',
    email: 'variant@tva.multiverse',
    avatar: getRandomAvatar(),
    theme: 'dark'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Timeline',
      messages: []
    };
    setChats([...chats, newChat]);
    setActiveChat(newChat.id);
  };

  const getCurrentChat = () => {
    return chats.find(chat => chat.id === activeChat);
  };

  const updateCurrentChat = (messages: Message[]) => {
    setChats(chats.map(chat =>
      chat.id === activeChat
        ? { ...chat, messages, title: messages[0]?.content.slice(0, 30) || 'New Timeline' }
        : chat
    ));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeChat || isLoading) return;

    const currentChat = getCurrentChat();
    if (!currentChat) return;

    const newMessages = [...currentChat.messages, { role: 'user', content: input }];
    updateCurrentChat(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: newMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });

      const assistantMessage = response.choices[0]?.message?.content;
      if (assistantMessage) {
        updateCurrentChat([...newMessages, { role: 'assistant', content: assistantMessage }]);
      }
    } catch (error: any) {
      console.error('Error calling OpenAI:', error);
      updateCurrentChat([...newMessages, {
        role: 'assistant',
        content: "⚠️ Sorry, I couldn't get a response from ChatGPT. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={clsx(
      'flex h-screen',
      isDarkMode ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'
    )}>
      {/* Ambient Light */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-500 opacity-5 blur-[100px] pointer-events-none" />

      {/* Hover Area */}
      <div 
        className="fixed left-0 top-0 w-2 h-screen z-50"
        onMouseEnter={() => setIsSidebarOpen(true)}
      />

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={clsx(
          'fixed inset-y-0 left-0 w-64 bg-black p-4 flex flex-col transform transition-transform duration-300 ease-in-out z-40',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={clsx(
                'flex items-center gap-2 w-full p-3 rounded-lg mb-2 text-left transition-colors',
                activeChat === chat.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              )}
            >
              <MessageSquare size={20} />
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>

        {/* Profile Section */}
        <div className="border-t border-gray-800 pt-4 mt-4">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <img src={profile.avatar} alt="Profile" className="w-10 h-10 rounded-full bg-gray-800" />
            <div className="flex-1 text-left">
              <div className="font-medium text-sm text-gray-200">{profile.name}</div>
              <div className="text-xs text-gray-400">{profile.email}</div>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="w-96 rounded-xl bg-gray-900 p-6 shadow-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-100">Settings</h2>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <span className="text-gray-200">Theme</span>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  {isDarkMode ? <Sun size={20} className="text-gray-200" /> : <Moon size={20} className="text-gray-200" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {getCurrentChat()?.messages.map((message, index) => (
            <div
              key={index}
              className={clsx(
                'px-4 py-6',
                message.role === 'assistant' ? 'bg-gray-900' : 'bg-black'
              )}
            >
              <div className="max-w-3xl mx-auto flex space-x-6">
                <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0">
                  {message.role === 'assistant' ? (
                    <div className="bg-green-600 rounded-sm w-full h-full flex items-center justify-center">
                      <MessageSquare size={16} className="text-white" />
                    </div>
                  ) : (
                    <div className="bg-gray-700 rounded-sm w-full h-full flex items-center justify-center">
                      <img src={profile.avatar} alt="User" className="w-full h-full rounded-sm" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 prose prose-invert max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-800 bg-black p-4">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Send a message..."
                className="w-full p-4 pr-12 rounded-lg bg-gray-900 text-white border border-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

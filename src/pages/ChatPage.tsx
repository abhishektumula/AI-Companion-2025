import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import { Chat, Message, UserProfile } from './types';

const getRandomAvatar = () => `https://api.dicebear.com/7.x/avatars/svg?seed=${Math.random()}`;

export function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [typingText, setTypingText] = useState<string>('');
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Loki Variant',
    email: 'variant@tva.multiverse',
    avatar: getRandomAvatar(),
    theme: 'dark'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  }, [chats, typingText]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Timeline',
      messages: [
        {
          role: 'assistant',
          content: "👋 Hey there! How are you feeling today?"
        }
      ]
    };
    setChats([...chats, newChat]);
    setActiveChat(newChat.id);
  };

  const getCurrentChat = () => chats.find(chat => chat.id === activeChat);

  const updateCurrentChat = (messages: Message[]) => {
    setChats(chats.map(chat =>
      chat.id === activeChat
        ? { ...chat, messages, title: messages[0]?.content.slice(0, 30) || 'New Timeline' }
        : chat
    ));
  };

  const typeOutText = (text: string, baseMessages: Message[]) => {
    setTypingText('');
    let i = 0;

    const interval = setInterval(() => {
      if (i <= text.length) {
        setTypingText(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        const finalMessages = [...baseMessages, { role: 'assistant', content: text }];
        updateCurrentChat(finalMessages);
        setTypingText('');
        setIsLoading(false);
      }
    }, 10); // Typing speed in ms
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
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: import.meta.env.VITE_OPENROUTER_MODEL,
          messages: [{ role: 'user', content: input }],
          max_tokens: 100
        })
      });

      const data = await response.json();
      const assistantMessage = data?.choices?.[0]?.message?.content;

      if (assistantMessage) {
        typeOutText(assistantMessage, newMessages);
      } else {
        updateCurrentChat([...newMessages, {
          role: 'assistant',
          content: "⚠️ No response from the model. Try again later."
        }]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error calling OpenRouter:', error);
      updateCurrentChat([...newMessages, {
        role: 'assistant',
        content: "⚠️ Sorry, there was an error. Please try again later."
      }]);
      setIsLoading(false);
    }
  };

  return (
    <div className={clsx('flex h-screen pt-16', isDarkMode ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900')}>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 text-xl">
          {getCurrentChat()?.messages.map((message, index) => (
            <div
              key={index}
              className={clsx(
                'flex items-start max-w-2xl',
                message.role === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
              )}
            >
              <div className={clsx(
                'rounded-3xl px-6 py-4 break-words shadow-md text-xl leading-relaxed',
                message.role === 'user'
                  ? 'bg-green-600 text-white rounded-br-none'
                  : 'bg-gray-800 text-white rounded-bl-none'
              )}>
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          {/* Typing Animation Bubble */}
          {typingText && (
            <div className="flex items-start max-w-2xl mr-auto justify-start">
              <div className="bg-gray-800 text-white rounded-3xl rounded-bl-none px-6 py-4 break-words shadow-md text-xl leading-relaxed animate-pulse">
                <ReactMarkdown>{typingText}</ReactMarkdown>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-800 bg-black p-6">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Send a message..."
                className="w-full p-6 pr-14 rounded-lg bg-gray-900 text-white text-xl border border-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
              >
                <Send size={22} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;

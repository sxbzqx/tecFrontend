"use client";

import { Message } from "@/types/message";
import { useState, useEffect, useRef } from "react";
import { backendUrl } from "@/utils/config";

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>(""); 
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const currentUserId = 249; 
  const messagesEndRef = useRef<HTMLDivElement>(null);

  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        
        const response = await fetch(backendUrl("/chat"), {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        });
        console.log("Ответ от сервера чата получен, статус:", response.status);

        if (!response.ok) {
          throw new Error(`Ошибка сервера чата: ${response.status}`);
        }

        const data: Message[] = await response.json();
        console.log("Сообщения успешно распарсены:", data);
        setMessages(data);
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки истории чата");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessageBody = {
      user: currentUserId,
      message: inputValue.trim(),
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch(backendUrl("/chat"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(newMessageBody),
      });

      if (!response.ok) {
        throw new Error("Не удалось отправить сообщение");
      }

      const savedMessage: Message = await response.json();
      
      
      setMessages((prev) => [...prev, savedMessage]);
      setInputValue("");
      setTimeout(scrollToBottom, 50); 
    } catch (err: any) {
      alert(err.message || "Ошибка при отправке");
    }
  };

  
  const selectedMessageInfo = messages.find((item) => item.id === selectedMessageId);

  if (isLoading)
    return <div style={{ padding: "20px", fontFamily: "sans-serif" }}>Загрузка сообщений чата...</div>;
  if (error)
    return <div style={{ padding: "20px", color: "red", fontFamily: "sans-serif" }}>Ошибка чата: {error}</div>;

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: "600" }}>Рабочий чат</h2>

      {/* Окно сообщений (Аналог твоего селекта, но в виде ленты) */}
      <div
        style={{
          width: "100%",
          height: "350px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "12px",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {messages.map((item) => {
          const isMe = item.user === currentUserId;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedMessageId(item.id)} // По клику пишем инфу вниз
              style={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                backgroundColor: isMe ? "#0070f3" : "#e5e5ea",
                color: isMe ? "#fff" : "#000",
                padding: "10px 14px",
                borderRadius: isMe ? "14px 14px 0 14px" : "14px 14px 14px 0",
                maxWidth: "75%",
                cursor: "pointer",
                boxShadow: selectedMessageId === item.id ? "0 0 0 2px #000" : "none",
                transition: "transform 0.1s",
              }}
            >
              <div style={{ fontSize: "14px", wordBreak: "break-word" }}>
                {item.message}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  textAlign: "right",
                  marginTop: "4px",
                  opacity: 0.7,
                }}
              >
                {new Date(item.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          );
        })}
        {}
        <div ref={messagesEndRef} />
      </div>

      {/* Форма отправки сообщения */}
      <form onSubmit={handleSendMessage} style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Напишите сообщение..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "15px",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 16px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Отправить
        </button>
      </form>

      {}
      {selectedMessageInfo && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            backgroundColor: "#f9f9f9",
            borderRadius: "6px",
            border: "1px solid #eee",
          }}
        >
          <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "16px" }}>Лог сообщения:</h3>
            <button 
              onClick={() => setSelectedMessageId(null)} 
              style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}
            >
              закрыть
            </button>
          </div>
          <p style={{ margin: "4px 0", fontSize: "14px" }}>
            <strong>ID сообщения:</strong> {selectedMessageInfo.id}
          </p>
          <p style={{ margin: "4px 0", fontSize: "14px" }}>
            <strong>Отправитель (User ID):</strong> {selectedMessageInfo.user} {selectedMessageInfo.user === currentUserId ? "(Вы)" : ""}
          </p>
          <p style={{ margin: "4px 0", fontSize: "14px" }}>
            <strong>Полная дата:</strong> {new Date(selectedMessageInfo.date).toLocaleString()}
          </p>
          <p style={{ margin: "4px 0", fontSize: "14px" }}>
            <strong>Текст:</strong> "{selectedMessageInfo.message}"
          </p>
        </div>
      )}
    </div>
  );
}
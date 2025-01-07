import React, { useState } from "react";
import Modal from "../common/Modal"; // Modal 컴포넌트
import styles from "./ChatBot.module.css"; // 스타일링
import chatbot from "../../images/chatbot.png"; // 로고 이미지

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // ChatGPT API 호출
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer (text)`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: input }],
          }),
        }
      );

      const data = await response.json();
      const botMessage = {
        sender: "bot",
        text: data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching ChatGPT response:", error);
    }

    setInput("");
  };

  return (
    <div>
      <div className={styles.chatIcon} onClick={toggleModal}>
        <img src={chatbot} alt="Chat Icon" className={styles.chatIconImage} />
      </div>

      {isOpen && (
        <Modal onClose={toggleModal}>
          <div className={styles.chatModalContent}>
            <h2 className={styles.chatModalHeader}>
              Fitness & Posture ChatBot
            </h2>
            <div className={styles.chatMessages}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={
                    msg.sender === "user"
                      ? styles.userMessage
                      : styles.botMessage
                  }
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className={styles.chatInputContainer}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={styles.chatInput}
                placeholder="Ask me anything about fitness or posture!"
              />
              <button onClick={sendMessage} className={styles.chatSendButton}>
                Send
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ChatBot;

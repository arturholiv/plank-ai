import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Main.css';
import API_URL from '../../config.ts';
import GitHub from '../../Component/Github/Github.tsx';

const Main = () => {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{ type: string; title: string; content: string }>>([]);
  const [buttonStatus, setButtonStatus] = useState("default");
  const [buttonCopyStatus, setButtonCopyStatus] = useState("default");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    const presentationSent = localStorage.getItem('presentationSent');
    if (!presentationSent) {
      const message1 = { type: 'bot', title: "", content: "Hello." };
      const message2 = { type: 'bot', title: "", content: "This is the Plank AI test. Made by Artur H. Oliveira." };
      const message3 = { type: 'bot', title: "", content: "Feel free to paste your code here and get a refactored version of it." };

      const timer1 = setTimeout(() => setMessages(prev => [...prev, message1]), 1000);
      const timer2 = setTimeout(() => setMessages(prev => [...prev, message2]), 2000);
      const timer3 = setTimeout(() => setMessages(prev => [...prev, message3]), 3000);

      localStorage.setItem('presentationSent', 'true');

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (code.trim() === '') return;
    const userMessage = { type: 'user', title: "", content: code };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setButtonStatus("loading");

    try {
      const response = await axios.post(`${API_URL}/codeEnhancement`, { code });

      if (response.data?.result) {
        const resultString = response.data.result.trim();
        const resultJson = JSON.parse(resultString);

        const { explanation, refactored_code, reasoning, error } = resultJson;

        if (explanation && refactored_code && reasoning) {
          const explanationMessage = { type: 'bot', title: "Explanation", content: `\n${explanation}` };
          const refactoredMessage = { type: 'bot', title: "Refactored Code", content: `${refactored_code}` };
          const reasoningMessage = { type: 'bot', title: "Reasoning", content: `\n${reasoning}` };
          setMessages(prev => [...prev, explanationMessage, refactoredMessage, reasoningMessage]);
          setButtonStatus("success");
        } else if (error) {
          const errorMessage = { type: 'bot', title: "Error", content: `${error}` };
          setMessages(prev => [...prev, errorMessage]);
          setButtonStatus("error");
        }
      } else {
        const noResultMessage = { type: 'bot', title: "Error", content: "No result returned from the server." };
        setMessages(prev => [...prev, noResultMessage]);
        setButtonStatus("error");
      }
    } catch (err: any) {
      const errorMessageContent =
        err.response?.data?.error ||
        err.message ||
        "An unexpected error occurred. Please try again later.";
      const errorMessage = { type: 'bot', title: "Error", content: `${errorMessageContent}` };
      setMessages(prev => [...prev, errorMessage]);
      setButtonStatus("error");
    } finally {
      setTimeout(() => setButtonStatus("default"), 5000);
      setLoading(false);
      setCode('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setButtonCopyStatus("success");
    setTimeout(() => setButtonCopyStatus("default"), 2500);
  };

  return (
    <Container fluid className="container">
      <Row className="mt-4">
        <Col>
          <h1>Plank AI</h1>
          <h1>Code Snippet Refactoring & Explanation Tool</h1>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="d-flex justify-content-center">
          <div className="chat-container">
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.type}`}>
                  <div className="bubble">
                    <strong className="message-title">{msg.title}</strong>
                    {msg.title === "Refactored Code" ? 
                    <div className="refactoredCode ">
                      {msg.content}
                    </div> : 
                    <div className="message-content">
                      {msg.content}
                    </div>}
                    {msg.title === "Refactored Code" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copyToClipboard(msg.content)}
                        className={`copy-button ${buttonCopyStatus}`}
                        disabled={buttonCopyStatus === "loading"}
                      >
                        {buttonCopyStatus === "success" ? "Copied!" : "Copy"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
              <Form.Control
                as="textarea"
                value={code}
                rows={3}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Paste your code here..."
              />
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loading || code.length === 0}
                className={`submit-button ${buttonStatus}`}
                style={{
                  backgroundColor:
                    buttonStatus === "success"
                      ? "#4CBB17"
                      : buttonStatus === "error"
                        ? "red"
                        : "",
                  borderColor:
                    buttonStatus === "success"
                      ? "#4CBB17"
                      : buttonStatus === "error"
                        ? "red"
                        : "",
                }}
              >
                {loading ? (
                  "Loading..."
                ) : buttonStatus === "success" ? (
                  "Success!"
                ) : buttonStatus === "error" ? (
                  "Error"
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <GitHub />
    </Container>
  );
};

export default Main;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import './Main.css';
import API_URL from '../../config.ts';
import GitHub from '../../Component/Github/Github.tsx';

const Main = () => {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ type: string; title: string; content: string }>>([]);
  const [buttonStatus, setButtonStatus] = useState("default");
  const [buttonCopyStatus, setButtonCopyStatus] = useState("default");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
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
    const userMessage = { type: 'user', title: "Me", content: code };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);
    setButtonStatus("loading");

    try {
      const response = await axios.post(`${API_URL}/codeEnhancement`, { code });

      if (response.data?.result) {
        const resultString = response.data.result.trim();
        const resultJson = JSON.parse(resultString);

        const { explanation, refactored_code, reasoning, error } = resultJson;

        if (explanation && refactored_code && reasoning) {
          const explanationMessage = { type: 'bot', title: "Explanation", content: `\n${explanation}` };
          const refactoredMessage = { type: 'bot', title: "Refactored Code", content: `*\n\`\`\`javascript\n${refactored_code}\n\`\`\`` };
          const reasoningMessage = { type: 'bot', title: "Reasoning", content: `\n${reasoning}` };
          setMessages(prev => [...prev, explanationMessage, refactoredMessage, reasoningMessage]);
          setButtonStatus("success");
        } else if (error) {
          const errorMessage = { type: 'bot', title: "Error", content: `**Error:** ${error}` };
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
      const errorMessage = { type: 'bot', title: "Error", content: `**Error:** ${errorMessageContent}` };
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
    <Container>
      <Row className="mt-4">
        <Col>
          <h1>Plank AI</h1>
          <h1>Code Snippet Refactoring & Explanation Tool</h1>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <div className="chat-container">
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.type}`}>
                  <div className="bubble">
                    <strong>{msg.title}</strong>
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                    {msg.title === "Refactored Code" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copyToClipboard(msg.content.split('```javascript\n')[1].split('\n```')[0])}
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
                rows={2}
                value={code}
                onChange={(e) => setCode(e.target.value)}
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
                  "Error processing code"
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

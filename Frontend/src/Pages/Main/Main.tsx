import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import './Main.css';
import API_URL from '../../config.ts';
import GitHub from '../../Component/Github/Github.tsx';
import { RiCloseCircleFill } from 'react-icons/ri';

const Main = () => {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [refactoredCode, setRefactoredCode] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState<string | null>(null);
  const [buttonStatus, setButtonStatus] = useState("default");
  const [buttonCopyStatus, setButtonCopyStatus] = useState("default");
  const [response, setResponse] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setButtonStatus("loading");
    setExplanation(null);
    setRefactoredCode(null);
    setReasoning(null);
    setResponse(null);
    setShowResponse(false);

    try {
      const response = await axios.post(`${API_URL}/codeEnhancement`, { code });
  
      if (response.data?.result) {
        const resultString = response.data.result.trim(); 
        const resultJson = JSON.parse(resultString);
  
        const { explanation, refactored_code, reasoning, error } = resultJson;
  
        if (explanation && refactored_code && reasoning) {
          setShowResponse(true);
          setRefactoredCode(refactored_code);
          setExplanation(explanation);
          setReasoning(reasoning);
          setButtonStatus("success");
        } else if (error) {
          setResponse(error);
          setShowResponse(true);
          setButtonStatus("error");
        }
      } else {
        setResponse("No result returned from the server.");
        setShowResponse(true);
        setButtonStatus("error");
      }
    } catch (err: any) {
      const errorMessage = 
        err.response?.data?.error || 
        err.message || 
        "An unexpected error occurred. Please try again later.";
      const errorStatus = err.response?.status || 500;
      setErrorStatus(errorStatus);
      setError(errorMessage);
      setButtonStatus("error");
    } finally {
      setTimeout(() => setButtonStatus("default"), 5000);
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (refactoredCode) {
      navigator.clipboard.writeText(refactoredCode);
      setButtonCopyStatus("success");
      setTimeout(() => setButtonCopyStatus("default"), 2500);
    }
  };

  const closeResponse = () => {
    setError(null);
    setExplanation(null);
    setRefactoredCode(null);
    setReasoning(null);
    setResponse(null);
    setShowResponse(false);
    setCode("");
  }

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
          <Form>
            <Form.Group className="codeInput">
              <Form.Label>Enter your code to be explained and refactored</Form.Label>
              <Form.Control
                className="form-control"
                as="textarea"
                rows={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </Form.Group>
            <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={loading || code.length === 0}
                className={`d-flex align-items-center justify-content-center ${buttonStatus}`}
                style={{
                    marginTop: "20px",
                    borderRadius: "27px",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
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
                    borderWidth: "2px",
                    borderStyle: "solid",
                    animation:
                        buttonStatus === "success" ||
                        buttonStatus === "error"
                            ? "borderShrink 4s linear"
                            : "none",
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
          </Form>
        </Col>
      </Row>
      {error && (
        <div className="error-container">
            <div>
                <Button className="closeButton" onClick={closeResponse}>
                    <RiCloseCircleFill className="closeIcon" />
                </Button>
            </div>
            <Row className="mt-3">
                <h4 className="error-title">Error: {errorStatus}</h4>
                <Col>
                    <Alert variant="danger" className="error-message">{error}</Alert>
                </Col>
            </Row>
        </div>
      )}
      { showResponse && (
        <div className="codeResult">
        <div>
            <Button className="closeButton" onClick={closeResponse}>
                <RiCloseCircleFill className="closeIcon" />
            </Button>
        </div>
          {explanation && (
            <Row className="mt-4 response">
            <Col>
              <h4>Explanation</h4>
              <div>{explanation}</div>
            </Col>
          </Row>
        )}
        {refactoredCode && (
          <Row className="mt-4">
            <Col>
              <h4>Refactored Code</h4>
              <pre className="refactoredCode">{refactoredCode}</pre>
              <Button
                variant="primary"
                onClick={copyToClipboard}
                className={`d-flex align-items-center justify-content-center ${buttonCopyStatus}`}
                style={{
                    marginTop: "20px",
                    borderRadius: "27px",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                    backgroundColor:
                        buttonCopyStatus === "success"
                            ? "#4CBB17"
                            : buttonCopyStatus === "error"
                            ? "red"
                            : "",
                    borderColor:
                        buttonCopyStatus === "success"
                            ? "#4CBB17"
                            : buttonCopyStatus === "error"
                            ? "red"
                            : "",
                    borderWidth: "2px",
                    borderStyle: "solid",
                    animation:
                        buttonCopyStatus === "success" ||
                        buttonCopyStatus === "error"
                            ? "borderShrink 4s linear"
                            : "none",
              }}>
                {buttonCopyStatus === "success" ? (
                    "Copied!"
                ) : buttonCopyStatus === "error" ? (
                    "Error copying"
                ) : (
                    "Copy"
                )}
            </Button>
            </Col>
          </Row>
        )}
        {reasoning && (
          <Row className="mt-4 response">
            <Col>
              <h4>Reasoning</h4>
              <div>{reasoning}</div>
            </Col>
          </Row>
        )}
        {response && (
          <Row className="mt-4">
            <Col>
              <h4 className="error-title">Something went wrong</h4>
              <div className="error-message">{response}</div>
            </Col>
          </Row>
        )}
      </div>
      )}
      <GitHub />
    </Container>
  );
};

export default Main;

import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import './Main.css';
import API_URL from '../../config.ts';
import GitHub from '../../Component/Github/Github.tsx';

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
      console.log("code: ", code);
  
      const response = await axios.post(`${API_URL}/codeEnhancement`, { code });
      console.log("response: ", response);

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
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred. Please try again later.";
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
      setTimeout(() => setButtonCopyStatus("default"), 5000);
    }
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
          <Form>
            <Form.Group className="codeInput">
              <Form.Label>Enter your code</Form.Label>
              <Form.Control
                className="form-control"
                as="textarea"
                rows={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
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
                "Send code"
            )}
            </Button>
          </Form>
        </Col>
      </Row>
      {error && (
        <Row className="mt-3">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}
      { showResponse && (
        <div className="codeResult">
          {explanation && (
            <Row className="mt-4">
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
                    "Copied to clipboard!"
                ) : buttonCopyStatus === "error" ? (
                    "Error copying to clipboard"
                ) : (
                    "Copy to clipboard"
                )}
            </Button>
            </Col>
          </Row>
        )}
        {reasoning && (
          <Row className="mt-4">
            <Col>
              <h4>Reasoning</h4>
              <div>{reasoning}</div>
            </Col>
          </Row>
        )}
        {response && (
          <Row className="mt-4">
            <Col>
              <h4>Something went wrong</h4>
              <div>{response}</div>
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

import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import './Main.css';
import API_URL from '../../config.ts';

const Main = () => {
  const [code, setCode] = useState<string>('');
  const [refactoredCode, setRefactoredCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonStatus, setButtonStatus] = useState("default");

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      setButtonStatus("loading");
      console.log("code: ", code);
      const response = await axios.post(`${API_URL}/codeEnhancement`, { code });
      console.log("response: ", response);
      const refactoredCode = response.data.result;
      setRefactoredCode(refactoredCode);
      setButtonStatus("success");
      setTimeout(() => setButtonStatus("default"), 5000);
    } catch (err) {
      setError('There was an error processing the code.');
      setButtonStatus("error");
      setTimeout(() => setButtonStatus("default"), 5000);
    } finally {
      setLoading(false);
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
                "Code Sent!"
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
      {refactoredCode && (
        <Row className="mt-4">
          <Col>
            <h4>Refactored Code</h4>
            <div className="codeResult">{refactoredCode}</div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Main;

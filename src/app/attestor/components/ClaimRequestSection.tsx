import { useState } from "react";

export function ClaimRequestSection() {
  const [claimRequest, setClaimRequest] = useState("");
  const [claimResult, setClaimResult] = useState("");
  const [minimalData, setMinimalData] = useState("");
  const [loading, setLoading] = useState(false);
  const [simulateClaim, setSimulateClaim] = useState(false);

  const mockEvaluate = async () => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("Evaluation Successful. Verification confirmed.");
      }, 3000);
    });
  };

  const handleClaim = async () => {
    setLoading(true);
    setClaimResult("");
    setMinimalData("");
    const res = await mockEvaluate();
    setClaimResult(res);
    setMinimalData("Extracted Data: User ID: 12345, Active: true");
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>Claim Verification</h2>
      <div className="input-group">
        <label>Claim Request</label>
        <textarea
          value={claimRequest}
          onChange={(e) => setClaimRequest(e.target.value)}
          placeholder="Enter claim request"
          rows={4}
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="plg-button" onClick={handleClaim} disabled={loading}>
          {loading ? "Processing..." : "Start Claim"}
        </button>
        <button
          className={`plg-button outlined ${simulateClaim ? "" : "inactive"}`}
          onClick={() => setSimulateClaim(!simulateClaim)}
        >
          Test
          {simulateClaim ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="currentColor"
            >
              <path d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="grey"
            >
              <path d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
            </svg>
          )}
        </button>
      </div>
      {claimResult && (
        <div className="result-box">
          <strong>Evaluation Result:</strong>
          <p>{claimResult}</p>
        </div>
      )}
      {minimalData && (
        <div className="result-box highlight">
          <strong>Minimal Data Extracted:</strong>
          <p>{minimalData}</p>
        </div>
      )}
    </div>
  );
}

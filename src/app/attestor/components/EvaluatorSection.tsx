import { useState } from "react";

interface EvaluatorSectionProps {
  title: string;
}

export function EvaluatorSection({ title }: EvaluatorSectionProps) {
  const [path, setPath] = useState("");
  const [data, setData] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const mockEvaluate = async () => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("Evaluation Successful. Verification confirmed.");
      }, 3000);
    });
  };

  const handleEvaluate = async () => {
    setLoading(true);
    setResult("");
    const res = await mockEvaluate();
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="input-group">
        <label>Path</label>
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="Enter path"
        />
      </div>
      <div className="input-group">
        <label>Data</label>
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Enter data (multiline)"
          rows={4}
        />
      </div>
      <button
        className="plg-button"
        onClick={handleEvaluate}
        disabled={loading}
      >
        {loading ? "Evaluating..." : "Evaluate"}
      </button>
      {result && (
        <div className="result-box">
          <strong>Evaluation Result:</strong>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

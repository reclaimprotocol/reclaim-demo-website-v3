import { useEffect, useState } from "react";
import "./index.css";
import StartVerificationButton from "../StartVerificationButton";

interface Provider {
  httpProviderId: string;
  name: string;
  description: string;
  logoUrl: string;
}

export default function SelectProviderForVerification() {
  const [query, setQuery] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchProviders = async () => {
      let isVerifiedQuery = "";
      if (!query.trim()) {
        isVerifiedQuery = "&isVerified=true";
      }
      try {
        const res = await fetch(
          `https://api.reclaimprotocol.org/api/providers/active/paginated?pageKey=0&pageSize=20&searchQuery=${encodeURIComponent(query.trim())}${isVerifiedQuery}`,
          {
            signal: abortController.signal,
          },
        );
        const data = await res.json();
        if (data.providers) {
          setProviders(data.providers);
        }
      } catch (error) {
        if (abortController.signal.aborted) return;

        console.error("Failed to fetch providers", error);
      }
    };

    const timeoutId = setTimeout(fetchProviders, 300);

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [query]);

  const handleSelect = (id: string) => {
    setQuery(id);
    setIsOpen(false);
  };

  const actionBar = (
    <div className="action-bar">
      <StartVerificationButton providerId={query.trim()} />
    </div>
  );

  return (
    <div className="provider-selector-wrapper">
      <div className={`search-container ${isOpen ? "open" : ""}`}>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Search for a data provider"
            className="input-field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            // Delay closing to allow clicking on items
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          />
        </div>

        {isOpen && (
          <div className="dropdown-overlay">
            {providers.length > 0 && (
              <div className="results-list">
                {providers.map((provider) => (
                  <div
                    key={provider.httpProviderId}
                    className="result-item"
                    onClick={() => handleSelect(provider.httpProviderId)}
                  >
                    <img
                      src={provider.logoUrl}
                      alt={provider.name}
                      className="result-icon"
                    />
                    <div className="result-info">
                      <div className="result-name">{provider.name}</div>
                      <div className="result-desc">{provider.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="action-bar-in-overlay">{actionBar}</div>
          </div>
        )}
      </div>

      {actionBar}
    </div>
  );
}

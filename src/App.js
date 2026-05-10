import "./styles.css";
import { useState, useMemo } from "react";

export default function App() {
  const [userInput, setUserInput] = useState("");
  const [dictionary, setDictionary] = useState(new Map());

  const handleAdd = () => {
    if (!userInput.trim()) return;

    const normalized = userInput.toLowerCase().trim();

    setDictionary((prev) => {
      const newMap = new Map(prev);
      const count = newMap.get(normalized) || 0;
      newMap.set(normalized, count + 1);
      return newMap;
    });

    setUserInput("");
  };

  const suggestions = useMemo(() => {
    const normalized = userInput.toLowerCase().trim();
    const entries = [...dictionary.entries()];

    const sorted = entries.sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    });

    if (!normalized) {
      return sorted.slice(0, 5);
    }

    const filtered = sorted.filter(([word]) => word.startsWith(normalized));

    return filtered.length > 0 ? filtered : sorted.slice(0, 5);
  }, [userInput, dictionary]);

  return (
    <div className="App">
      <div className="autocomplete">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a word..."
        />
        <button onClick={handleAdd}>OK</button>

        <ul className="suggestions">
          {suggestions.map(([word, count]) => (
            <li key={word} className="suggestion-item">
              <span className="word">{word}</span>
              <span className="count">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

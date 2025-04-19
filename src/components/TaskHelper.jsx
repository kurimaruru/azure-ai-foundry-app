import React, { useState } from "react";
import { useAiTask } from "../hooks/useAiTask";

export const AITaskHelper = ({filteredTasks}) => {

  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { DescriptionTaskByAi } = useAiTask(setResult, setIsLoading);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    DescriptionTaskByAi(input,filteredTasks);
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">AIタスクヘルパー</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="タスクについて質問してください..."
            className="flex-grow p-2 border rounded-l"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
            disabled={isLoading}
          >
            {isLoading ? "処理中..." : "送信"}
          </button>
        </div>
      </form>
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">AIの提案:</h3>
        <p>{result}</p>
      </div>
    </div>
  );
};

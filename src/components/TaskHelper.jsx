import React, { useState } from "react";
import axios from "axios";

export const AITaskHelper = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Azure OpenAI APIを呼び出す関数
  const callAzureOpenAI = async (prompt) => {
    setIsLoading(true);
    console.warn("####", process.env.REACT_APP_AZURE_OPENAI_ENDPOINT);
    try {
      const response = await axios.post(
        process.env.REACT_APP_AZURE_OPENAI_ENDPOINT,
        {
          messages: [
            { role: "system", content: "あなたはタスク管理の専門家です。" },
            { role: "user", content: prompt },
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_AZURE_OPENAI_KEY,
          },
        }
      );

      setResult(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Azure OpenAI API error:", error);
      setResult("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    callAzureOpenAI(input);
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

      {result && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">AIの提案:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

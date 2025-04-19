import axios from "axios";

export const useAiTask = (setResult, setIsLoading) => {
  // Azure OpenAI APIを呼び出す関数
  const DescriptionTaskByAi = async (prompt,tasks) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        process.env.REACT_APP_AZURE_OPENAI_ENDPOINT,
        {
          messages: [
            { role: "system", content: "あなたはタスク管理の専門家です。" },
            { role: "user", content: `
                あなたはタスク管理マネージャーです。
                「# ユーザーの指示」に回答する際に「# タスク一覧」をもとに回答を生成してください。
                タスク一覧が持つ情報については以下の通りになります。
                # タスク情報
                - id: タスクのIDで、タスクごとに一意になる
                - title: タスクのタイトル
                - description: タスクの詳細説明
                - dueDate: タスクの期限日
                - completed: タスクの完了状況
                
                # タスク一覧
                - ${JSON.stringify(tasks)}

                # ユーザーの指示
                ${prompt}
            ` },
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

  return { DescriptionTaskByAi };
};

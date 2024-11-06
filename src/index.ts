import { CompletionArgs, CompletionResponse } from "./types";
import { convertKeysToSnakeCase, encodeImageToBase64 } from "./utils";
import axios from "axios";
import path from "path";
import './bootstrap';

export const getCompletion = async ({
  imagePath,
  llmParams,
  model,
}: CompletionArgs): Promise<CompletionResponse> => {
  const systemPrompt = `
    Convert the following screenshot of trading history to json.
    The json should contain the following fields:
    - Assets
    - Date
    - Type
    - Amount
    - Price
    - Fee
    - Account Balance
    - Total Value
  `;

  // Default system message.
  const messages: any = [{ role: "system", content: systemPrompt }];

  // Add Image to request
  const base64Image = await encodeImageToBase64(imagePath);
  messages.push({
    role: "user",
    content: [
      {
        type: "image_url",
        image_url: { url: `data:image/png;base64,${base64Image}` },
      },
    ],
  });

  try {
    const response = await axios.post(
      `${process.env.OPENAI_BASE_URL}/chat/completions`,
      {
        messages,
        model,
        ...convertKeysToSnakeCase(llmParams ?? null),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    return {
      content: data.choices[0].message.content,
      inputTokens: data.usage.prompt_tokens,
      outputTokens: data.usage.completion_tokens,
    };
  } catch (err) {
    console.error("Error in OpenAI completion", err);
    throw err;
  }
};


const start = async () => {
  const imagePath = path.join(__dirname, './1.jpg');
  try {
    const { content, inputTokens, outputTokens } = await getCompletion({
      imagePath,
      llmParams: {},
      model: 'gpt-4o',
    });
    console.log('>>>>>>>>>>>> Content >>>>>>>>>>>>>');
    console.log(content);
  } catch(err) {
    console.error(err);
  }
}

start()
import { GoogleGenAI } from "@google/genai";
import {Config} from './config.js';
// import dotenv from "dotenv";
// dotenv.config();

const ai = new GoogleGenAI({
  apiKey: Config.APIKey 
});

export const generateCode = async (aim) => {
  const prompt = `For the following aim: "${aim}",
  1. Generate clean python code that solves the aim. Do not explain the code and do not write any comments.
  2. If the code uses input(), include meaningful prompt messages (e.g., "Enter number 1:"). After every input() call, add a print() statement to display the value that was entered. Use flush=True in all print() calls.
  3. Mark any extra print statements (used only to show input values) with a comment like # debug: show_input so I can remove them later
  4. The output should also include clear text before showing results (e.g., "The total sum is:").
  5. If the code uses input(), provide the required input values separately as an array of strings.
  6. Ensure all print statements are visible and flushed immediately using flush=True or similar techniques so that real-time prompts are visible in output.
  7. Provide a clear, small and brief algorithm/logic explanation (3-5 bullet points only) describing the approach used in the code. Directly start with bullet points and not with "Here is the logic".
  8. Respond in the following JSON format:
  {
    "code": "your generated code",
    "inputs": ["value1", "value2"], // if no input needed, return an empty array
    "algorithm": "small and brief algorithm/logic explanation in bullet points"
  }
  DO NOT include any explanation or comments outside the JSON, just the JSON.`;

  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    console.log(prompt);
    
    const cleanJSON = res.text
      .replace(/```(json)?/g, "")
      .replace(/```/g, "")
      .trim();
    
    console.log(cleanJSON);
    
    let parsed;
    try {
      parsed = JSON.parse(cleanJSON);
    } catch (err) {
      console.log("Error parsing json from ai response", err);
      throw new Error("failed to parse AI response as JSON");
    }
    
    return parsed;
  } catch (err) {
    console.error("There was an error generating code ", err);
    throw err;
  }
};

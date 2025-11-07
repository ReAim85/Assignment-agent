import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { generateCode } from "./src/generateCode.js";
import { executeCode } from "./src/executeCode.js";
import { generateScreenshot } from "./src/generateScreenshot.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.static(path.join(__dirname, "frontend/build")));

app.post("/generate", async (req, res) => {
  try {
    let { aims } = req.body;

    console.log(aims);

    if (!aims) {
      res.status(400).json({ error: "No aims provided" });
      return;
    }

    if (!Array.isArray(aims)) {
      aims = [aims];
    }

    const results = await Promise.all(
      aims.map(async (aim) => {
        const { code, inputs, algorithm } = await generateCode(aim);
        const output = await executeCode(code, inputs);
        const screenshotBase64String = await generateScreenshot(
          code,
          output,
          aim,
          algorithm  // Changed from inputs to algorithm
        );
        return {
          screenshot: screenshotBase64String,
        };
      })
    );
    res.status(200).json({ Base64: results });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
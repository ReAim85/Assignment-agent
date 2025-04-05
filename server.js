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
app.use(cors({ origin: "https://jg24nvtl-5173.inc1.devtunnels.ms" }));
app.use(express.static(path.join(__dirname, "frontend/build")));

app.post("/generate", async (req, res) => {
  try {
    const { aims } = req.body;

    if (!aims) {
      res.status(400).json({ error: "No aims provided" });
      return;
    }

    if (!Array.isArray(aims)) {
      aims = [aims];
    }

    const results = await Promise.all(
      aims.map(async (aim) => {
        const { code, inputs } = await generateCode(aim);

        console.log("Received from generateCode():", { code, inputs });

        const output = await executeCode(code, inputs);
        const screenshotPath = await generateScreenshot(
          code,
          output,
          aim,
          inputs
        );
        return {
          aim,
          code,
          output,
          screenshot: `http://localhost:5000/${screenshotPath}`,
        };
      })
    );
    res.json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

import puppeteer, { Browser } from "puppeteer";
import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

export const generateScreenshot = async (code, output, aim) => {
  const cleanedCode = code
    .split("\n")
    .filter((line) => !line.includes("# debug: show_input"))
    .join("\n");
  const htmlTemplate = `
    <html>
    <head>
      <style>
        body {
          background-color: #1e1e1e;
          font-family: 'Fira Code', monospace;
          color: #d4d4d4;
          padding: 20px;
        }
        h2 {
          color: #ffffff;
          font-size: 1.2rem;
        }
        pre {
          background: #1e1e1e;
          padding: 16px;
          border-radius: 10px;
          overflow-x: auto;
        }
        .output {
          color: #9cdcfe;
          margin-top: 12px;
        }
      </style>
    </head>
    <body>
      <h2>${aim}</h2>
      <pre><code>${cleanedCode}</code></pre>
      <div class="output">
        <strong>Output:</strong>
        <pre>${output}</pre>
      </div>
    </body>
    </html>
    `;

  const fileName = `${uuid()}.png`;
  const filePath = path.join("screenshots", fileName);

  await fs.mkdir("screenshots", { recursive: true });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlTemplate, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");
  const bodyHandle = await page.$("body");
  const boundingBox = await bodyHandle.boundingBox();
  await page.setViewport({
    width: 800,
    height: Math.ceil(boundingBox.height) + 40,
  });

  await page.screenshot({ path: filePath, fullPage: true });
  await browser.close();

  return filePath;
};

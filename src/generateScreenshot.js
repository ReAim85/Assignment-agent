import puppeteer, { Browser } from "puppeteer";

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
          background-color:rgb(255, 255, 255);
          font-family: 'Fira Code', monospace;
          color: #d4d4d4;
          padding: 20px;
        }
        h2 {
          color:rgb(0, 0, 0);
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
    <div id="container">
      <h2>${aim}</h2>
      <pre><code>${cleanedCode}</code></pre>
      <div class="output">
        <pre> <strong>Output:</strong> <br/>${output}</pre>
      </div>
      </div>
    </body>
    </html>
    `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlTemplate, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");
  const container = await page.$("#container");
  const boundingBox = await container.boundingBox();
  await page.setViewport({
    width: 800,
    height: Math.ceil(boundingBox.height) + 40,
  });

  const screenshotBase64 = await page.screenshot({ encoding: "base64" });
  await browser.close();

  return `data:image/png;base64,${screenshotBase64}`;
};

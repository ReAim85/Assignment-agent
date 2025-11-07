import puppeteer from "puppeteer";

/**
 * Escape HTML special characters so content renders correctly
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Generate screenshot of Python code, algorithm, and output
 * @param {string} code - Python code to display
 * @param {string} output - Program output
 * @param {string} aim - Assignment aim/title
 * @param {string} algorithm - Algorithm/logic explanation
 * @returns {Promise<string>} - Base64 string of screenshot
 */
export const generateScreenshot = async (code, output, aim, algorithm) => {
  // Remove debug lines
  const cleanedCode = code
    .split("\n")
    .filter((line) => !line.includes("# debug: show_input"))
    .join("\n");

  // Handle algorithm whether it's array or string
  let algorithmText;
  if (Array.isArray(algorithm)) {
    algorithmText = algorithm.map(step => `• ${step}`).join('\n');
  } else {
    algorithmText = algorithm;
  }

  // Escape HTML special chars
  const escapedCode = escapeHTML(cleanedCode);
  const escapedOutput = escapeHTML(output);
  const escapedAlgorithm = escapeHTML(algorithmText);

  // ... rest of your function remains the same

  const htmlTemplate = `
    <html>
      <head>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            background-color: #ffffff;
            font-family: 'Cascadia Code', 'Consolas', 'Courier New', monospace;
            color: #000000;
            padding: 15px;
            line-height: 1.4;
          }
          
          .container {
            background-color: #ffffff;
            padding: 15px;
            max-width: 550px;
            margin: 0 auto;
          }
          
          .aim-header {
            color: #000000;
            font-size: 15px;
            margin-bottom: 15px;
            font-weight: 700;
            text-align: center;
            padding-bottom: 10px;
            border-bottom: 2px solid #2c5aa0;
          }
          
          .section-title {
            color: #2c5aa0;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 6px;
            margin-top: 15px;
          }
          
          .algorithm-section {
            background: #f0f4ff;
            padding: 12px;
            border-left: 3px solid #2c5aa0;
            border-radius: 3px;
            margin-bottom: 15px;
          }
          
          .algorithm-content {
            color: #1a1a1a;
            font-size: 11px;
            line-height: 1.6;
            white-space: pre-wrap;
            font-family: 'Segoe UI', Arial, sans-serif;
          }
          
          .code-section {
            background: #f8f8f8;
            padding: 12px;
            border: 1px solid #e0e0e0;
            border-radius: 3px;
            margin-bottom: 15px;
          }
          
          pre {
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 11px;
          }
          
          code {
            color: #000000;
            font-family: 'Cascadia Code', 'Consolas', 'Courier New', monospace;
          }
          
          .terminal {
            background: #1e1e1e;
            padding: 12px;
            border-radius: 3px;
            border: 1px solid #3c3c3c;
          }
          
          .terminal-header {
            color: #cccccc;
            font-size: 10px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          
          .terminal-icon {
            color: #4ec9b0;
            font-weight: bold;
          }
          
          .terminal-output {
            color: #cccccc;
            font-size: 11px;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="aim-header">AIM: ${escapeHTML(aim)}</div>
          
          <div class="section-title">Algorithm / Logic:</div>
          <div class="algorithm-section">
            <div class="algorithm-content">${escapedAlgorithm}</div>
          </div>
          
          <div class="section-title">Code:</div>
          <div class="code-section">
            <pre><code>${escapedCode}</code></pre>
          </div>
          
          <div class="section-title">Output:</div>
          <div class="terminal">
            <div class="terminal-header">
              <span class="terminal-icon">›</span>
              <span>Terminal</span>
            </div>
            <div class="terminal-output">
              <pre>${escapedOutput}</pre>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlTemplate, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");

  const container = await page.$(".container");
  const boundingBox = await container.boundingBox();

  await page.setViewport({
    width: 595,  // A4 width in pixels at 72 DPI
    height: Math.ceil(boundingBox.height) + 30,
  });

  const screenshotBase64 = await page.screenshot({ 
    encoding: "base64",
    fullPage: true 
  });
  await browser.close();

  return `data:image/png;base64,${screenshotBase64}`;
};
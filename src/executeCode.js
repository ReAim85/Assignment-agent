import { spawn } from "child_process";
import fs from "fs";
import { v4 as uuid } from "uuid";
import path from "path";

export const executeCode = async (code, inputs = []) => {
  return new Promise((resolve, reject) => {
    if (!code || typeof code !== "string") {
      return reject("Code to execute is missing or not a string.");
    }
    const fileName = `temp_${uuid()}.py`;
    const filePath = path.join("./temp", fileName);

    fs.writeFileSync(filePath, code);

    const process = spawn("python", [filePath]);

    let output = "";
    let error = "";

    inputs.forEach((input) => {
      process.stdin.write(input + "\n");
    });
    process.stdin.end();

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      error += data.toString();
    });

    process.on("close", (code) => {
      fs.unlinkSync(filePath);
      if (code === 0) resolve(output.trim());
      else reject(error + output || "code execution failed");
    });
  });
};

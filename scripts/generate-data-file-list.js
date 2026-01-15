const fs = require("fs");
const path = require("path");

function getAllFiles(dirPath, arrayOfFiles = [], basePath = "") {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const relativePath = path.join(basePath, file);

    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles, relativePath);
    } else {
      arrayOfFiles.push(relativePath.replace(/\\/g, "/"));
    }
  });

  return arrayOfFiles;
}

const publicDataPath = path.join(__dirname, "..", "public", "data");
const documentationPath = path.join(publicDataPath, "documentation");

let fileList = [];

if (fs.existsSync(documentationPath)) {
  fileList = getAllFiles(documentationPath, [], "documentation");
}

const outputPath = path.join(publicDataPath, "data-file-list.json");
fs.writeFileSync(outputPath, JSON.stringify(fileList, null, 2));

console.log(`Generated data-file-list.json with ${fileList.length} files`);

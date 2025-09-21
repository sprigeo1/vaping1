// fetch_imscc.js
// Helper script to download an IMSCC file from a direct link into /uploads/

const fs = require('fs');
const https = require('https');
const path = require('path');

const url = process.argv[2]; // Pass Google Drive direct download link as argument
if (!url) {
  console.error("Usage: node fetch_imscc.js <direct_download_url>");
  process.exit(1);
}

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const filePath = path.join(uploadsDir, 'course.imscc');
const file = fs.createWriteStream(filePath);

console.log(`Downloading IMSCC file from: ${url}`);

https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to download. Status: ${res.statusCode}`);
    res.resume(); // drain response
    return;
  }
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log(`✅ Downloaded IMSCC file to ${filePath}`);
  });
}).on('error', (err) => {
  fs.unlink(filePath, () => {});
  console.error(`❌ Error: ${err.message}`);
});

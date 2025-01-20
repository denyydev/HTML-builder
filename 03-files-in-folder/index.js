const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function readSecretFolder() {
  try {
    const items = await fs.readdir(folderPath, { withFileTypes: true });

    for (const item of items) {
      if (item.isFile()) {
        const filePath = path.join(folderPath, item.name);
        const fileStats = await fs.stat(filePath);

        const fileName = path.parse(item.name).name;
        const fileExt = path.extname(item.name).slice(1);
        const fileSize = (fileStats.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
      }
    }
  } catch (err) {
    console.error('Ошибка при чтении:', err.message);
  }
}

readSecretFolder();

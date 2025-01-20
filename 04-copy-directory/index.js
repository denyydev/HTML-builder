const fs = require('fs/promises');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

const copyDir = async () => {
  try {
    await fs.rm(destDir, { recursive: true, force: true });

    await fs.mkdir(destDir, { recursive: true });

    const items = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const item of items) {
      const sourcePath = path.join(sourceDir, item.name);
      const destPath = path.join(destDir, item.name);

      if (item.isFile()) {
        await fs.copyFile(sourcePath, destPath);
      } else if (item.isDirectory()) {
        await copyNestedDir(sourcePath, destPath);
      }
    }

    console.log('Копирование завершено.');
  } catch (err) {
    console.error('Ошибка при копировании:', err.message);
  }
};

const copyNestedDir = async (sourcePath, destPath) => {
  try {
    await fs.mkdir(destPath, { recursive: true });
    const nestedItems = await fs.readdir(sourcePath, { withFileTypes: true });

    for (const nestedItem of nestedItems) {
      const nestedSourcePath = path.join(sourcePath, nestedItem.name);
      const nestedDestPath = path.join(destPath, nestedItem.name);

      if (nestedItem.isFile()) {
        await fs.copyFile(nestedSourcePath, nestedDestPath);
      } else if (nestedItem.isDirectory()) {
        await copyNestedDir(nestedSourcePath, nestedDestPath);
      }
    }
  } catch (err) {
    console.error('Ошибка при копировании вложенной папки:', err.message);
  }
};

copyDir();

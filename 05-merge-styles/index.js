const fs = require('fs/promises');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

const mergeStyles = async () => {
  try {
    await fs.mkdir(outputDir, { recursive: true });

    const items = await fs.readdir(stylesDir, { withFileTypes: true });

    const styles = [];

    for (const item of items) {
      const filePath = path.join(stylesDir, item.name);

      if (item.isFile() && path.extname(item.name) === '.css') {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        styles.push(fileContent);
      }
    }

    await fs.writeFile(outputFile, styles.join('\n'));
    console.log('Стили успешно объединены');
  } catch (err) {
    console.error('Ошибка при объединении:', err.message);
  }
};

mergeStyles();

const fs = require('fs/promises');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const stylesDir = path.join(__dirname, 'styles');
const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const assetsDir = path.join(__dirname, 'assets');
const outputAssetsDir = path.join(projectDist, 'assets');

async function buildPage() {
  try {
    await fs.rm(projectDist, { recursive: true, force: true });
    await fs.mkdir(projectDist, { recursive: true });

    await createHTML();

    await compileStyles();

    await copyAssets(assetsDir, outputAssetsDir);

    console.log('Успешно');
  } catch (err) {
    console.error('Ошибка:', err.message);
  }
}

const createHTML = async () => {
  try {
    let template = await fs.readFile(templateFile, 'utf-8');
    const componentFiles = await fs.readdir(componentsDir, {
      withFileTypes: true,
    });

    for (const file of componentFiles) {
      if (file.isFile() && path.extname(file.name) === '.html') {
        const componentName = path.basename(file.name, '.html');
        const componentContent = await fs.readFile(
          path.join(componentsDir, file.name),
          'utf-8',
        );
        const regex = new RegExp(`{{\\s*${componentName}\\s*}}`, 'g');
        template = template.replace(regex, componentContent);
      }
    }

    await fs.writeFile(path.join(projectDist, 'index.html'), template);
  } catch (err) {
    console.error('Ошибка при создании index.html:', err.message);
  }
};

const compileStyles = async () => {
  try {
    const styleFiles = await fs.readdir(stylesDir, { withFileTypes: true });
    const styles = [];

    for (const file of styleFiles) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const styleContent = await fs.readFile(
          path.join(stylesDir, file.name),
          'utf-8',
        );
        styles.push(styleContent);
      }
    }

    await fs.writeFile(path.join(projectDist, 'style.css'), styles.join('\n'));
  } catch (err) {
    console.error('Ошибка при компиляции стилей:', err.message);
  }
};

const copyAssets = async (src, dest) => {
  try {
    await fs.mkdir(dest, { recursive: true });
    const items = await fs.readdir(src, { withFileTypes: true });

    for (const item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isFile()) {
        await fs.copyFile(srcPath, destPath);
      } else if (item.isDirectory()) {
        await copyAssets(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error('Ошибка при копировании папки assets:', err.message);
  }
};

buildPage();

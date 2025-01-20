const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const filePath = path.join(__dirname, 'output.txt');

const writableStream = fs.createWriteStream(filePath, { flags: 'a' });

stdout.write(
  'Введите текст для записи в файл. Для выхода введите "exit" или нажмите Ctrl+C.\n',
);

stdin.on('data', (data) => {
  const input = data.toString().trim();
  if (input.toLowerCase() === 'exit') {
    sayGoodbye();
  } else {
    writableStream.write(`${input}\n`, (err) => {
      if (err) {
        console.error('Ошибка при записи в файл:', err);
      } else {
        stdout.write('Текст успешно записан.');
      }
    });
  }
});

process.on('SIGINT', sayGoodbye);

function sayGoodbye() {
  stdout.write('Спасибо и удачи! <3 !\n');
  writableStream.end();
  exit();
}

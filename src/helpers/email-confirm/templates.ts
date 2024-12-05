import * as fs from 'fs';
import * as path from 'path';
import { portalUrl } from 'src/config';

export function getConfirmTemplate(confirmationLink: string): string {
    console.log(confirmationLink)
  const templatePath = path.join(__dirname, './../../../public/confirm.html');
  console.log(templatePath)

  const template = fs.readFileSync(templatePath, 'utf-8');
  console.log(template)


  // Заменяем динамические данные
  return template
    .replace('{{confirmation_link}}', confirmationLink)
    .replace('{{year}}', new Date().getFullYear().toString());
}
// D:\NodeJs\Oauth\src\helpers\email-confirm\templates\confirm.html


export function getSuccessConfirmPage(): string {
  var html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Подтверждение аккаунта</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          text-align: center;
        }
        .container {
          max-width: 600px;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        h1 {
          color: #4CAF50;
          margin-bottom: 20px;
        }
        p {
          color: #555555;
          margin-bottom: 30px;
          font-size: 18px;
        }
        .button {
          display: inline-block;
          padding: 15px 30px;
          font-size: 16px;
          color: #ffffff;
          background-color: #4CAF50;
          text-decoration: none;
          border-radius: 5px;
        }
        .button:hover {
          background-color: #45a049;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Аккаунт успешно подтверждён!</h1>
        <p>Спасибо за подтверждение вашего аккаунта. Теперь вы можете пользоваться всеми функциями нашего сервиса.</p>
        <a href="{{main_page}}" class="button">Перейти на главную</a>
      </div>
    </body>
    </html>
  `;

  return html
  .replace('{{main_page}}', portalUrl)
}
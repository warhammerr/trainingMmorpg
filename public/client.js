const SERVER_URL = 'http://localhost:8080';

// Создаем текст сообщений для событий
// TODO заменить хотя бы на ES6 string literal
const strings = {
    'connected': '[sys][time]%time%[/time]: Вы успешно соединились к сервером как [user]%name%[/user].[/sys]',
    'userJoined': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] присоединился к чату.[/sys]',
    'messageSent': '[out][time]%time%[/time]: [user]%name%[/user]: %text%[/out]',
    'messageReceived': '[in][time]%time%[/time]: [user]%name%[/user]: %text%[/in]',
    'userSplit': '[sys][time]%time%[/time]: Пользователь [user]%name%[/user] покинул чат.[/sys]'
};
window.onload = function () {

    const socket = io.connect(SERVER_URL);

    socket.on('connect', function () {

        socket.on('message', function (msg) {
            // Добавляем в лог сообщение, заменив время, имя и текст на полученные
            document.querySelector('#log').innerHTML += strings[msg.event].replace(/\[([a-z]+)\]/g, '<span class="$1">').replace(/\[\/[a-z]+\]/g, '</span>').replace(/\%time\%/, msg.time).replace(/\%name\%/, msg.name).replace(/\%text\%/, unescape(msg.text).replace('<', '&lt;').replace('>', '&gt;')) + '<br>';
            // Прокручиваем лог в конец
            document.querySelector('#log').scrollTop = document.querySelector('#log').scrollHeight;
        });
        // При нажатии <Enter> или кнопки отправляем текст

        document.querySelector('#input').onkeypress = function (e) {
            if (e.key === "Enter") {
                sendMessage();
            }
        };

        document.querySelector('#send').onclick = function () {
            sendMessage();
        };

        function sendMessage() {
            // TODO найти, придумать sanitizer. Нужен ли он?
            const message = document.querySelector('#input').value;
            socket.send(message);
            document.querySelector('#input').value = '';
        }
    });
};
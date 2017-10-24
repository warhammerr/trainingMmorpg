const io = require('socket.io')(8080);

io.on('connection', handler);

function handler(socket) {
  // Т.к. чат простой - в качестве ников пока используем первые 5 символов от ID сокета
  const ID = (socket.id).toString().substr(0, 5);
  const time = (new Date).toLocaleTimeString();
  // Посылаем клиенту сообщение о том, что он успешно подключился и его имя
  socket.send({'event': 'connected', 'name': ID, 'time': time});
  // Посылаем всем остальным пользователям, что подключился новый клиент и его имя
  socket.broadcast.send({'event': 'userJoined', 'name': ID, 'time': time});
  // Навешиваем обработчик на входящее сообщение
  socket.on('message', function (msg) {
    const time = (new Date).toLocaleTimeString();
    // Уведомляем клиента, что его сообщение успешно дошло до сервера
    socket.send({'event': 'messageSent', 'name': ID, 'text': msg, 'time': time});
    // Отсылаем сообщение остальным участникам чата
    socket.broadcast.send({'event': 'messageReceived', 'name': ID, 'text': msg, 'time': time})
  });
  // При отключении клиента - уведомляем остальных
  socket.on('disconnect', function() {
    const time = (new Date).toLocaleTimeString();
    io.sockets.send({'event': 'userSplit', 'name': ID, 'time': time});
  });
}

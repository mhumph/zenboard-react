import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3001');
function onBoardRefresh(cb) {
  console.log('Board refreshed')
  socket.on('boardRefresh', board => cb(board));
}
export { onBoardRefresh };
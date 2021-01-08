const app = require('../src/app')
const http = require('http')

const port = normalizePort(process.env.PORT || '21045')
app.set('port', port)

const server = http.createServer(app)

server.listen(port)
server.on('error', onError)
console.log('API rodando ...')
console.log('Versão 2.0')

function normalizePort(val) {
    const port = parseInt(val, 10)

    if (isNaN(port))
        return val;

    if (port >= 0)
        return port

    return false
}

function onError(error) {
    if (error.syscall !== 'listen')
        throw error

    const bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requer privilégios elevados')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' já está em uso')
            process.exit(1)
            break
        default:
            throw error
    }
}

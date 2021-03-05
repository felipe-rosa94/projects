const app = require('../src/app')
const https = require('http')
const fs = require('fs')

/*
let privateKey = fs.readFileSync('C:/projects/trunk/certificate.key')
let certificate = fs.readFileSync('C:/projects/trunk/certificate.crt')

let privateKey = fs.readFileSync('/home/whiledev/apps_nodejs/certificate.key')
let certificate = fs.readFileSync('/home/whiledev/apps_nodejs/certificate.crt')
const credentials = {key: privateKey, cert: certificate}
*/

const httpsPort = normalizePort(process.env.PORT || '21045')
app.set('port', httpsPort)

const httpsServer = https.createServer(app)
httpsServer.listen(httpsPort)
httpsServer.on('error', onError)

console.log('API rodando ...')

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

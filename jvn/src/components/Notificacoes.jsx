import React from 'react'
import {Button, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText} from '@material-ui/core/'
import firebase from '../firebase'
import usuario from '../usuario.json'
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#000000'
        }
    },
})

class Notificacoes extends React.Component {

    state = {
        open: false
    }

    onClick = () => {
        this.setState({open: false})
        this.permissao()
    }

    closeDialog = () => {
        localStorage.setItem('jvn:token', 10)
        this.setState({open: false})
    }

    permissao = async () => {
        try {
            const messaging = firebase.messaging()
            await messaging.requestPermission()
            const token = await messaging.getToken()
            this.token(token)
            return token
        } catch (error) {
            localStorage.setItem('jvn:token', 'bloqueou')
            console.error(error)
        }
    }

    token = (token) => {
        let tokenOld = localStorage.getItem('jvn:token')
        if (token !== tokenOld) {
            let key = this.key()
            let json = {
                key: key,
                token: token
            }
            firebase.database().ref('tokens/' + key).set(json)
        }
        localStorage.setItem('jvn:token', token)
    }

    key = () => {
        var hora = new Date()
        return hora.getTime()
    }

    autenticacao = () => {
        firebase.auth().signInWithEmailAndPassword(usuario.email, usuario.senha)
    }

    verificaToken = () => {
        let token = localStorage.getItem(`jvn:token`)
        if (token === null || token === 'novamente') {
            this.setState({open: true})
        } else {
            token = parseInt(localStorage.getItem(`jvn:token`))
            if (Number.isInteger(token)) {
                if (--token <= 0) {
                    localStorage.setItem(`jvn:token`, 'novamente')
                    return
                } else {
                    localStorage.setItem('jvn:token', token)
                }
            }
        }
    }

    componentDidMount() {
        this.autenticacao()
        this.verificaToken()
    }

    render() {
        const {open} = this.state
        return (
            <MuiThemeProvider theme={theme}>
                <div>
                    <Dialog open={open} onClose={this.closeDialog} aria-labelledby="form-dialog-title">
                        <DialogContent>
                            <DialogTitle>Notificações</DialogTitle>
                            <DialogContentText>Ative as notificações para saber cada novidade, prometemos não ficar
                                sendo
                                chatões.</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeDialog} color="primary">Não</Button>
                            <Button onClick={this.onClick} color="primary">Sim</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Notificacoes
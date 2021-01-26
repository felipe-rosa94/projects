import React from 'react'
import { withRouter } from 'react-router-dom'
import { CardMedia, FormLabel, CircularProgress } from '@material-ui/core/'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

import firebase from '../firebase'

import '../styles/listapodcasts.css'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#1e1e1e'
        }
    },
})

class ListaPodcasts extends React.Component {

    state = {
        podcasts: [],
        progress: true
    }

    onClick = (obj) => {
        this.props.history.push({ pathname: '/podcast', state: { obj: obj } })
    }

    podcasts = (limite) => {
        const { home } = this.props
        let context = this

        let dados = localStorage.getItem(`insert:podcasts`)
        dados = dados !== null ? JSON.parse(dados) : ''

        if (dados !== '') {
            context.listar(dados, limite, home)
        }

        firebase
            .database()
            .ref('Podcasts/')
            .once('value')
            .then(function (snapshot) {
                if (snapshot.val() !== null) {
                    dados = Object.values(snapshot.val())
                    localStorage.setItem(`insert:podcasts`, JSON.stringify(dados))
                    context.listar(dados, limite, home)
                }
            })
    }

    listar = (dados, limite, home) => {
        dados = dados.reverse()
        if (limite && home) {
            dados = dados.splice(0, 2)
            this.setState({ progress: false, podcasts: dados })
        } else {
            this.setState({ progress: false, podcasts: dados })
        }
    }

    componentDidMount() {
        this.podcasts(true)
    }

    render() {
        const { podcasts, progress } = this.state
        const { home } = this.props
        return (
            <div id="lista-podcasts">
                {
                    progress &&
                    <div id="progress">
                        <MuiThemeProvider theme={theme}>
                            <CircularProgress />
                        </MuiThemeProvider>
                    </div>
                }
                <div id="main-podcasts" style={home ? { marginBottom: 8 } : { marginBottom: 100 }}>
                    {
                        podcasts.map((i, index) => {
                            return (
                                <div className="card-podcast" key={index}>
                                    <CardMedia id="card-image" image={i.imagem} alt="" onClick={() => this.onClick(i)} />
                                    <div id="card-descricoes">
                                        <div id="titulo-compartilhar">
                                            <FormLabel id="card-titulo" onClick={() => this.onClick(i)}>{i.titulo}</FormLabel>                                            
                                        </div>
                                        <FormLabel style={{ color: 'white' }} id="card-descricao" onClick={() => this.onClick(i)}>{i.descricao}</FormLabel>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>                
            </div>
        )
    }
}

export default withRouter(ListaPodcasts)
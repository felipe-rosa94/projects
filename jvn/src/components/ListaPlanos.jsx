import React from 'react'
import { withRouter } from 'react-router-dom'
import { CardMedia, FormLabel, CircularProgress } from '@material-ui/core/'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

import firebase from '../firebase'

import '../styles/listaplanos.css'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#1e1e1e'
        }
    },
})

class ListaPlanos extends React.Component {

    state = {
        planos: [],
        progress: true
    }

    onClick = dados => {
        this.props.history.push({ pathname: '/plano', state: { dados: dados } })
    }

    planos = limite => {
        const { home } = this.props
        let context = this

        let dados = localStorage.getItem(`insert:plano`)
        dados = dados !== null ? JSON.parse(dados) : ''

        if (dados !== '') {
            context.listar(dados, limite, home)
        }

        firebase
            .database()
            .ref('Planos/')
            .once('value')
            .then(function (snapshot) {
                if (snapshot.val() !== null) {
                    dados = Object.values(snapshot.val())
                    localStorage.setItem(`insert:plano`, JSON.stringify(dados))
                    context.listar(dados, limite, home)
                }
            })
    }

    listar = (dados, limite, home) => {
        dados = dados.reverse()
        if (limite && home) {
            dados = dados.splice(0, 2)
            this.setState({ progress: false, planos: dados })
        } else {
            this.setState({ progress: false, planos: dados })
        }
    }

    componentDidMount() {
        this.planos(true)
    }

    render() {
        const { planos, progress } = this.state
        const { home } = this.props
        return (
            <div id="lista-planos">
                {
                    progress &&
                    <div id="progress">
                        <MuiThemeProvider theme={theme}>
                            <CircularProgress />
                        </MuiThemeProvider>
                    </div>
                }
                <div id="main-planos" style={home ? { marginBottom: 8 } : { marginBottom: 100 }}>
                    {
                        planos.map((i, index) => {
                            return (
                                <div className="card-plano" key={index} onClick={() => this.onClick(i)}>
                                    <CardMedia id="card-image" image={i.imagem} alt=""/>
                                    <div id="card-descricoes">
                                        <div id="titulo-compartilhar">
                                            <FormLabel id="card-titulo">{i.titulo}</FormLabel>                                            
                                        </div>
                                        <FormLabel style={{ color: 'white' }} id="card-descricao">{i.descricao}</FormLabel>
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

export default withRouter(ListaPlanos)
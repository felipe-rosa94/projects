import React from 'react'
import { withRouter } from 'react-router-dom'
import { CardMedia, FormLabel } from '@material-ui/core'
import firebase from '../firebase'
import { isMobile } from "react-device-detect"
import '../styles/listadevocionais.css'


class ListaDevocionais extends React.Component {

    state = {
        devocionais: []
    }


    onClick = obj => {
        this.props.history.push({ pathname: '/devocional', state: { obj: obj } })
    }

    devocionais = () => {

        const { home } = this.props
        let context = this
        let dados = localStorage.getItem(`insert:devocionais`)
        dados = dados !== null ? JSON.parse(dados) : ''

        if (dados !== '') {
            context.listar(dados, home)
        }

        firebase
            .database()
            .ref('Devocional/')
            .once('value')
            .then(function (snapshot) {
                if (snapshot.val() !== null) {
                    dados = Object.values(snapshot.val())
                    localStorage.setItem(`insert:devocionais`, JSON.stringify(dados))
                    context.listar(dados, home)
                }
            })
    }

    listar = (dados, home) => {
        dados = dados.reverse()

        if (home) {
            let limite = isMobile ? 4 : 2
            dados = dados.splice(0, limite)
            this.setState({ devocionais: dados })
        } else {
            this.setState({ devocionais: dados })
        }
    }

    componentDidMount() {
        this.devocionais()
    }

    render() {
        const { devocionais } = this.state
        const { home } = this.props
        if (!home) {
            return (
                <div id="devocionais">
                    <div id="main-devocionais">
                        {
                            devocionais.map((i, index) => {
                                return (
                                    <div className="card-devocionais" key={index} onClick={() => this.onClick(i)}>
                                        <CardMedia id="card-image-devocionais" image={i.imagem} alt="" />
                                        <div id="card-descricoes-devocionais">
                                            <FormLabel id="card-descricao-devocionais">{i.titulo}</FormLabel>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )
        } else {
            return (
                <div id="devocionais">
                    <div id="main-devocionais-home">
                        {
                            devocionais.map((i, index) => {
                                return (
                                    <div className="card-devocionais-home" key={index} onClick={() => this.onClick(i)}>
                                        <CardMedia id="card-image-devocionais-home" image={i.imagem} alt="" />
                                        <div id="card-descricoes-devocionais-home">
                                            <FormLabel id="card-descricao-devocionais-home">{i.titulo}</FormLabel>
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
}

export default withRouter(ListaDevocionais)
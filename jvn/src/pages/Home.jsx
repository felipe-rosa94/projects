import React from 'react'
import {withRouter} from 'react-router-dom'
import Toolbar from '../components/Toolbar'
import ListaPodcasts from '../components/ListaPodcasts'
import ListaDevocionais from '../components/ListaDevocionais'
import Notificacoes from '../components/Notificacoes'
import MenuInferior from '../components/MenuInferior'
import {CardMedia, FormLabel} from '@material-ui/core'
import {isSafari} from "react-device-detect"
import retiro from '../imagens/retiro.png'
import '../styles/home.css'

class Home extends React.Component {

    render() {
        return (
            <div id="home">
                <Toolbar buttonBack={false}/>
                <div id="div-retiro" onClick={() => this.props.history.push('/inscricoes')}>
                    <FormLabel id="titulo-retiro">Retiro</FormLabel>
                    <CardMedia id="logo-retiro" image={retiro}/>
                </div>
                <div id="div-home">
                    <FormLabel id="titulo-home">Podcasts</FormLabel>
                    <ListaPodcasts home={true}/>
                </div>
                <div id="div-home">
                    <FormLabel id="titulo-home">Devocionais</FormLabel>
                    <ListaDevocionais home={true}/>
                </div>
                <div id="div-home">
                    <FormLabel id="version">Versão 1.5</FormLabel>
                </div>
                {
                    !isSafari &&
                    <Notificacoes/>
                }
                <MenuInferior pagina="home"/>
            </div>
        )
    }
}

export default withRouter(Home)

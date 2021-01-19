import React from 'react'
import Section from '../components/Section'
import Footer from '../components/Footer'
import '../style/home.css'
import {Button, CardMedia, Dialog, FormLabel, TextField} from '@material-ui/core'
import {Add, Remove} from '@material-ui/icons'

class Home extends React.Component {

    state = {
        openSacola: false,
        produto: {},
        quantidade: 1
    }

    handleProduto = objeto =>
        this.setState({produto: objeto, openSacola: true})

    handleQtd = e => {
        if (e.target.value !== '' && parseInt(e.target.value) > 0) {
            this.setState({quantidade: parseInt(e.target.value)})
        }
    }

    adicionaCarrinho = () => {
        const {produto, quantidade} = this.state
        this.props.history.push({pathname: '/carrinho', state: {produto: produto, quantidade: quantidade}})
    }

    adicionaQuantidade = () => {
        let {quantidade} = this.state
        this.setState({quantidade: ++quantidade})
    }

    removeQuantidade = () => {
        let {quantidade} = this.state
        this.setState({quantidade: (quantidade !== 1) ? --quantidade : quantidade})
    }

    render() {
        const {openSacola, produto: {descricao, grupo, id, imagem, nome, observacao, preco}, quantidade} = this.state
        return (
            <div id="home">

                <Section handleChange={this.handleProduto.bind(this)}/>
                <Footer/>

                <Dialog open={openSacola} aria-labelledby="form-dialog-title"
                        onClose={() => this.setState({openSacola: false})}>
                    <div id="div-dialog">

                        <div id="div-imagens">
                            <div id="div-imagem-principal">
                                <CardMedia image={imagem} id="img-dialog-produto"/>
                            </div>
                            <div id="div-imagens-secundarias">

                            </div>
                        </div>

                        <div id="div-descricoes">
                            <div id="div-descritivos">
                                <FormLabel id="dialog-nome">{nome}</FormLabel>
                                <FormLabel id="dialog-descricao">{descricao}</FormLabel>
                                {observacao && <FormLabel id="dialog-observacao">{observacao}</FormLabel>}
                                <FormLabel id="dialog-preco">{parseFloat(preco * quantidade).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}</FormLabel>
                            </div>
                            <div id="div-botao">
                                <div id="div-quantidade">
                                    <div id="div-mais">
                                        <Add id="icones" onClick={this.adicionaQuantidade}/>
                                    </div>
                                    <div id="div-qtd">
                                        <input id="label-qtd" type="number"
                                               value={quantidade} name="quantidade" onChange={this.handleQtd}/>
                                    </div>
                                    <div id="div-menos">
                                        <Remove id="icones" onClick={this.removeQuantidade}/>
                                    </div>
                                </div>
                                <div id="div-comprar" onClick={this.adicionaCarrinho}>
                                    <div id="botao-comprar">
                                        Comprar
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </Dialog>

            </div>
        )
    }
}

export default Home

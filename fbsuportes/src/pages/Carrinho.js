import React from 'react'
import {AppBar, Button, CardMedia, FormLabel, Toolbar, TextField} from '@material-ui/core'
import {Add, Remove} from '@material-ui/icons'
import logo from '../images/logo.png'
import '../style/header.css'
import '../style/carrinho.css'

class Carrinho extends React.Component {

    state = {
        openCadastro: false,
        produto: {},
        quantidade: 1
    }

    handleQtd = e => {
        if (e.target.value !== '' && parseInt(e.target.value) > 0) {
            this.setState({quantidade: parseInt(e.target.value)})
        }
    }

    adicionaQuantidade = () => {
        let {quantidade} = this.state
        this.setState({quantidade: ++quantidade})
    }

    removeQuantidade = () => {
        let {quantidade} = this.state
        this.setState({quantidade: (quantidade !== 1) ? --quantidade : quantidade})
    }

    onClickScroll = id => {
        this.props.history.replace({pathname: '/'})
        setTimeout(function () {
            this.setState({drawer: false})
            let target = document.getElementById(id)
            this.scroll(target.offsetTop, 0)
        }.bind(this), 100)
    }

    scroll = (to, time) => {
        let elem = document.scrollingElement || document.documentElement
        let style = 'scrollTop'
        let unit = ''
        let from = window.scrollY
        let prop = true
        to -= 150

        if (!elem) return

        var start = new Date().getTime(),
            timer = setInterval(function () {
                var step = Math.min(1, (new Date().getTime() - start) / time)
                if (prop) {
                    elem[style] = (from + step * (to - from)) + unit
                } else {
                    elem.style[style] = (from + step * (to - from)) + unit
                }
                if (step === 1) {
                    clearInterval(timer)
                }
            }, 25)
        if (prop) {
            elem[style] = from + unit
        } else {
            elem.style[style] = from + unit
        }
    }

    componentDidMount() {
        const {produto, quantidade} = this.props.location.state
        this.setState({produto: produto, quantidade: quantidade})
    }

    render() {

        const {produto: {nome, preco, imagem}, quantidade} = this.state
        console.log(nome)
        return (
            <section id="carrinho">
                <AppBar
                    id="appBar"
                    color="default">
                    <Toolbar id="toolbar" variant="dense">
                        <div id="main-toolbar">
                            <div id="toolbar-left">
                                <CardMedia id="img-logo" image={logo}/>
                            </div>
                            <div id="toolbar-center">
                                <Button id="button-menu"
                                        onClick={() => this.onClickScroll('section-produtos')}>Produtos</Button>
                                <Button id="button-menu">Minha Conta</Button>
                                <Button id="button-menu" onClick={() => this.onClickScroll('footer')}>Contato</Button>
                            </div>
                            <div id="toolbar-right">

                            </div>
                        </div>
                    </Toolbar>
                </AppBar>

                <section id="carrinho-body">

                    <section id="main-detalhes">

                        <div id="div-produto">
                            <div id="barra-titulo">
                                <FormLabel id="label-barra">Produto</FormLabel>
                            </div>
                            <div id="div-descricoes-produto">
                                <div id="div-imagem-produto">
                                    <CardMedia image={imagem} id="imagem-produto"/>
                                </div>
                                <div id="div-label-nome-produto">
                                    <FormLabel id="label-nome-produto">{nome}</FormLabel>
                                </div>
                            </div>
                        </div>

                        <div id="div-preco-unitario">
                            <div id="barra-titulo">
                                <FormLabel id="label-barra">Preço unitário</FormLabel>
                            </div>
                            <div id="div-descricoes">
                                <FormLabel id="label-preco-produto">{parseFloat(preco).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}</FormLabel>
                            </div>
                        </div>

                        <div id="div-quantidade-barra">
                            <div id="barra-titulo">
                                <FormLabel id="label-barra">Quantidade</FormLabel>
                            </div>
                            <div id="div-descricoes">
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
                            </div>
                        </div>

                        <div id="div-subtotal">
                            <div id="barra-titulo">
                                <FormLabel id="label-barra">SubTotal</FormLabel>
                            </div>
                            <div id="div-descricoes">
                                <FormLabel
                                    id="label-preco-produto">{(parseFloat(preco) * quantidade).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}</FormLabel>
                            </div>
                        </div>

                    </section>

                    <section id="main-obs">
                        <div id="div-cep">
                            <div id="div-label-cep">
                                <TextField id="input-cep" label="CEP" variant="outlined"/>
                                <Button id="botao-verificar">Ok</Button>
                            </div>
                            <div id="div-resultados-cep">

                            </div>
                        </div>
                        <div id="div-cupom">
                            <div id="div-label-cupom">

                            </div>
                        </div>
                    </section>

                </section>

            </section>
        )
    }
}

export default Carrinho

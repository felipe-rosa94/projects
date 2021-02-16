import React from 'react'
import Section from '../components/Section'
import Footer from '../components/Footer'
import '../style/home.css'
import {CardMedia, Dialog, DialogContent, FormLabel} from '@material-ui/core'
import {Add, Remove, CheckCircle} from '@material-ui/icons'
import {hideData, showData} from '../util'

class Home extends React.Component {

    state = {
        openSacola: false,
        openCompra: false,
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
        let produtos = showData(localStorage.getItem(`fb:itens`))
        produtos = (produtos !== undefined) ? produtos : []
        produtos.push({produto: produto, quantidade: quantidade})
        localStorage.setItem(`fb:itens`, hideData(produtos))
        this.props.history.push({pathname: '/carrinho'})
    }

    adicionaQuantidade = () => {
        let {quantidade} = this.state
        this.setState({quantidade: ++quantidade})
    }

    removeQuantidade = () => {
        let {quantidade} = this.state
        this.setState({quantidade: (quantidade !== 1) ? --quantidade : quantidade})
    }

    compraAprovada = () => {
        let compra = sessionStorage.getItem(`fb:compraAprovada`)
        if (compra) {
            this.setState({openCompra: true})
        }
    }

    fecharCompra = () => {
        this.setState({openCompra: false})
        sessionStorage.removeItem(`fb:compraAprovada`)
    }

    componentDidMount() {
        this.compraAprovada()
    }

    render() {
        const {openSacola, openCompra, produto: {descricao, imagem, nome, observacao, preco}, quantidade} = this.state
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

                        <div id="div-descricoes-dialog">
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

                <Dialog open={openCompra} onClose={this.fecharCompra}>
                    <DialogContent id="dialog-content-compra">

                        <CheckCircle id="img-check"/>

                        <div id="div-dialog-compra">
                            <FormLabel id="label-compra">Pagamento realizado com sucesso</FormLabel>
                            <FormLabel id="label-descricao-compra">
                                Seu pedido foi enviado e está sendo preparado, caso queira contatar o vendendor
                                para combinar a entrega pode entrar em contato por telefone ou WhatsApp pelo número
                                <strong id="link-whats">
                                    <a id="link-whats" href="https://api.whatsapp.com/send?phone=5551995983880">
                                        (51) 99598-3880
                                    </a>
                                </strong>
                                ou por e-mail fabio@fbsuportes.com.br, você pode acompanhar sua compra acessando Meus
                                Pedido, no menu.
                            </FormLabel>
                        </div>

                    </DialogContent>
                </Dialog>

            </div>
        )
    }
}

export default Home

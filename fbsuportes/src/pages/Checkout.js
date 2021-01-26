import React from "react"
import {
    AppBar,
    Button,
    Box,
    CardMedia,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Toolbar,
    FormLabel, Divider
} from '@material-ui/core'
import logo from '../images/logo.png'
import '../style/checkout.css'
import {showData} from '../util'

class Checkout extends React.Component {

    state = {
        itens: [],
        cupom: 1,
        openCadastro: false,
        email: '',
        senha: '',
        repetirSenha: '',
        nome: '',
        telefone: ''
    }

    inputs = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    itens = () => {
        let itens = showData(localStorage.getItem(`fb:itens`))
        this.setState({itens: itens !== undefined ? itens : []})
    }

    pagina = pagina => {
        this.props.history.push({pathname: pagina})
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

    mcc = v => {
        v = v.replace(/\D/g, "");
        v = v.replace(/(\d{4})/g, "$1.");
        v = v.replace(/\.$/, "");
        v = v.substring(0, 19)
        return v;
    }

    total = () => {
        const {itens, desconto} = this.state
        let total = 0
        itens.forEach(i => {
            const {produto: {preco}, quantidade} = i
            total += (parseFloat(preco) * quantidade)
        })
        return (total * desconto).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    }

    cupom = () => {
        let desconto = showData(localStorage.getItem(`desconto`))
        this.setState({desconto: desconto !== undefined ? desconto : 1})
    }

    cadastrar = () => {

    }

    componentDidMount() {
        this.cupom()
        this.itens()
    }

    render() {
        const {itens, desconto, openCadastro} = this.state
        return (
            <div id="checkout">
                <AppBar
                    id="appBar"
                    color="default">
                    <Toolbar id="toolbar" variant="dense">
                        <div id="main-toolbar">
                            <div id="toolbar-left">
                                <CardMedia id="img-logo" image={logo} onClick={() => this.pagina('/')}/>
                            </div>
                            <div id="toolbar-center">
                                <Button id="button-menu"
                                        onClick={() => this.onClickScroll('section-produtos')}>Produtos</Button>
                                <Button id="button-menu">Minha Conta</Button>
                                <Button id="button-menu" onClick={() => this.onClickScroll('footer')}>Contato</Button>
                                <Button id="button-menu" onClick={() => this.pagina('/carrinho')}>Carrinho</Button>
                            </div>
                            <div id="toolbar-right">

                            </div>
                        </div>
                    </Toolbar>
                </AppBar>

                <section id="main-checkout">


                    <div id="div-itens">
                        {
                            itens.map((i, index) => {
                                const {produto: {nome, preco}, quantidade} = i

                                return (
                                    <div id="div-detalhes-checkout" style={index ? {marginTop: 0} : {}}>

                                        <div id="div-detalhes">
                                            <div id="div-barra-detalhes-checkout"
                                                 style={index ? {display: 'none'} : {}}>
                                                Produto
                                            </div>
                                            <div id="div-nome-qtd-preco">
                                                <FormLabel id="label-detalhe">{nome}</FormLabel>
                                            </div>
                                        </div>

                                        <div id="div-detalhes">
                                            <div id="div-barra-detalhes-checkout"
                                                 style={index ? {display: 'none'} : {}}>
                                                Quantidade
                                            </div>
                                            <div id="div-nome-qtd-preco">
                                                <FormLabel id="label-detalhe">{quantidade}</FormLabel>
                                            </div>
                                        </div>

                                        <div id="div-detalhes">
                                            <div id="div-barra-detalhes-checkout"
                                                 style={index ? {display: 'none'} : {}}>
                                                Preço
                                            </div>
                                            <div id="div-nome-qtd-preco">
                                                <FormLabel
                                                    id="label-detalhe">{(parseFloat(preco) * quantidade).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                })}</FormLabel>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <div id="div-total-detalhes">
                            <div>
                                <FormLabel id="label-total-checkout">Total :</FormLabel>
                                <FormLabel id="label-total-valor-checkout">{this.total()}</FormLabel>
                            </div>
                            {
                                desconto !== 1 &&
                                <div>
                                    <FormLabel id="label-total-checkout">Desconto 10%</FormLabel>
                                </div>
                            }
                        </div>
                    </div>

                    <div id="div-dados-checkout">
                        <div id="div-login-entrega-cartao">
                            <div id="div-barra-checkout">
                                Login
                            </div>
                            <div id="div-login">
                                <TextField id="input-cep" name="email" label="E-mail" variant="outlined"/>
                            </div>

                            <div id="div-login">
                                <TextField id="input-cep" name="senha" label="Senha" variant="outlined"/>
                            </div>

                            <div id="div-login">
                                <Button onClick={this.cadastrar}>Login</Button>
                            </div>

                            <div id="div-login">
                                <Button onClick={() => this.setState({openCadastro: true})}>Cadastrar</Button>
                            </div>

                        </div>

                        <div id="div-login-entrega-cartao">
                            <div id="div-barra-checkout">
                                Entrega
                            </div>

                            <div id="div-login">
                                <TextField id="input-cep" name="email" label="CEP" variant="outlined"/>
                            </div>

                        </div>

                        <div id="div-login-entrega-cartao">
                            <div id="div-barra-checkout">
                                Cartão
                            </div>

                            <div id="div-cartao">
                                <Box p={1}/>
                                <TextField id="input-cep" fullWidth name="email" label="Nome titular"
                                           variant="outlined"/>
                                <Box p={1}/>
                            </div>

                            <div id="div-cartao">
                                <Box p={1}/>
                                <TextField id="input-cep" fullWidth name="email" label="Nº do cartão"
                                           variant="outlined"/>
                                <Box p={1}/>
                            </div>

                            <div id="div-cartao">
                                <Box p={1}/>
                                <TextField id="input-cep" name="email" label="Validade" variant="outlined"/>
                                <Box p={1}/>
                                <TextField id="input-cep" name="email" label="CCV" variant="outlined"/>
                                <Box p={1}/>
                            </div>

                            <div id="div-cartao">
                                <div id="div-pagar">
                                    Pagar
                                </div>
                            </div>
                        </div>

                    </div>

                </section>

                <Dialog open={openCadastro} aria-labelledby="form-dialog-title"
                        onClose={() => this.setState({openCadastro: false})}>
                    <DialogTitle id="form-dialog-title">Cadastro</DialogTitle>
                    <DialogContent>

                        <div id="div-cadastro">
                            <TextField fullWidth={true} name="email" onChange={this.inputs} label="E-mail"
                                       variant="outlined"/>
                        </div>

                        <div id="div-cadastro">
                            <TextField fullWidth={true} name="senha" onChange={this.inputs} label="Senha"
                                       variant="outlined"/>
                            <Box p={1}/>
                            <TextField fullWidth={true} name="repetirSenha" onChange={this.inputs} label="Repetir senha"
                                       variant="outlined"/>
                        </div>

                        <Divider/>

                        <div id="div-cadastro">
                            <TextField fullWidth={true} name="nome" onChange={this.inputs} label="Nome"
                                       variant="outlined"/>
                        </div>

                        <div id="div-cadastro">
                            <TextField fullWidth={true} name="telefone" onChange={this.inputs} label="Telefone"
                                       variant="outlined"/>
                        </div>

                        <div id="div-cadastro">
                            <div id="div-botao-cadastrar">
                                Cadastrar
                            </div>
                        </div>

                    </DialogContent>
                </Dialog>


            </div>
        )
    }

}

export default Checkout

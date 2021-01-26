import React from 'react'
import {
    AppBar,
    Button,
    CardMedia,
    FormLabel,
    Toolbar,
    TextField,
    FormControlLabel,
    Radio,
    RadioGroup
} from '@material-ui/core'
import {Add, Remove, Delete} from '@material-ui/icons'
import {withStyles} from '@material-ui/styles'
import logo from '../images/logo.png'
import '../style/header.css'
import '../style/carrinho.css'
import {hideData, showData, removeCharacter, getDeliveryValues} from "../util"

let fretes = []

const RadioCheck = withStyles({
    root: {
        color: '#000000',
        '&$checked': {
            color: '#000000',
        },
    },
    checked: {},
})(props => <Radio color="default" {...props} />)

class Carrinho extends React.Component {

    state = {
        openCadastro: false,
        produto: {},
        quantidade: 1,
        fretes: [],
        frete: 0,
        desconto: 1,
        cep: '',
        cupom: '',
        produtos: []
    }

    onTipoEntrega = valor => {
        this.setState({frete: valor})
    }

    inputs = async e => {
        let name = e.target.name
        let value = e.target.value
        if (name === 'cep') {
            let cep = removeCharacter(value)
            this.setState({[name]: cep})
            if (cep.length === 8) {
                let fretes = await getDeliveryValues('92410320', cep)
                this.setState({fretes: fretes})
            }
        } else {
            this.setState({[name]: value.toUpperCase()})
        }
    }

    onClickCupom = () => {
        const {cupom} = this.state
        if (cupom === 'VALE10') {
            this.setState({desconto: 0.9})
            localStorage.setItem(`desconto`, hideData(0.9))
        }
    }

    handleQtd = e => {
        if (e.target.value !== '' && parseInt(e.target.value) > 0)
            this.setState({quantidade: parseInt(e.target.value)})
    }

    adicionaQuantidade = index => {
        let {produtos} = this.state
        produtos[index].quantidade++
        this.setState({produtos: produtos})
        localStorage.setItem(`fb:itens`, hideData(produtos))
    }

    removeQuantidade = index => {
        let {produtos} = this.state
        produtos[index].quantidade--
        if (produtos[index].quantidade === 0) {
            this.deletaproduto(index, produtos)
        } else {
            this.setState({produtos: produtos})
            localStorage.setItem(`fb:itens`, hideData(produtos))
        }
    }

    deletaproduto = index => {
        let {produtos} = this.state
        produtos.splice(index, 1)
        this.setState({produtos: produtos})
        localStorage.setItem(`fb:itens`, hideData(produtos))
    }

    onClickScroll = id => {
        this.props.history.replace({pathname: '/'})
        setTimeout(function () {
            this.setState({drawer: false})
            let target = document.getElementById(id)
            this.scroll(target.offsetTop, 0)
        }.bind(this), 100)
    }

    continuar = () => {
        const {produtos, cep} = this.state
        localStorage.setItem(`fb:itens`, hideData(produtos))
        localStorage.setItem(`fb:cep`, hideData(cep, false))
        this.props.history.replace({pathname: '/'})
    }

    finalizar = () => {
        let itens = showData(localStorage.getItem(`fb:itens`))
        if (itens !== undefined && itens.length !== 0)
            this.props.history.push({pathname: '/checkout'})
    }

    pagina = pagina => {
        this.props.history.push({pathname: pagina})
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

    calcularFrete = async () => {
        const {cep} = this.state
        if (cep.length === 8) {
            fretes = []
            let tipos = ['pac', 'sedex']
            tipos.forEach((i, index) => {
                this.obterFrete(i, cep, index)
            })
        } else {
            alert('CEP inválido')
        }
    }


    verificaProdutos = () => {
        let produtos = showData(localStorage.getItem(`fb:itens`))
        produtos = (produtos !== undefined) ? produtos : []
        this.setState({produtos: produtos})
    }

    total = () => {
        const {produtos, desconto, frete} = this.state
        let total = 0
        produtos.forEach(i => {
            const {quantidade, produto: {preco}} = i
            total += (parseFloat(preco) * quantidade)
        })
        return (frete + (total * desconto))
    }

    componentDidMount() {
        fretes = []
        this.verificaProdutos()
    }

    render() {
        const {produtos, fretes, desconto, cupom, cep} = this.state
        return (
            <section id="carrinho">
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
                                <Button id="button-menu">Carrinho</Button>
                            </div>
                            <div id="toolbar-right">

                            </div>
                        </div>
                    </Toolbar>
                </AppBar>

                <section id="carrinho-body">
                    {
                        produtos.map((i, index) => {
                            const {produto: {nome, preco, imagem}, quantidade} = i
                            return (
                                <section id="main-detalhes">
                                    <div id="div-produto">
                                        <div id="barra-titulo" style={index ? {display: 'none'} : {}}>
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
                                        <div id="barra-titulo" style={index ? {display: 'none'} : {}}>
                                            <FormLabel id="label-barra">Preço unitário</FormLabel>
                                        </div>
                                        <div id="div-descricoes">
                                            <FormLabel
                                                id="label-preco-produto">{parseFloat(preco).toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            })}</FormLabel>
                                        </div>
                                    </div>

                                    <div id="div-quantidade-barra">
                                        <div id="barra-titulo" style={index ? {display: 'none'} : {}}>
                                            <FormLabel id="label-barra">Quantidade</FormLabel>
                                        </div>
                                        <div id="div-descricoes">
                                            <div id="div-quantidade">
                                                <div id="div-mais">
                                                    <Add id="icones" onClick={() => this.adicionaQuantidade(index)}/>
                                                </div>
                                                <div id="div-qtd">
                                                    <input id="label-qtd" type="number"
                                                           value={quantidade} name="quantidade"
                                                           onChange={this.handleQtd}/>
                                                </div>
                                                <div id="div-menos">
                                                    <Remove id="icones" onClick={() => this.removeQuantidade(index)}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="div-subtotal">
                                        <div id="barra-titulo" style={index ? {display: 'none'} : {}}>
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

                                    <div id="div-delete">
                                        <div id="barra-titulo" style={index ? {display: 'none'} : {}}>
                                            <FormLabel id="label-barra">Retirar</FormLabel>
                                        </div>
                                        <div id="div-descricoes">
                                            <Delete id="icones" onClick={() => this.deletaproduto(index)}/>
                                        </div>
                                    </div>

                                </section>
                            )
                        })
                    }

                    <section id="main-obs">


                        <div id="div-cupom">
                            <div id="div-label-cep">
                                <div id="div-cep-content">
                                    <TextField id="input-cep" name="cupom" label="Cupom" variant="outlined"
                                               value={cupom}
                                               onChange={this.inputs}/>
                                    <Button id="botao-verificar" variant="outlined"
                                            onClick={this.onClickCupom}>Aplicar</Button>
                                </div>
                            </div>
                            <div id="div-resultados-cep">

                            </div>
                        </div>

                        <div id="div-total">
                            <div id="div-resultados-totais">
                                <div>
                                    <FormLabel id="label-total">Total :</FormLabel>
                                    <FormLabel id="label-total-valor">{`${this.total().toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}`}
                                    </FormLabel>
                                </div>
                                {
                                    desconto !== 1 &&
                                    <FormLabel id="label-desconto">{`Desconto 10%`}</FormLabel>
                                }
                            </div>
                        </div>

                        <div id="div-finalizar">
                            <div id="div-botao-continuar" onClick={this.continuar}>
                                Continuar comprando
                            </div>
                            <div id="div-botao-finalizar" onClick={this.finalizar}>
                                Finalizar pedido
                            </div>
                        </div>
                    </section>
                </section>

            </section>
        )
    }
}

export default Carrinho

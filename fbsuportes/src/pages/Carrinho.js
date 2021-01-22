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
import {Add, Remove} from '@material-ui/icons'
import {withStyles} from '@material-ui/styles'
import logo from '../images/logo.png'
import '../style/header.css'
import '../style/carrinho.css'


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
        cep: ''
    }

    onTipoEntrega = valor => {
        this.setState({frete: valor})
    }

    inputs = e => {
        if (e.target.name === 'cupom' && e.target.value === 'VALE10') {
            this.setState({desconto: 0.9})
        } else {
            this.setState({[e.target.name]: e.target.value})
        }
    }

    handleQtd = e => {
        if (e.target.value !== '' && parseInt(e.target.value) > 0)
            this.setState({quantidade: parseInt(e.target.value)})
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

    calcularFrete = async () => {
        fretes = []
        let tipos = ['pac', 'sedex']
        tipos.forEach((i, index) => {
            this.obterFrete(i)
        })
    }


    obterFrete = async tipo => {
        const {cep} = this.state

        let origem = '92410320'
        let altura = '50'
        let largura = '50'
        let comprimento = '20'
        let peso = '500'

        let URL_BASE = 'http://webservice.kinghost.net/web_frete.php?auth=0dd752ad2a1455f7be761d450d84b240'
        let PARAMS = `&tipo=${tipo}&formato=json&cep_origem=${origem}&cep_destino=${cep}&cm_altura=${altura}&cm_largura=${largura}&cm_comprimento=${comprimento}&peso=${peso}`
        let url = `https://cors-anywhere.herokuapp.com/${URL_BASE}${PARAMS}`

        let {valor, prazo_entrega} = await fetch(url).then((response) => response.json())

        let json = {
            valor: parseFloat(valor),
            tipo: `${tipo} ${parseFloat(valor).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })} ${prazo_entrega} ${prazo_entrega === '1' ? 'Dia' : 'Dias'}`,
        }

        fretes.push(json)
        this.setState({fretes: fretes})
    }

    componentDidMount() {
        fretes = []
        const {produto, quantidade} = this.props.location.state
        this.setState({produto: produto, quantidade: quantidade})
    }

    render() {
        const {produto: {nome, preco, imagem}, quantidade, fretes, frete, desconto} = this.state
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
                                <div id="div-cep-content">
                                    <TextField id="input-cep" name="cep" label="CEP" variant="outlined"
                                               onChange={this.inputs}/>
                                    <Button id="botao-verificar" variant="outlined"
                                            onClick={this.calcularFrete}>Ok</Button>
                                </div>
                            </div>

                            <RadioGroup id="div-resultados-cep">
                                {
                                    fretes.map(i => (
                                        <FormControlLabel id="label-valor-prazo-entrega"
                                                          control={<RadioCheck/>} value={i.tipo} label={i.tipo}
                                                          onChange={() => this.onTipoEntrega(i.valor)}/>
                                    ))
                                }
                            </RadioGroup>
                        </div>

                        <div id="div-cupom">
                            <div id="div-label-cep">
                                <div id="div-cep-content">
                                    <TextField id="input-cep" name="cupom" label="Cupom" variant="outlined"
                                               onChange={this.inputs}/>
                                    <Button id="botao-verificar" variant="outlined">Ok</Button>
                                </div>
                            </div>
                            <div id="div-resultados-cep">

                            </div>
                        </div>

                        <div id="div-total">
                            <div id="div-resultados-totais">
                                <FormLabel id="label-total">{`Total
                                    ${(frete + ((parseFloat(preco) * quantidade) * desconto)).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}`}
                                </FormLabel>
                                {
                                    desconto !== 1 &&
                                    <FormLabel id="label-desconto">{`Desconto 10%`}</FormLabel>
                                }
                            </div>
                        </div>

                    </section>

                </section>

            </section>
        )
    }
}

export default Carrinho

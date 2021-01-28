import React from "react"
import {
    AppBar,
    Button,
    Box,
    CardMedia,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    FormControlLabel,
    Toolbar,
    FormLabel,
    Divider,
    Radio,
    RadioGroup
} from '@material-ui/core'
import logo from '../images/logo.png'
import '../style/checkout.css'
import {cepMask, removeCharacter, cpfMask, hideData, phoneMask, showData, getDeliveryValues, getAddress} from '../util'

import firebase from '../firebase'
import {withStyles} from '@material-ui/styles'

const RadioCheck = withStyles({
    root: {
        color: '#000000',
        '&$checked': {
            color: '#000000',
        },
    },
    checked: {},
})(props => <Radio color="default" {...props} />)

class Checkout extends React.Component {

    state = {
        itens: [],
        cupom: 1,
        openCadastro: false,
        openEndereco: false,
        email: '',
        senha: '',
        repetirSenha: '',
        nome: '',
        telefone: '',
        cep: '',
        logado: false,
        fretes: [],
        rua: '',
        bairro: '',
        cidade: '',
        uf: '',
        endereco: '',
        complemento: '',
        tipoEntrega: {
            tipo: '',
            valor: 0
        }
    }

    inputs = async e => {
        let name = e.target.name
        let value = e.target.value

        if (name === 'telefone') {
            this.setState({[name]: phoneMask(value)})
        } else if (name === 'cpf') {
            this.setState({[name]: cpfMask(value)})
        } else if (name === 'cep') {
            let cep = cepMask(value)
            this.setState({[name]: cep})
            if (cep.length === 8) {
                let s = await getDeliveryValues('92410320', cep)
                this.setState({fretes: s})
            }
        } else {
            this.setState({[name]: value})
        }
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

    total = () => {
        const {itens, desconto, tipoEntrega: {valor}} = this.state
        let total = 0
        itens.forEach(i => {
            const {produto: {preco}, quantidade} = i
            total += (parseFloat(preco) * quantidade)
        })
        return (total * desconto + valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    }

    cupom = () => {
        let desconto = showData(localStorage.getItem(`desconto`))
        this.setState({desconto: desconto !== undefined ? desconto : 1})
    }

    cadastrar = () => {
        let {
            email,
            senha,
            repetirSenha,
            nome,
            telefone,
            cpf
        } = this.state

        if (!nome) {
            alert('Preencha o nome')
        } else if (senha !== repetirSenha) {
            alert('Senha diferentes')
        } else if (!senha) {
            alert('Preencha a senha')
        } else if (!telefone) {
            alert('Preencha o telefone')
        }

        let cliente = {
            email: email,
            nome: nome,
            senha: senha,
            telefone: telefone,
            cpf: cpf
        }

        firebase
            .database()
            .ref(`clientes/${removeCharacter(cliente.cpf)}`)
            .set(cliente)
            .then((data) => {
                alert('Cadastrado com sucesso')
            })
            .catch((error) => {
                alert(error)
            })

        localStorage.setItem(`cliente`, hideData(cliente))
        this.setState({openCadastro: false})
    }

    confirmarEndereco = () => {
        const {cep, rua, bairro, numero, cidade, uf, complemento} = this.state
        let endereco = `${rua}, ${complemento ? `(${complemento})` : ``} ${numero} - ${bairro}, ${cidade} - ${uf}, ${cep}`
        this.setState({endereco: endereco, openEndereco: false})
    }

    login = () => {
        let {email, senha} = this.state
        let context = this
        firebase
            .database()
            .ref(`clientes`)
            .orderByChild(`email`)
            .equalTo(email)
            .once('value')
            .then(function (snapshot) {
                if (snapshot.val() !== null) {
                    let value = snapshot.val()
                    let cliente = Object.values(value)[0]
                    if (cliente.senha === senha) {
                        localStorage.setItem(`cliente`, hideData(cliente))
                        const {nome, email, telefone, cpf} = cliente
                        context.setState({logado: true, nome: nome, email: email, telefone: telefone, cpf: cpf})
                    }
                }
            })
    }

    cliente = () => {
        let cliente = showData(localStorage.getItem(`cliente`))
        if (cliente !== undefined) {
            const {nome, email, telefone, cpf} = cliente
            this.setState({logado: true, nome: nome, email: email, telefone: telefone, cpf: cpf})
        }
    }

    entrega = async (index, object) => {
        const {cep} = this.state
        if (index !== 0) {
            let {logradouro, bairro, localidade, uf} = await getAddress(cep)
            this.setState({
                rua: logradouro,
                bairro: bairro,
                cidade: localidade,
                uf: uf,
                openEndereco: true,
                tipoEntrega: {
                    valor: object.valor,
                    tipo: object.tipo
                }
            })
        } else {
            this.setState({endereco: '', tipoEntrega: {valor: object.valor, tipo: object.tipo}})
        }
    }

    componentDidMount() {
        this.cupom()
        this.itens()
        this.cliente()
    }

    render() {
        const {
            itens,
            desconto,
            openCadastro,
            email,
            senha,
            repetirSenha,
            nome,
            telefone,
            cpf,
            logado,
            cep,
            fretes,
            rua,
            bairro,
            cidade,
            uf,
            complemento,
            endereco,
            openEndereco
        } = this.state
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

                            {
                                !logado &&
                                <div>
                                    <div id="div-login">
                                        <TextField name="email" onChange={this.inputs} label="E-mail"
                                                   variant="outlined"/>
                                    </div>

                                    <div id="div-login">
                                        <TextField name="senha" type="password" onChange={this.inputs}
                                                   label="Senha"
                                                   variant="outlined"/>
                                    </div>

                                    <div id="div-login">
                                        <Button onClick={this.login}>Login</Button>
                                    </div>

                                    <div id="div-login">
                                        <Button onClick={() => this.setState({openCadastro: true})}>Cadastrar</Button>
                                    </div>
                                </div>
                            }

                            {
                                logado &&
                                <div id="div-dados-cliente">
                                    <FormLabel id="label-cliente">{`Nome: ${nome}`}</FormLabel>
                                    <FormLabel id="label-cliente">{`E-mail: ${email}`}</FormLabel>
                                    <FormLabel id="label-cliente">{`Telefone: ${telefone}`}</FormLabel>
                                    <FormLabel id="label-cliente">{`CPF: ${cpf}`}</FormLabel>
                                </div>
                            }

                        </div>

                        <div id="div-login-entrega-cartao">
                            <div id="div-barra-checkout">
                                Entrega
                            </div>

                            <div id="div-login">
                                <TextField name="cep" onChange={this.inputs} value={cep} label="CEP"
                                           variant="outlined"/>
                            </div>

                            {
                                endereco &&
                                <div id="div-login">
                                    <FormLabel id="label-cliente">{endereco}</FormLabel>
                                </div>
                            }

                            <div id="div-login">
                                <RadioGroup id="div-resultados-cep">
                                    {
                                        fretes.map((i, index) => (
                                            <FormControlLabel id="label-valor-prazo-entrega"
                                                              control={<RadioCheck/>} value={i.tipo} label={i.tipo}
                                                              onChange={() => this.entrega(index, i)}/>
                                        ))
                                    }
                                </RadioGroup>
                            </div>

                        </div>

                        <div id="div-login-entrega-cartao">
                            <div id="div-barra-checkout">
                                Cartão
                            </div>

                            <div id="div-cartao">
                                <Box p={1}/>
                                <TextField fullWidth name="email" label="Nome titular" variant="outlined"/>
                                <Box p={1}/>
                            </div>

                            <div id="div-cartao">
                                <Box p={1}/>
                                <TextField fullWidth name="email" label="Nº do cartão" variant="outlined"/>
                                <Box p={1}/>
                            </div>

                            <div id="div-cartao">
                                <Box p={1}/>
                                <TextField name="email" label="Validade" variant="outlined"/>
                                <Box p={1}/>
                                <TextField name="email" label="CCV" variant="outlined"/>
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

                <Dialog open={openEndereco} aria-labelledby="form-dialog-title"
                        onClose={() => this.setState({openEndereco: false})}>
                    <DialogTitle id="form-dialog-title">Cadastro</DialogTitle>
                    <DialogContent>
                        <div>
                            <div id="div-cartao">
                                <Box p={1}/>
                                <TextField fullWidth name="rua" value={rua} label="Rua" variant="outlined"/>
                                <Box p={1}/>
                            </div>

                            <div id="div-cartao">
                                <Box p={1}/>
                                <TextField name="bairro" value={bairro} label="Bairro" variant="outlined"/>
                                <Box p={1}/>
                                <TextField name="numero" label="Nº" variant="outlined" onChange={this.inputs}/>
                                <Box p={1}/>
                            </div>

                            <div id="div-cartao">
                                <Box p={1}/>
                                <TextField name="cidade" value={cidade} label="Cidade" variant="outlined"/>
                                <Box p={1}/>
                                <TextField name="uf" value={uf} label="Uf" variant="outlined"/>
                                <Box p={1}/>
                            </div>

                            <div id="div-cartao">
                                <Box p={1}/>
                                <TextField fullWidth name="complemento" value={complemento} label="Complemento"
                                           variant="outlined" onChange={this.inputs}/>
                                <Box p={1}/>
                            </div>

                            <div id="div-cartao">
                                <Box p={1}/>
                                <div id="div-botao-cadastrar" onClick={this.confirmarEndereco}>
                                    Confirmar
                                </div>
                                <Box p={1}/>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={openCadastro} aria-labelledby="form-dialog-title"
                        onClose={() => this.setState({openCadastro: false})}>
                    <DialogTitle id="form-dialog-title">Cadastro</DialogTitle>
                    <DialogContent>

                        <div id="div-cartao">
                            <TextField fullWidth={true} name="email" value={email} onChange={this.inputs} label="E-mail"
                                       variant="outlined"/>
                        </div>

                        <div id="div-cartao">
                            <TextField fullWidth={true} name="senha" value={senha} onChange={this.inputs} label="Senha"
                                       variant="outlined"/>
                            <Box p={1}/>
                            <TextField fullWidth={true} name="repetirSenha" value={repetirSenha} onChange={this.inputs}
                                       label="Repetir senha"
                                       variant="outlined"/>
                        </div>

                        <Divider/>

                        <div id="div-cartao">
                            <TextField fullWidth={true} name="nome" value={nome} onChange={this.inputs} label="Nome"
                                       variant="outlined"/>
                        </div>

                        <div id="div-cartao">
                            <TextField fullWidth={true} name="telefone" value={telefone} onChange={this.inputs}
                                       label="Telefone"
                                       variant="outlined"/>
                        </div>

                        <div id="div-cartao">
                            <TextField fullWidth={true} name="cpf" value={cpf} onChange={this.inputs} label="CPF"
                                       variant="outlined"/>
                        </div>

                        <div id="div-cartao">
                            <div id="div-botao-cadastrar" onClick={this.cadastrar}>
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

import React from 'react'
import {
    AppBar,
    Button,
    CardMedia,
    FormLabel,
    Toolbar,
    TextField,
    RadioGroup,
    FormControlLabel,
    Box,
    Radio,
    Dialog,
    DialogTitle,
    DialogContent,
    Divider
} from '@material-ui/core'
import {
    isMobile
} from 'react-device-detect'
import {
    Add,
    Remove,
    Delete,
    Edit
} from '@material-ui/icons'
import {
    hideData,
    showData,
    removeCharacter,
    getDeliveryValues,
    phoneMask,
    cpfMask,
    cepMask,
    getAddress
} from '../util'
import {
    withStyles
} from '@material-ui/styles'
import firebase from '../firebase'
import logo from '../images/logo.png'
import '../style/carrinho.css'

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
        openEndereco: false,
        rua: '',
        bairro: '',
        numeroEndereco: '',
        cidade: '',
        uf: '',
        complemento: '',
        senha: '',
        repetirSenha: '',
        produto: {},
        quantidade: 1,
        fretes: [],
        frete: 0,
        desconto: 1,
        cep: '',
        produtos: [],
        quantidadeItens: 0,
        valorEntrega: 0,
        logado: false,
        numeroCartao: '',
        validadeCartao: '',
        ccvCartao: '',
        endereco: '',
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        cupom: '',
        tipoFrete: false,
        tipoEntrega: {
            valor: 0,
            tipo: ''
        }
    }

    inputs = async e => {
        let name = e.target.name
        let value = e.target.value

        if (name === 'telefone') {
            this.setState({[name]: phoneMask(value)})
        } else if (name === 'cupom') {
            if (value.toUpperCase() === 'VALE10') {
                this.setState({desconto: 0.9})
                localStorage.setItem(`fb:desconto`, hideData(0.9))
                this.setState({[name]: value.toUpperCase()})
            } else if (value === '') {
                this.setState({[name]: ''})
                this.setState({desconto: 1})
                localStorage.removeItem(`fb:desconto`)
            } else {
                this.setState({desconto: 1})
                localStorage.removeItem(`fb:desconto`)
            }
        } else if (name === 'cpf') {
            this.setState({[name]: cpfMask(value)})
        } else if (name === 'cep') {
            let cep = cepMask(value)
            this.setState({[name]: cep})
            if (cep.length === 8) {
                let s = await getDeliveryValues('92410320', cep)
                this.setState({fretes: s, tipoFrete: true, endereco: ''})
            }
        } else {
            this.setState({[name]: value})
        }
    }

    editarCupom = () => {
        this.setState({desconto: 1})
        localStorage.removeItem(`fb:desconto`)
        this.setState({cupom: ''})
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
        this.quantidadeItens()
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
        if (itens === undefined || itens.length === 0) {
            alert('Adicione itens ao carrinho')
            return
        }

        let cliente = showData(localStorage.getItem(`fb:cliente`))
        if (cliente === undefined || cliente === null) {
            alert('Faça seu LOGIN ou CADASTRO')
            return
        }

        let entrega = showData(localStorage.getItem(`fb:tipoEntrega`))
        if (entrega === undefined || entrega === null) {
            alert('Informa o dados de entrega')
            return
        }

        localStorage.setItem(`fb:valorDesconto`, hideData(this.totalProdutos() * 0.1))

        localStorage.setItem(`fb:total`, hideData(this.total()))

        window.location.href = '/checkout'
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

    verificaProdutos = () => {
        let produtos = showData(localStorage.getItem(`fb:itens`))
        produtos = (produtos !== undefined) ? produtos : []
        this.setState({produtos: produtos})
    }

    total = () => {
        const {produtos, desconto, tipoEntrega: {valor}} = this.state
        let total = 0
        produtos.forEach(i => {
            const {quantidade, produto: {preco}} = i
            total += (parseFloat(preco) * quantidade)
        })
        return (valor + (total * desconto))
    }

    totalProdutos = () => {
        const {produtos} = this.state
        let total = 0
        produtos.forEach(i => {
            const {quantidade, produto: {preco}} = i
            total += (parseFloat(preco) * quantidade)
        })
        return total
    }

    quantidadeItens = () => {
        let produtos = showData(localStorage.getItem(`fb:itens`))
        this.setState({quantidadeItens: (produtos !== undefined) ? produtos.length : 0})
    }

    confirmarEndereco = () => {
        const {cep, rua, bairro, numeroEndereco, cidade, uf, complemento} = this.state

        if (!cep) {
            alert('cep inválido')
            return
        } else if (!rua) {
            alert('rua inválida')
            return
        } else if (!bairro) {
            alert('bairro inválida')
            return
        } else if (!numeroEndereco) {
            alert('numero inválida')
            return
        } else if (!cidade) {
            alert('cidade inválida')
            return
        } else if (!uf) {
            alert('uf inválida')
            return
        }

        let endereco = `${rua}, ${complemento ? `(${complemento})` : ``} ${numeroEndereco} - ${bairro}, ${cidade} - ${uf}, ${cep}`
        localStorage.setItem(`fb:endereco`, hideData(endereco))
        localStorage.setItem(`fb:cep`, hideData(cep))
        this.setState({endereco: endereco, openEndereco: false, tipoFrete: false})
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
                },
                valorEntrega: object.valor,
            })
            localStorage.setItem(`fb:tipoEntrega`, hideData({valor: object.valor, tipo: object.tipo}))
        } else {
            localStorage.setItem(`fb:tipoEntrega`, hideData({valor: object.valor, tipo: object.tipo}))
            localStorage.setItem(`fb:endereco`, hideData('Combinar com vendedor'))
            this.setState({
                endereco: 'Combinar com vendedor',
                valorEntrega: 0,
                tipoFrete: false,
                tipoEntrega: {valor: object.valor, tipo: object.tipo}
            })
        }
    }

    editarEndereco = () => {
        this.setState({endereco: '', tipoFrete: true, valorEntrega: 0, tipoEntrega: {valor: 0, tipo: ''}})
        localStorage.setItem(`fb:valorEntrega`, hideData(0))
    }

    cupom = () => {
        let desconto = showData(localStorage.getItem(`fb:desconto`))
        this.setState({desconto: desconto !== undefined ? desconto : 1, cupom: desconto !== undefined ? 'VALE10' : ''})
    }

    cliente = () => {
        let cliente = showData(localStorage.getItem(`fb:cliente`))
        if (cliente !== undefined) {
            const {nome, email, telefone, cpf, senha} = cliente
            this.setState({
                logado: true,
                senha: senha,
                repetirSenha: senha,
                nome: nome,
                email: email,
                telefone: telefone,
                cpf: cpf
            })
        }
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

        let ctx = this

        firebase
            .database()
            .ref(`clientes/${removeCharacter(cliente.cpf)}`)
            .set(cliente)
            .then((data) => {
                alert('Cadastrado com sucesso')
                ctx.setState({logado: true})
            })
            .catch((error) => {
                alert(error)
            })

        localStorage.setItem(`fb:cliente`, hideData(cliente))
        this.setState({openCadastro: false})
    }

    endereco = async () => {
        let endereco = showData(localStorage.getItem(`fb:endereco`))
        let cep = showData(localStorage.getItem(`fb:cep`))
        let entrega = showData(localStorage.getItem(`fb:tipoEntrega`))
        if (endereco) {
            this.setState({
                endereco: endereco,
                cep: cep !== undefined ? cep : '',
                tipoEntrega: {
                    valor: entrega !== undefined ? entrega.valor : 0,
                    tipo: entrega !== undefined ? entrega.tipo : '',
                },
                valorEntrega: entrega !== undefined ? entrega.valor : 0
            })
        }

        if (cep !== undefined) {
            let s = await getDeliveryValues('92410320', cep)
            this.setState({fretes: s})
        }
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
                        localStorage.setItem(`fb:cliente`, hideData(cliente))
                        const {nome, email, telefone, cpf} = cliente
                        context.setState({logado: true, nome: nome, email: email, telefone: telefone, cpf: cpf})
                    } else {
                        alert('Senha incorreta, faço um novo cadastro')
                    }
                } else {
                    alert('E-mail não cadastrado, faço um novo cadastro')
                }
            })
    }

    componentDidMount() {
        this.verificaProdutos()
        this.quantidadeItens()
        this.cupom()
        this.cliente()
        this.endereco()
        window.scrollTo(0, 0)
    }

    render() {
        const {
            produtos,
            desconto,
            quantidadeItens,
            logado,
            cep,
            endereco,
            fretes,
            nome,
            email,
            telefone,
            cpf,
            openCadastro,
            openEndereco,
            rua,
            bairro,
            numeroEndereco,
            cidade,
            uf,
            complemento,
            senha,
            repetirSenha,
            valorEntrega,
            tipoFrete,
            cupom
        } = this.state
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
                                <Button id="button-menu" onClick={() => this.pagina('/pedidos')}>Meus Pedidos</Button>
                                <Button id="button-menu" onClick={() => this.onClickScroll('footer')}>Contato</Button>
                                <Button id="button-menu">Carrinho
                                    {
                                        quantidadeItens !== 0 &&
                                        <div id="div-carrinho">{quantidadeItens}</div>
                                    }
                                </Button>
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
                                        <div id="barra-titulo" style={index && !isMobile ? {display: 'none'} : {}}>
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
                                        <div id="barra-titulo" style={index && !isMobile ? {display: 'none'} : {}}>
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
                                        <div id="barra-titulo" style={index && !isMobile ? {display: 'none'} : {}}>
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
                                        <div id="barra-titulo" style={index && !isMobile ? {display: 'none'} : {}}>
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
                                        <div id="barra-titulo" style={index && !isMobile ? {display: 'none'} : {}}>
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
                                                <Button
                                                    onClick={() => this.setState({openCadastro: true})}>Cadastrar</Button>
                                            </div>
                                        </div>
                                    }

                                    {
                                        logado &&
                                        <div id="div-dados-cliente">
                                            <FormLabel id="label-cliente">{`Nome: ${nome}`}</FormLabel>
                                            <FormLabel id="label-cliente">{`E-mail: ${email}`}</FormLabel>
                                            <FormLabel id="label-cliente">{`Telefone: ${telefone}`}</FormLabel>
                                            <div>
                                                <FormLabel
                                                    id="label-cliente">{`${cpf.length === 14 ? `CPF: ` : `CNPJ: `}${cpf}`}</FormLabel>
                                                <Edit id="icones" onClick={() => this.setState({openCadastro: true})}/>
                                            </div>
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
                                        <div id="div-endereco">
                                            <FormLabel id="label-cliente">{endereco}</FormLabel>
                                            <Edit id="icones" onClick={this.editarEndereco}/>
                                        </div>
                                    }

                                    {
                                        tipoFrete &&
                                        <div id="div-login">
                                            <RadioGroup id="div-resultados-cep">
                                                {
                                                    fretes.map((i, index) => (
                                                        <FormControlLabel id="label-valor-prazo-entrega"
                                                                          control={<RadioCheck/>} value={i.tipo}
                                                                          label={i.tipo}
                                                                          onChange={() => this.entrega(index, i)}/>
                                                    ))
                                                }
                                            </RadioGroup>
                                        </div>
                                    }

                                </div>

                                <div id="div-login-entrega-cartao">
                                    <div id="div-barra-checkout">
                                        Cupom
                                    </div>

                                    <div id="div-login">
                                        <TextField name="cupom" onChange={this.inputs} label="Cupom"
                                                   variant="outlined"/>
                                    </div>

                                    {
                                        cupom &&
                                        <div id="div-endereco">
                                            <FormLabel id="label-cliente">{cupom}</FormLabel>
                                            <Edit id="icones" onClick={this.editarCupom}/>
                                        </div>
                                    }

                                </div>

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
                                    valorEntrega !== 0 &&
                                    <FormLabel id="label-desconto">{`Entrega ${valorEntrega.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}`}</FormLabel>
                                }
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
                                <TextField name="numeroEndereco" label="Nº" value={numeroEndereco} variant="outlined"
                                           onChange={this.inputs}/>
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
                            <TextField fullWidth={true} name="senha" type="password" value={senha}
                                       onChange={this.inputs} label="Senha"
                                       variant="outlined"/>
                            <Box p={1}/>
                            <TextField fullWidth={true} name="repetirSenha" type="password" value={repetirSenha}
                                       onChange={this.inputs}
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
                            <TextField fullWidth={true} name="cpf" value={cpf} onChange={this.inputs} label="CPF/CNPJ"
                                       variant="outlined"/>
                        </div>
                        <div id="div-cartao">
                            <div id="div-botao-cadastrar" onClick={this.cadastrar}>
                                Cadastrar
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

            </section>
        )
    }
}

export default Carrinho

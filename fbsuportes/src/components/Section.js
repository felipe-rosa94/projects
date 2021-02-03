import React from 'react'
import {withRouter} from 'react-router-dom'
import '../style/section.css'
import firebase from '../firebase'
import {AppBar, Button, CardMedia, FormLabel, Toolbar} from '@material-ui/core'
import {Carousel} from 'react-bootstrap'
import logo from '../images/logo.png'
import {hideData, showData} from "../util";

class Section extends React.Component {

    state = {
        produtos: [],
        filtro: [],
        grupos: [],
        banners: [],
        quantidadeItens: 0
    }

    filtrar = grupo => {
        let {produtos} = this.state
        let array = []
        produtos.forEach(i => {
            if (grupo === i.grupo) array.push(i)
        })
        this.posicionar()
        this.setState({filtro: grupo === 'Todos' ? produtos : array})
    }

    posicionar = () => {
        let elem = document.getElementById('section-produtos')
        this.scroll(elem.offsetTop, 250)
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
            }, 25);
        if (prop) {
            elem[style] = from + unit
        } else {
            elem.style[style] = from + unit
        }
    }

    buscarProdutos = () => {
        let context = this
        firebase
            .database()
            .ref('produtos/')
            .on('value', snap => {
                let value = snap.val() !== null ? Object.values(snap.val()) : []
                context.setState({produtos: value, filtro: value})
                localStorage.setItem(`fb:produtos`, hideData(value))
            })
    }

    buscarGrupos = () => {
        let context = this
        firebase
            .database()
            .ref('grupos/')
            .on('value', snap => {
                let value = snap.val() !== null ? Object.values(snap.val()) : []
                value.push({grupo: "Todos", id: "1", ordem: 999})
                context.setState({grupos: value})
                localStorage.setItem(`fb:grupos`, hideData(value))
            })
    }

    buscarBanners = () => {
        let context = this
        firebase
            .database()
            .ref('banners/')
            .on('value', snap => {
                let value = snap.val() !== null ? Object.values(snap.val()) : []
                context.setState({banners: value})
                localStorage.setItem(`fb:banners`, hideData(value))
            })
    }

    buscarDados = () => {
        let produtos = showData(localStorage.getItem(`fb:produtos`))
        let grupos = showData(localStorage.getItem(`fb:grupos`))
        let banners = showData(localStorage.getItem(`fb:banners`))
        this.setState({
            produtos: produtos !== undefined ? produtos : [],
            grupos: grupos !== undefined ? grupos : [],
            banners: banners !== undefined ? banners : []
        })
    }

    quantidadeItens = () => {
        let produtos = showData(localStorage.getItem(`fb:itens`))
        this.setState({quantidadeItens: (produtos !== undefined) ? produtos.length : 0})
    }

    componentDidMount() {
        this.buscarDados()
        this.buscarBanners()
        this.buscarGrupos()
        this.buscarProdutos()
        this.quantidadeItens()
    }

    render() {
        const {grupos, filtro, banners, quantidadeItens} = this.state
        return (
            <section id="section">
                <AppBar
                    id="appBar"
                    color="default">
                    <Toolbar id="toolbar" variant="dense">
                        <div id="main-toolbar">
                            <div id="toolbar-left">
                                <CardMedia id="img-logo" image={logo} onClick={() => this.pagina('/')}/>
                            </div>
                            <div id="toolbar-center">
                                <Button id="button-menu" onClick={this.posicionar}>Produtos</Button>
                                <Button id="button-menu">Minha Conta</Button>
                                <Button id="button-menu" href="#footer">Contato</Button>
                                <Button id="button-menu" onClick={() => this.pagina('/carrinho')}>Carrinho
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

                    <section id="section-grupos">
                        {
                            grupos.map(i => (
                                <Button id="buttons-grupo" onClick={() => this.filtrar(i.grupo)}>{i.grupo}</Button>
                            ))
                        }
                    </section>

                </AppBar>

                <section id="section-body">
                    <Carousel id="carousel">
                        {
                            banners.map(((i, index) => {
                                return (
                                    <Carousel.Item key={index}>
                                        <CardMedia image={i.url} id="img-carousel"/>
                                    </Carousel.Item>
                                )
                            }))
                        }
                    </Carousel>
                    <section id="section-produtos">
                        {
                            filtro.map(i => (
                                <section id="section-produto" onClick={() => this.props.handleChange(i)}>
                                    <CardMedia id="img-produto" image={i.imagem}/>
                                    <section id="section-descricoes">
                                        <FormLabel id="form-label-nome">{i.nome}</FormLabel>
                                        <FormLabel id="form-label-descricao">{i.descricao}</FormLabel>
                                        <FormLabel id="form-label-preco">{parseFloat(i.preco).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}</FormLabel>
                                    </section>
                                </section>
                            ))
                        }
                    </section>
                </section>
            </section>
        )
    }
}

export default withRouter(Section)

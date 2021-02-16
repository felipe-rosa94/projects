import React from 'react'
import {AppBar, Button, CardMedia, Toolbar} from "@material-ui/core";
import logo from "../images/logo.png";
import {showData} from "../util";

class Pedidos extends React.Component {

    state = {
        quantidadeItens: 0
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

    quantidadeItens = () => {
        let produtos = showData(localStorage.getItem(`fb:itens`))
        this.setState({quantidadeItens: (produtos !== undefined) ? produtos.length : 0})
    }

    componentDidMount() {
        this.quantidadeItens()
    }

    render() {
        const {quantidadeItens} = this.state
        return (
            <div id="pedidos">
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
                                <Button id="button-menu">Meus Pedidos</Button>
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
            </div>
        )
    }

}

export default Pedidos

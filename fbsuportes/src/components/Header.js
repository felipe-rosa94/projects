import React from 'react'
import {AppBar, Button, CardMedia, Toolbar} from '@material-ui/core'
import '../style/header.css'
import logo from '../images/logo.png'

class Header extends React.Component {
    render() {
        return (
            <div id="header">
                <AppBar
                    id="appBar"
                    color="default">
                    <Toolbar id="toolbar" variant="dense">
                        <div id="main-toolbar">
                            <div id="toolbar-left">
                                <CardMedia id="img-logo" image={logo}/>
                            </div>
                            <div id="toolbar-center">
                                <Button id="button-menu" href="#section-produtos">Produtos</Button>
                                <Button id="button-menu">Minha Conta</Button>
                                <Button id="button-menu" href="#footer">Contato</Button>
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

export default Header

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
                    position="sticky"
                    color="default">
                    <Toolbar id="toolbar" variant="dense">
                        <div id="main-toolbar">
                            <div id="toolbar-left">
                                <CardMedia id="img-logo" image={logo}/>
                            </div>
                            <div id="toolbar-center">
                                <Button id="button-menu">Produtos</Button>
                                <Button id="button-menu">Clientes</Button>
                                <Button id="button-menu">Contato</Button>
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

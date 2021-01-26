import React from 'react'
import { withRouter } from 'react-router-dom'
import { CardMedia } from '@material-ui/core/'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import jvn from '../imagens/jvn.jpg'
import '../styles/toolbar.css'

class Toolbar extends React.Component {

    state = {}

    back = () => {
        this.props.history.goBack()
    }

    render() {
        const { buttonBack } = this.props
        return (
            <div id="appBar">
                <div id="toolbar">
                    <div id="toolbar-left">
                        <ArrowBackIcon id="btn-back" style={buttonBack ? { display: 'block' } : { display: 'none' }} onClick={this.back} />
                    </div>
                    <div id="toolbar-center">
                        <CardMedia id="logo" image={jvn} alt="" />
                    </div>
                    <div id="toolbar-right"></div>
                </div>


                {/* <div id="appBar">
                <div id="toolbar">
                    <div id="main-toolbar">
                        <div id="toolbar-left">
                            <CardMedia id="logo" image={insert} alt="" />
                        </div>
                        <div id="toolbar-right">
                            <Button id="menu-item" href="#podcasts">Podcasts</Button>
                            <Button id="menu-item">Feeds</Button>
                            <Button id="menu-item">Músicas</Button>
                            <Button id="menu-item">Filmes</Button>
                            <Button id="menu-item">Fotos</Button>                    
                        </div>
                    </div>
                </div>
            </div> */}
            </div>
        )
    }
}



export default withRouter(Toolbar)


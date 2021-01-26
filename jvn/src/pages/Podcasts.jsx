import React from 'react'
import { withRouter } from 'react-router-dom'
import Toolbar from '../components/Toolbar'
import ListaPodcasts from '../components/ListaPodcasts'
import MenuInferior from '../components/MenuInferior'

class Podcasts extends React.Component {
    render() {
        return (
            <div id="podcasts">
                <Toolbar buttonBack={false} />
                <ListaPodcasts home={false} />
                <MenuInferior pagina="podcasts" />
            </div>
        )
    }
}

export default withRouter(Podcasts)
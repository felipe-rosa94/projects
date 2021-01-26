import React from 'react'
import { withRouter } from 'react-router-dom'
import Toolbar from '../components/Toolbar'
import ListaPlanos from '../components/ListaPlanos'
import MenuInferior from '../components/MenuInferior'

class Planos extends React.Component {
    render() {
        return (
            <div id="planos">
                <Toolbar buttonBack={false} />
                <ListaPlanos home={false} />
                <MenuInferior pagina="planos" />
            </div>
        )
    }
}

export default withRouter(Planos)
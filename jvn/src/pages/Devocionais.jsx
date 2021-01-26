import React from 'react'
import { withRouter } from 'react-router-dom'
import Toolbar from '../components/Toolbar'
import ListaDevocionais from '../components/ListaDevocionais'
import MenuInferior from '../components/MenuInferior'

class Devocionais extends React.Component {
    render() {
        return (
            <div>
                <Toolbar buttonBack={false} />
                <ListaDevocionais home={false} />
                <MenuInferior pagina="devocionais" />
            </div>
        )
    }
}

export default withRouter(Devocionais)
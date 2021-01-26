import React from 'react'
import Toolbar from '../components/Toolbar'
import VerPlano from '../components/VerPlano'

class Plano extends React.Component {
    render() {
        const dados = this.props.location.state.dados
        return (
            <div>
                <Toolbar buttonBack={true} />
                <VerPlano dados={dados} />
            </div>
        )
    }
}

export default Plano
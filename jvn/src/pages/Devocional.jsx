import React from 'react'
import Toolbar from '../components/Toolbar'
import Ler from '../components/Ler'

class Devocional extends React.Component {
    render() {
        const obj = this.props.location.state.obj
        return (
            <div>
                <Toolbar buttonBack={true} />
                <Ler dados={obj} />
            </div>
        )
    }
}

export default Devocional
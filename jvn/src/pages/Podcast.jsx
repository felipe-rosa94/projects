import React from 'react'
import Toolbar from '../components/Toolbar'
import Player from '../components/Player'

class Podcast extends React.Component {

    componentDidMount() {
        window.scrollTo(0, 0)
        
    }

    render() {
        const obj = this.props.location.state.obj
        return (
            <div id="podcast">
                <Toolbar buttonBack={true} />
                <Player dados={obj} />
            </div>
        )
    }
}

export default Podcast
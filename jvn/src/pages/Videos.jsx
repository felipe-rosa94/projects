import React from "react"
import Toolbar from "../components/Toolbar"
import MenuInferior from "../components/MenuInferior"
import ListaVideos from "../components/ListaVideos"

class Videos extends React.Component {
    render() {
        return (
            <div>
                <Toolbar buttonBack={false}/>
                <ListaVideos home={false}/>
                <MenuInferior pagina="videos"/>
            </div>
        )
    }
}

export default Videos
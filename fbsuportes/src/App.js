import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from './pages/Home'
import Carrinho from './pages/Carrinho'
import Pedidos from './pages/Pedidos'

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/carrinho" component={Carrinho}/>
                <Route exact path="/pedidos" component={Pedidos}/>
            </Switch>
        </BrowserRouter>
    )
}

export default App

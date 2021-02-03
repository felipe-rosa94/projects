import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from './pages/Home'
import Carrinho from './pages/Carrinho'

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/carrinho" component={Carrinho}/>
            </Switch>
        </BrowserRouter>
    )
}

export default App

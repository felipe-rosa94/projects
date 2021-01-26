import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import {useSelector} from 'react-redux'

import Home from './pages/Home'
import Podcast from './pages/Podcast'
import Podcasts from './pages/Podcasts'
import Devocionais from './pages/Devocionais'
import Devocional from './pages/Devocional'
import Planos from './pages/Planos'
import Plano from './pages/Plano'
import LerPlano from './pages/LerPlano'
import NotFound from './pages/NotFound'
import Videos from "./pages/Videos"
import Inscricoes from "./pages/Inscricoes"

const App = () => {
    const isServiceWorkerUpdated = useSelector(
        state => state.serviceWorkerUpdated,
    );
    const serviceWorkerRegistration = useSelector(
        state => state.serviceWorkerRegistration,
    );

    const updateServiceWorker = () => {
        const registrationWaiting = serviceWorkerRegistration.waiting;

        if (registrationWaiting) {
            registrationWaiting.postMessage({type: 'SKIP_WAITING'})

            registrationWaiting.addEventListener('statechange', e => {
                if (e.target.state === 'activated') {
                    window.location.reload();
                }
            })
        }
    }

    return (
        <BrowserRouter>
            {isServiceWorkerUpdated && updateServiceWorker()}
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/podcasts" component={Podcasts}/>
                <Route exact path="/podcast" component={Podcast}/>
                <Route exact path="/devocionais" component={Devocionais}/>
                <Route exact path="/devocional" component={Devocional}/>
                <Route exact path="/planos" component={Planos}/>
                <Route exact path="/plano" component={Plano}/>
                <Route exact path="/lerPlano" component={LerPlano}/>
                <Route exact path="/videos" component={Videos}/>
                <Route exact path="/inscricoes" component={Inscricoes}/>
                <Route component={NotFound}/>
            </Switch>
        </BrowserRouter>
    )
}

export default App



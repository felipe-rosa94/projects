import React from 'react'
import {withRouter} from 'react-router-dom'
import {BottomNavigation, BottomNavigationAction} from '@material-ui/core'
import {HomeRounded, ContactlessRounded, Book, ImportContactsRounded, Subscriptions} from '@material-ui/icons'
import '../styles/menuInferior.css'

class MenuInferior extends React.Component {

    handleChange = (event, index) => {
        let pagina = this.props.history
        switch (index) {
            case 0:
                pagina.push('/')
                break
            case 1:
                pagina.push('/podcasts')
                break
            case 2:
                pagina.push('/devocionais')
                break
            case 3:
                pagina.push('/planos')
                break
            case 4:
                pagina.push('/videos')
                break
            default:
                break
        }
    }

    render() {
        let {pagina} = this.props
        return (
            <div>
                <BottomNavigation id="menu-footer" showLabels={true} onChange={this.handleChange}>
                    <BottomNavigationAction
                        label="Home" style={pagina === 'home' ? {color: '#fd9718'} : {color: 'white'}}
                        icon={<HomeRounded id="icons"
                                           style={pagina === 'home' ? {color: '#fd9718'} : {color: 'white'}}/>}/>
                    <BottomNavigationAction
                        label="Podcasts"
                        style={pagina === 'podcasts' ? {color: '#82af69'} : {color: 'white'}}
                        icon={<ContactlessRounded id="icons"
                                                  style={pagina === 'podcasts' ? {color: '#82af69'} : {color: 'white'}}/>}/>
                    <BottomNavigationAction
                        label="Devocionais"
                        style={pagina === 'devocionais' ? {color: '#009688'} : {color: 'white'}}
                        icon={<Book id="icons"
                                    style={pagina === 'devocionais' ? {color: '#009688'} : {color: 'white'}}/>}/>
                    <BottomNavigationAction
                        label="Planos"
                        style={pagina === 'planos' ? {color: '#546e7a'} : {color: 'white'}}
                        icon={<ImportContactsRounded id="icons"
                                                     style={pagina === 'planos' ? {color: '#546e7a'} : {color: 'white'}}/>}/>
                    <BottomNavigationAction
                        label="Vídeos"
                        style={pagina === 'videos' ? {color: '#f44336'} : {color: 'white'}}
                        icon={<Subscriptions id="icons"
                                             style={pagina === 'videos' ? {color: '#f44336'} : {color: 'white'}}/>}/>
                </BottomNavigation>
            </div>
        )
    }
}

export default withRouter(MenuInferior)
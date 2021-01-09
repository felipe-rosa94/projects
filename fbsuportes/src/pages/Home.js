import React from 'react'
import Header from '../components/Header'
import Section1 from '../components/Section1'
import Section2 from '../components/Section2'
import '../style/home.css'

class Home extends React.Component {
    render() {
        return (
            <div id="home">
                <Header/>
                <Section1/>
                <Section2/>
            </div>
        )
    }
}

export default Home

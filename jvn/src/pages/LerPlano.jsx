import React from 'react'
import Toolbar from '../components/Toolbar'
import { FormLabel } from '@material-ui/core'
import '../styles/lerPlano.css'

class LerPlano extends React.Component {
    render() {
        const { dados } = this.props.location.state
        return (
            <div>
                <Toolbar buttonBack={true} />
                <div id="ler-plano">
                    <div id="main-ler-plano">
                        {
                            dados.map((i, index) => {
                                return (
                                    <div key={index} id="capitulos">
                                        <FormLabel id="capitulo">{i.capitulos}</FormLabel>
                                        <div id="versiculos">
                                            {
                                                i.versiculos.map(i => {
                                                    return (
                                                        <FormLabel id="versiculo">{i}</FormLabel>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div >
        )
    }
}

export default LerPlano
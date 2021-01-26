import React from 'react'

import '../styles/ler.css'
import { CardMedia, FormLabel } from '@material-ui/core'

class Ler extends React.Component {

    render() {
        let { texto, titulo, imagem } = this.props.dados
        texto = texto.split('\n')
        return (
            <div id="ler">
                <div id="main-ler">

                    <FormLabel id="titulo-ler">{titulo}</FormLabel>

                    <div id="div-imagem-ler">
                        <CardMedia id="imagem-ler" image={imagem} />
                    </div>

                    <div id="div-texto">
                        {
                            // eslint-disable-next-line array-callback-return
                            texto.map((i, index) => {
                                if (i !== "") {
                                    return (
                                        <FormLabel key={index} id="texto-ler">
                                            {i}
                                        </FormLabel>
                                    )
                                }
                            })
                        }
                    </div>

                </div>
            </div>
        )
    }
}

export default Ler
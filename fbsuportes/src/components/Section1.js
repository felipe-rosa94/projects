import React from 'react'
import {CardMedia, FormLabel} from '@material-ui/core'
import '../style/section1.css'
import cover from '../images/cover.jpg'

class Section1 extends React.Component {
    render() {
        return (
            <div id="section-1">
                <div id="main-section-1">
                    <div id="div-section-1">
                        <CardMedia id="img-cover" image={cover}/>
                        <FormLabel id="label-title-cover">Facilitando seu cliente</FormLabel>
                        <FormLabel id="label-description-cover">
                            Suportes com qualidade e robustez para facilitar a ligação de seu sistema com seus clientes
                        </FormLabel>
                    </div>
                </div>
            </div>
        )
    }
}

export default Section1

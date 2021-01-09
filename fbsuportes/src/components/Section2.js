import React from 'react'
import '../style/section2.css'
import {FormLabel} from "@material-ui/core";

let array = [
    {
        produto: 'Suporte Tablet Cardápio Restaurante P/ Mesa C/ Antifurto',
        preco: 160
    },
    {
        produto: 'Suporte Tablet Cardápio Restaurante P/ Mesa',
        preco: 90
    }
]

class Section2 extends React.Component {


    render() {
        return (
            <div id="section-2">
                <div id="main-section-2">

                    <FormLabel>Produtos</FormLabel>


                </div>
            </div>
        )
    }
}

export default Section2

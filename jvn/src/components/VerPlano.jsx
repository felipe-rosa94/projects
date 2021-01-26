import React from 'react'
import { withRouter } from 'react-router-dom'
import { CardMedia, FormLabel, Card, CardContent } from '@material-ui/core'

import biblia from '../biblia.json'
import '../styles/verPlano.css'

class VerPlano extends React.Component {

    textos = (livro, capitulo, versiculo) => {
        capitulo = this.formatarIndice(capitulo)
        versiculo = this.formatarIndice(versiculo)
        livro = biblia[livro]
        let textos = []
        if (capitulo.length === 0) {
            livro.chapters
                .forEach((i, index) => {
                    let versiculos = []
                    i.forEach((texto, index) => {
                        versiculos.push(` ${++index} ${texto}`)
                    })
                    textos.push({
                        capitulos: `Capítulo ${++index}`,
                        versiculos: versiculos
                    })
                })
        } else if (capitulo.length === 2) {
            livro.chapters.splice(capitulo[0], capitulo[1])
                .forEach((i, index) => {
                    let versiculos = []
                    i.forEach((texto, index) => {
                        versiculos.push(` ${++index} ${texto}`)
                    })
                    textos.push({
                        capitulos: `Capítulo ${++index}`,
                        versiculos: versiculos
                    })
                })
        } else if (capitulo.length === 1) {
            if (versiculo.length === 1) {
                livro = livro.chapters[capitulo[0]].splice(versiculo[0], 1)
                let versiculos = []
                versiculos.push(` ${++versiculo[0]} ${livro[0]}`)
                textos.push({
                    capitulos: `Capítulo ${++capitulo[0]}`,
                    versiculos: versiculos
                })
            } else if (versiculo.length === 2) {
                let versiculos = []
                let cont = versiculo[0]
                livro.chapters[capitulo[0]].splice(versiculo[0], versiculo[1])
                    .forEach(i => {
                        versiculos.push(` ${++cont} ${i}`)
                    })
                textos.push({
                    capitulos: `Capítulo ${++capitulo[0]}`,
                    versiculos: versiculos
                })
            } else {
                livro.chapters.splice(capitulo[0], 1)
                    .forEach((i, index) => {
                        let versiculos = []
                        i.forEach((texto, index) => {
                            versiculos.push(` ${++index} ${texto}`)
                        })
                        textos.push({
                            capitulos: `Capítulo ${++capitulo[0]}`,
                            versiculos: versiculos
                        })
                    })
            }
        }
        this.props.history.push({ pathname: '/lerPlano', state: { dados: textos } })
    }

    formatarIndice = (indice) => {
        try {
            indice = indice.substring(1, indice.length - 1)
            indice = indice !== '' ? indice.split(',') : ''
            if (indice !== '') {
                let array = []
                indice.forEach((i, index) => {
                    array.push(parseInt(index === 0 ? (i - 1) : i))
                })
                return array
            }
            return indice
        } catch (error) {
            console.error(error)
        }
    }

    render() {
        let { titulo, descricao, imagem, plano } = this.props.dados
        return (
            <div id="plano">
                <div id="main-plano">
                    <div id="div-imagem-plano">
                        <CardMedia id="imagem-plano" image={imagem} />
                    </div>
                    <FormLabel id="titulo-plano">{titulo}</FormLabel>
                    <FormLabel id="descricao-plano">{descricao}</FormLabel>
                    {
                        plano.map((i, index) => {
                            let livro = biblia[i.livro].name
                            let capitulo = i.capitulo !== '' ? i.capitulo.substring(1, i.capitulo.length - 1) : ''
                            let versiculo = i.versiculo !== '' ? i.versiculo.substring(1, i.versiculo.length - 1) : ''
                            return (
                                <div key={index}>
                                    <Card id="card-plano" onClick={() => this.textos(i.livro, i.capitulo, i.versiculo)}>
                                        <CardContent id="card-content-plano">
                                            <FormLabel id="texto-leitura">{`${livro}${capitulo !== '' ? ` - ${capitulo}` : ``}${versiculo !== '' ? ` : ${versiculo}` : ``}`}</FormLabel>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        })

                    }
                </div>
            </div >
        )
    }
}

export default withRouter(VerPlano)
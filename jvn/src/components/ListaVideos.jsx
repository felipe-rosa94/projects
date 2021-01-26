import React from "react"
import firebase from "../firebase"
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles"
import {Card, CircularProgress, FormLabel} from "@material-ui/core"
import {isMobile} from "react-device-detect"
import YouTube from 'react-youtube'
import '../styles/listavideos.css'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#1e1e1e'
        }
    },
})

class ListaVideos extends React.Component {

    state = {
        videos: [],
        progress: true
    }

    _onReady(event) {
        event.target.pauseVideo()
    }

    videos = (limite) => {
        const {home} = this.props
        let context = this

        let dados = localStorage.getItem(`insert:videos`)
        dados = dados !== null ? JSON.parse(dados) : ''

        if (dados !== '') {
            context.listar(dados, limite, home)
        }

        firebase
            .database()
            .ref('Videos/')
            .once('value')
            .then(function (snapshot) {
                if (snapshot.val() !== null) {
                    dados = Object.values(snapshot.val())
                    localStorage.setItem(`insert:videos`, JSON.stringify(dados))
                    context.listar(dados, limite, home)
                }
            })
    }

    listar = (dados, limite, home) => {
        dados = dados.reverse()
        if (limite && home) {
            dados = dados.splice(0, 2)
            this.setState({progress: false, videos: dados})
        } else {
            this.setState({progress: false, videos: dados})
        }
    }

    componentDidMount() {
        this.videos(false)
    }

    render() {
        const {videos, progress} = this.state
        const {home} = this.props

        let opts
        if (isMobile) {
            opts = {
                height: '280',
                width: '370',
                playerVars: {
                    autoplay: 0,
                },
            }
        } else {
            opts = {
                height: '280',
                playerVars: {
                    autoplay: 0,
                },
            }
        }

        return (
            <div id="lista-videos">
                {
                    progress &&
                    <div id="progress">
                        <MuiThemeProvider theme={theme}>
                            <CircularProgress/>
                        </MuiThemeProvider>
                    </div>
                }
                <div id="main-videos">
                    {
                        videos.map((i, index) => (
                            <Card id="card-video" key={index}>
                                <div>
                                    <YouTube videoId={i.videoId} opts={opts} onReady={this._onReady}/>
                                    <div style={{margin: 8}}>
                                        <FormLabel id="descricao-video">{i.descricao}</FormLabel>
                                    </div>
                                </div>
                            </Card>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default ListaVideos
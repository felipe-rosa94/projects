import React from 'react'
import { CardMedia, FormLabel } from '@material-ui/core'
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded'
import PauseRoundedIcon from '@material-ui/icons/PauseRounded'
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded'
import VolumeDownRoundedIcon from '@material-ui/icons/VolumeDownRounded';
import VolumeUpRoundedIcon from '@material-ui/icons/VolumeUpRounded'

import ReactPlayer from 'react-player'
import Duration from '../components/Duration'

import '../styles/player.css'
import fileSaver from 'file-saver'


class Player extends React.Component {

    state = {
        duracao: 0,
        play: false,
        volume: 0.8,
        controles: false,
        played: 0
    }

    handleVolumeChange = e => {
        this.setState({ volume: parseFloat(e.target.value) })
    }

    handleSeekMouseDown = e => {
        this.setState({ seeking: true })
    }

    handleSeekChange = e => {
        this.setState({ played: parseFloat(e.target.value) })
    }

    handleSeekMouseUp = e => {
        this.setState({ seeking: false })
        this.player.seekTo(parseFloat(e.target.value))
    }

    handleProgress = state => {
        console.log('onProgress', state)
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state)
        }
    }

    handleDuration = (duration) => {
        console.log('onDuration', duration)
        this.setState({ duration })
    }

    controles = () => {
        this.setState({ controles: true, play: true })
    }

    playPause = () => {
        const { play } = this.state
        this.setState({ play: !play })
    }

    download = (url) => {
        fileSaver.saveAs(url)
    }

    ref = player => {
        this.player = player
    }

    render() {

        const { imagem, titulo, duracao, data, descricao, audio } = this.props.dados

        return (
            <div id="player" >
                <div id="card-player">
                    <CardMedia id="imagem-player" image={imagem} />
                    <div id="card-descritivo">
                        <div id="descricao-player">
                            <FormLabel id="titulo-player">{titulo}</FormLabel>
                            <FormLabel id="descricao-player">{`${duracao} - ${data} - Por Felipe, Ueliton e Willy`}</FormLabel>
                        </div>
                        <div>
                            <div id="btn-acoes" onClick={this.controles}>
                                <PlayArrowRoundedIcon id="icon" />
                                <FormLabel id="text-acoes">Play</FormLabel>
                            </div>
                        </div>
                        <div>
                            <div id="btn-acoes" onClick={() => this.download(audio)}>
                                <GetAppRoundedIcon id="icon" />
                                <FormLabel id="text-acoes">Download</FormLabel>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="card-sinopse">
                    <p id="texto-sinopse">
                        <strong>Neste Podcast: </strong>
                        {descricao}
                    </p>
                </div>
                {
                    this.state.controles &&
                    <div id="footer" >
                        <div id="footer-left">
                            <ReactPlayer
                                ref={this.ref}
                                width="0px"
                                height="0px"
                                url={audio}
                                volume={this.state.volume}
                                playing={this.state.play}
                                onDuration={this.handleDuration}
                                onProgress={this.handleProgress}
                                onSeek={e => console.log('onSeek', e)} />
                            {
                                !this.state.play ? <PlayArrowRoundedIcon id="icon-play-pause" onClick={this.playPause} /> : <PauseRoundedIcon id="icon-play-pause" onClick={this.playPause} />
                            }
                            <FormLabel id="text-footer">{titulo}</FormLabel>
                        </div>

                        <div id="footer-right">
                            <div id="seek">
                                <FormLabel id="time">{<Duration seconds={this.state.duration * this.state.played} />}</FormLabel>
                                <input
                                    id="progress"
                                    type='range' min={0} max={0.999999} step='any'
                                    value={this.state.played}
                                    onMouseDown={this.handleSeekMouseDown}
                                    onChange={this.handleSeekChange}
                                    onMouseUp={this.handleSeekMouseUp} />
                                <FormLabel id="time">{<Duration seconds={this.state.duration * (1 - this.state.played)} />}</FormLabel>
                            </div>
                            <div id="volume">
                                <VolumeDownRoundedIcon id="icon-play-pause" />
                                <input id="progress" type='range' min={0} max={1} step='any' value={this.state.volume} onChange={this.handleVolumeChange} />
                                <VolumeUpRoundedIcon id="icon-play-pause" />
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default Player
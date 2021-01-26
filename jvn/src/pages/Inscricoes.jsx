import React from "react"
import Toolbar from "../components/Toolbar"
import {
    Button,
    Box,
    Card,
    Checkbox,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    FormLabel,
    FormControlLabel,
    TextField,
    Radio,
    RadioGroup,
    Snackbar, Divider
} from "@material-ui/core"
import {createMuiTheme, MuiThemeProvider, withStyles} from '@material-ui/core/styles'
import QRCode from 'qrcode.react'
import meme from '../imagens/meme.jpg'
import retiro from '../imagens/retiro.png'
import '../styles/inscricoes.css'
import firebase from '../firebase'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#000000'
        },
        secondary: {
            main: '#FFFFFF'
        }
    },
})

const Check = withStyles({
    root: {
        color: '#000000',
        '&$checked': {
            color: '#000000',
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />)

const RedRadio = withStyles({
    root: {
        color: '#000000',
        '&$checked': {
            color: '#000000',
        },
    },
    checked: {},
})(props => <Radio color="default" {...props} />)

class Inscricoes extends React.Component {

    state = {
        inscricao: '',
        nome: '',
        cpf: '',
        data: '',
        telefone: '',
        email: '',
        tamanho: '',
        snackBar: '',
        vagas: '',
        caronas: [],
        camiseta: false,
        openSnackBar: false,
        openVaga: false,
        openVerVagas: false
    }

    handleInputs = e => {
        if (e.target.name === 'data') {
            this.setState({[e.target.name]: this.mascaraData(e.target.value)})
        } else if (e.target.name === 'cpf') {
            if (e.target.value.length <= 14)
                this.setState({[e.target.name]: this.mascaraCpf(e.target.value)})
        } else if (e.target.name === 'telefone') {
            if (e.target.value.length <= 15)
                this.setState({[e.target.name]: this.mascaraTelefone(e.target.value)})
        } else {
            this.setState({[e.target.name]: e.target.value})
        }
    }

    onCheck = checked => {
        this.setState({camiseta: checked})
    }

    onRadio = e => {
        this.setState({tamanho: e.target.value})
    }

    onClickInscrever = () => {
        const {nome, cpf, data, telefone, email} = this.state

        if (nome === '') {
            this.setState({openSnackBar: true, snackBar: 'Ei escrever teu nome direito, oxê!!!'})
            return
        } else if (!this.validaCPF(cpf)) {
            this.setState({openSnackBar: true, snackBar: 'Quer me passar um golpe com o CPF falso ?'})
            return
        } else if (data.length < 10) {
            this.setState({openSnackBar: true, snackBar: 'O Formato da data de está errado.'})
            return
        } else if (telefone === '' || telefone.length < 10) {
            this.setState({
                openSnackBar: true,
                snackBar: 'Atah não quer e pssar o telefone, e coloca esse DDD não sou profeta'
            })
            return
        }

        let ctx = this
        let key = new Date()
        key = key.getTime()

        let jovem = {
            nome: nome,
            dataNascimento: data,
            cpf: cpf,
            telefone: telefone,
            email: email
        }

        let inscricao = {
            nome: nome,
            cpf: cpf,
            key: key,
            telefone: telefone,
            email: email,
            confirmado: false
        }

        firebase
            .database()
            .ref(`Inscritos/${this.clearText(inscricao.cpf)}`)
            .set(inscricao)
            .then((data) => {
                ctx.setState({openSnackBar: true, snackBar: 'Salvo com sucesso brother.'})
            }).catch((error) => {
            alert(error)
        })

        firebase
            .database()
            .ref(`Jovem/${this.clearText(jovem.cpf)}`)
            .set(jovem)
            .then((data) => {

            }).catch((error) => {

        })

        this.setState({inscricao: JSON.stringify(inscricao)})
        localStorage.setItem(`jvn:inscricao`, JSON.stringify(inscricao))
    }

    clearText = text => {
        text = text.replace(/[^\d]+/g, '')
        return text.trim()
    }

    mascaraData = data => {
        let v = data.replace(/\D/g, '').slice(0, 10);
        if (v.length >= 5) {
            return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
        } else if (v.length >= 3) {
            return `${v.slice(0, 2)}/${v.slice(2)}`;
        }
        return v
    }

    mascaraCpf = cpf => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4")
    }

    mascaraTelefone = telefone => {
        if (telefone !== '')
            return telefone.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2')
    }

    validaCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf === '') return false;
        if (cpf.length !== 11 ||
            cpf === "00000000000" ||
            cpf === "11111111111" ||
            cpf === "22222222222" ||
            cpf === "33333333333" ||
            cpf === "44444444444" ||
            cpf === "55555555555" ||
            cpf === "66666666666" ||
            cpf === "77777777777" ||
            cpf === "88888888888" ||
            cpf === "99999999999")
            return false;
        let add = 0;
        let rev
        for (let i = 0; i < 9; i++)
            add += parseInt(cpf.charAt(i)) * (10 - i);
        rev = 11 - (add % 11);
        if (rev === 10 || rev === 11)
            rev = 0;
        if (rev !== parseInt(cpf.charAt(9)))
            return false;
        add = 0;
        for (let i = 0; i < 10; i++)
            add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev === 10 || rev === 11)
            rev = 0;
        if (rev !== parseInt(cpf.charAt(10)))
            return false;
        return true;
    }

    /*calcularIdade = data => {
        if (data !== '' && data.length === 10) {
            let nascimento = data.split("/")
            let dataNascimento = new Date(parseInt(nascimento[2], 10), parseInt(nascimento[1], 10) - 1, parseInt(nascimento[0], 10))
            let diferenca = Date.now() - dataNascimento.getTime()
            let idade = new Date(diferenca)
            return Math.abs(idade.getUTCFullYear() - 1970)
        } else {
            return 0
        }
    }*/

    onClickCarona = () => {
        const {nome, vagas, telefone} = this.state
        let key = new Date()
        key = key.getTime()
        let json = {
            motorista: nome,
            vagas: vagas,
            telefone: telefone !== undefined ? telefone : ''
        }
        let ctx = this
        firebase
            .database()
            .ref(`Carona/${key}`)
            .set(json)
            .then((data) => {
                ctx.setState({openSnackBar: true, snackBar: 'Salvo com sucesso brother.'})
            }).catch((error) => {
            console.log('error ', error)
        })
        this.setState({openVaga: false})
    }

    onClickVerCarona = () => {
        let ctx = this
        this.setState({openSnackBar: true, snackBar: 'Baixando lista de motoristas.'})
        firebase
            .database()
            .ref('Carona/')
            .once('value')
            .then(function (snapshot) {
                if (snapshot.val() !== null) {
                    ctx.setState({openVerVagas: true, caronas: Object.values(snapshot.val())})
                }
            })
    }

    cancelar = () => {
        localStorage.removeItem(`jvn:inscricao`)
        this.setState({
            inscricao: '', nome: '',
            cpf: '',
            data: '',
            telefone: '',
            email: '',
            tamanho: '',
            snackBar: '',
            camiseta: false,
            openSnackBar: false,
        })
    }

    config = () => {
        let inscricao = localStorage.getItem(`jvn:inscricao`)

        try {
            let teste = JSON.parse(inscricao)
            if (teste.confirmado === undefined) {
                localStorage.removeItem(`jvn:inscricao`)
                return
            }
        } catch (e) {

        }

        this.setState({inscricao: inscricao})
    }

    componentDidMount() {
        this.config()
    }

    /*Esse retiro teremos camisetas também, só que estão com valor a parte, apenas R$
                                        18,00,
                                        então
                                        marca se tu quer camisa abaixo e escolhe teu tamanho.
                                        Ah mais uma coisa: não teremos ônibus! Então já conserva com um amigo que vá de
                                        carro e
                                        pedi
                                        uma carona, ou dá uma olhada no sistema de caronas após a inscrição, qualquer
                                        coisa
                                        fala com
                                        líderes da JVN, e acho que é isso UFA!!, termina de te inscrever abaixo e é nós.*/

    render() {
        const {
            camiseta,
            caronas,
            openSnackBar,
            snackBar,
            inscricao,
            openVaga,
            openVerVagas,
            nome,
            telefone,
            data,
            cpf
        } = this.state
        return (
            <MuiThemeProvider theme={theme}>
                <div>
                    <Toolbar buttonBack={true}/>
                    {
                        inscricao ?
                            <div id="inscricoes">
                                <div id="main-qrcode">
                                    <FormLabel id="titulo-retiro">Inscrição finalizada</FormLabel>
                                    <FormLabel id="info-retiro">
                                        Agora esse QR Code ficará salvo aqui apresente ele aos lideres da JVN,
                                        junto com o pagamento, e vamo dalhe.
                                    </FormLabel>

                                    <FormLabel id="info-retiro">
                                        <strong>Menores de 16 precisam da assinatura dos responsáveis</strong>
                                    </FormLabel>

                                    <FormLabel id="info-retiro">
                                        imprima e entregue junto com o pagamento.
                                    </FormLabel>

                                    <FormLabel id="info-retiro" style={{lineHeight: 1.5}}>
                                        {
                                            `Eu _________________ responsavél 
                                            pelo jovem _________________
                                            autorizo sua participação no Retiro da JVN nós dias 13, 14 e 15 de Fevereiro`
                                        }
                                    </FormLabel>

                                    <FormLabel id="info-retiro">
                                        Assinatura: _________________
                                    </FormLabel>

                                    <div id="div-qrcode">
                                        <QRCode value={inscricao}/>
                                    </div>
                                    <FormLabel id="info-retiro" onClick={() => window.print()}>Imprimir</FormLabel>
                                    <FormLabel id="info-retiro" onClick={this.cancelar}>Cancelar inscrição</FormLabel>
                                    <div id="div-botoes">
                                        <Button variant="outlined" color="secondary" id="botao-carona"
                                                onClick={() => this.setState({openVaga: true})}>
                                            Tenho vaga no carro
                                        </Button>
                                        <Button variant="outlined" color="secondary" id="botao-carona"
                                                onClick={this.onClickVerCarona}>
                                            Preciso de carona
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            :
                            <div id="inscricoes">
                                <div id="main-inscricoes">
                                    <CardMedia id="logo-retiro" image={retiro}/>
                                    <FormLabel id="titulo-retiro">2021 chegou e com ele vem o nosso retiro</FormLabel>
                                    <CardMedia id="meme" image={meme}/>
                                    <FormLabel id="info-retiro">
                                        <strong>Galera!!!</strong> Nosso retiro acontecerá nos dias 13, 14 e 15 de
                                        Fevereiro,
                                        só para membros da Igreja acima de 16 anos,
                                        o valor da inscrição será R$ 80,00.
                                    </FormLabel>
                                    <FormLabel id="info-retiro">
                                        Qualquer coisa fala com líderes da JVN.
                                    </FormLabel>

                                    <Card id="div-dados">
                                        <CardContent>
                                            <TextField id="label-text" margin="dense" name="nome" label="Nome" fullWidth
                                                       variant="outlined"
                                                       onChange={this.handleInputs}/>

                                            <div id="div-cpf-data">
                                                <TextField id="label-text" margin="dense" name="cpf" label="CPF"
                                                           fullWidth
                                                           variant="outlined"
                                                           value={cpf}
                                                           onChange={this.handleInputs}/>
                                                <Box p={1}/>
                                                <TextField id="label-text" margin="dense" name="data"
                                                           label="Data Nascimento" fullWidth
                                                           variant="outlined"
                                                           value={data}
                                                           placeholder="01/01/2001"
                                                           onChange={this.handleInputs}/>
                                            </div>

                                            <div id="div-cpf-data">
                                                <TextField id="label-text" margin="dense" name="telefone"
                                                           label="Telefone"
                                                           fullWidth
                                                           value={telefone}
                                                           placeholder="(00) 0000-0000"
                                                           variant="outlined"
                                                           onChange={this.handleInputs}/>
                                                <Box p={1}/>
                                                <TextField id="label-text" margin="dense" name="email" label="E-mail"
                                                           fullWidth
                                                           variant="outlined" placeholder="Opcional"
                                                           onChange={this.handleInputs}/>
                                            </div>

                                            {/*{
                                                false &&
                                                <FormControlLabel id="check-camiseta" control={<Check/>}
                                                                  label="Quero a camiseta"
                                                                  onChange={(event, checked) => this.onCheck(checked)}/>
                                            }*/}

                                            {
                                                camiseta &&
                                                <div style={{marginTop: 8}}>
                                                    <FormLabel>Escolha o tamanho da camiseta</FormLabel>
                                                    <RadioGroup>
                                                        <FormControlLabel id="radio" value="pp"
                                                                          control={<RedRadio/>}
                                                                          label="PP"
                                                                          onChange={this.onRadio}/>
                                                        <FormControlLabel id="radio" value="p"
                                                                          control={<RedRadio/>}
                                                                          label="P"
                                                                          onChange={this.onRadio}/>
                                                        <FormControlLabel id="radio" value="m"
                                                                          control={<RedRadio/>}
                                                                          label="M"
                                                                          onChange={this.onRadio}/>
                                                        <FormControlLabel id="radio" value="g"
                                                                          control={<RedRadio/>}
                                                                          label="G"
                                                                          onChange={this.onRadio}/>
                                                        <FormControlLabel id="radio" value="gg"
                                                                          control={<RedRadio/>}
                                                                          label="GG"
                                                                          onChange={this.onRadio}/>
                                                        <FormControlLabel id="radio" value="xxg"
                                                                          control={<RedRadio/>}
                                                                          label="XXG"
                                                                          onChange={this.onRadio}/>
                                                    </RadioGroup>
                                                </div>
                                            }
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginTop: 8
                                            }}>
                                                <Button variant="outlined"
                                                        onClick={this.onClickInscrever}>Inscrever-se</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                    }

                    <Dialog
                        open={openVaga}
                        onClose={() => this.setState({openVaga: false})}
                        aria-labelledby="form-dialog-title">
                        <DialogContent>
                            <DialogContentText>
                                Informe seu nome e o número de vagas disponíveis
                            </DialogContentText>
                            <TextField id="label-text" margin="dense" name="nome" label="Nome"
                                       fullWidth
                                       value={nome}
                                       variant="outlined"
                                       onChange={this.handleInputs}/>
                            <TextField id="label-text" margin="dense" name="vagas" label="Vagas"
                                       fullWidth
                                       type="number"
                                       variant="outlined"
                                       onChange={this.handleInputs}/>
                            <TextField id="label-text" margin="dense" name="telefone"
                                       label="Telefone"
                                       value={telefone}
                                       fullWidth
                                       placeholder="(00) 0000-0000"
                                       variant="outlined"
                                       onChange={this.handleInputs}/>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={this.onClickCarona}>Confirmar</Button>
                            <Button onClick={() => this.setState({openVaga: false})}
                                    color="primary">Cancelar</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={openVerVagas}
                        onClose={() => this.setState({openVerVagas: false})}
                        aria-labelledby="form-dialog-title">
                        <DialogContent>
                            <FormLabel style={{
                                margin: 6,
                                color: '#1e1e1e',
                                fontSize: 18,
                                padding: 0,
                                display: "flex",
                                justifyContent: "center",
                                textAlign: "center"
                            }}>
                                Aqui está uma lista de motoristas que tem vaga no carro, entre em
                                contato com eles para
                                organizarem a viajem.
                            </FormLabel>
                            <Divider/>
                            {
                                caronas.map(i => (
                                    <Card style={{margin: 6}}>
                                        <CardContent
                                            style={{
                                                padding: 4,
                                                display: "flex",
                                                flexDirection: "column"
                                            }}>
                                            <FormLabel style={{
                                                margin: 4,
                                                color: '#1e1e1e'
                                            }}>{`Motorista: ${i.motorista}`}</FormLabel>
                                            <FormLabel style={{
                                                margin: 4,
                                                color: '#1e1e1e'
                                            }}>{`Telefone para contato: ${i.telefone}`}</FormLabel>
                                            <FormLabel style={{
                                                margin: 4,
                                                color: '#1e1e1e'
                                            }}>{`Vagas disponíveis: ${i.vagas}`}</FormLabel>
                                        </CardContent>
                                    </Card>
                                ))
                            }
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.setState({openVerVagas: false})}
                                    color="primary">Fechar</Button>
                        </DialogActions>
                    </Dialog>

                    <Snackbar
                        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                        open={openSnackBar}
                        autoHideDuration={3000}
                        onClose={() => this.setState({openSnackBar: false})}
                        message={snackBar}
                    />
                </div>
            </MuiThemeProvider>
        )
    }

}

export default Inscricoes

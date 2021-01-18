import React from 'react'
import {FormLabel} from '@material-ui/core'
import {WhatsApp, Mail} from '@material-ui/icons'
import '../style/footer.css'

class Footer extends React.Component {
    render() {
        return (
            <footer id="footer">

                <section id="footer-body">

                    <section id="footer-left">
                        <FormLabel id="form-label-titulo">FB Suportes</FormLabel>
                        <FormLabel id="form-label-descricao-footer">
                            Suportes com qualidade e robustez para facilitar a ligação de seu sistema com seus clientes
                        </FormLabel>
                        <section id="footer-icone-label">
                            <WhatsApp id="icone"/>
                            <FormLabel id="form-label-fone">(51) 99598-3880</FormLabel>
                        </section>
                        <section id="footer-icone-label">
                            <Mail id="icone"/>
                            <FormLabel id="form-label-email">fabio@fbsuportes.com.br</FormLabel>
                        </section>
                    </section>

                    <section id="footer-right">
                        <FormLabel id="form-label-titulo">Enviar Mensagem</FormLabel>

                        <input id="input-footer" placeholder="Nome"/>

                        <input id="input-footer" placeholder="Telefone"/>

                        <textarea id="input-footer" type="" placeholder="Mensagem"/>

                        <div id="botao-enviar">Enviar</div>


                    </section>
                </section>

            </footer>
        )
    }
}

export default Footer

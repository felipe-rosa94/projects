const axios = require('axios')

exports.post = ('/', (req, res, next) => {
    const {origem, destino} = req.body
    getDeliveryValues(res, origem, destino)
})

const getDeliveryValues = async (res, origem = '', destino = '', altura = '50', largura = '50', comprimento = '50', peso = '500') => {
    let fretes = []

    fretes.push({
        valor: 0,
        tipo: `Combinar a entrega`
    })

    for (const i of ['pac', 'sedex']) {
        let index = ['pac', 'sedex'].indexOf(i)
        let tipo = index ? 'sedex' : 'pac'

        let URL_BASE = 'http://webservice.kinghost.net/web_frete.php?auth=0dd752ad2a1455f7be761d450d84b240'
        let PARAMS = `&tipo=${tipo}&formato=json&cep_origem=${origem}&cep_destino=${destino}&cm_altura=${altura}&cm_largura=${largura}&cm_comprimento=${comprimento}&peso=${peso}`
        let url = `${URL_BASE}${PARAMS}`

        let config = {
            method: 'get',
            url: url
        }

        await axios(config)
            .then(function (response) {
                let {valor, prazo_entrega} = response.data
                fretes.push({
                    valor: parseFloat(valor),
                    tipo: `${tipo.toUpperCase()} ${parseFloat(valor).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })}, ${prazo_entrega} ${prazo_entrega === '1' ? 'Dia' : 'Dias'}`,
                })
            })
            .catch(function (error) {
                res.status(400).send({returnCode: 0, message: error})
            })
    }
    res.status(200).send({returnCode: 1, fretes: fretes})
}



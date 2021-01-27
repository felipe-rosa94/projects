const showData = data => {
    if (data) {
        data = data.split('').reverse().join('')
        data = atob(data)
        return JSON.parse(data)
    }
}

const hideData = data => {
    if (data) {
        data = JSON.stringify(data)
        data = btoa(data)
        data = data.split('').reverse().join('')
        return data
    }
}

const phoneMask = phone => {
    if (phone !== '' && phone !== undefined) {
        phone = phone.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2')
        return phone.substring(0, 14)
    }
}

const cpfMask = cpf => {
    if (cpf !== '' && cpf !== undefined) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4")
        return cpf.substring(0, 14)
    }
}

const cepMask = cep => {
    cep = removeCharacter(cep)
    return cep.substring(0, 8)
}

const mcc = v => {
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{4})/g, "$1 ");
    v = v.replace(/\.$/, "");
    v = v.substring(0, 19)
    return v;
}

const removeCharacter = text => {
    text = text.replace(/[^\d]+/g, '')
    return text.trim()
}

const getDeliveryValues = async (origem = '', destino = '', altura = '50', largura = '50', comprimento = '50', peso = '500') => {

    let fretes = []

    fretes.push({
        valor: 0,
        tipo: `Retirar com o vendedor, dia a combinar`
    })

    for (const i of ['pac', 'sedex']) {
        let index = ['pac', 'sedex'].indexOf(i)
        let tipo = index ? 'sedex' : 'pac'

        let URL_BASE = 'http://webservice.kinghost.net/web_frete.php?auth=0dd752ad2a1455f7be761d450d84b240'
        let PARAMS = `&tipo=${tipo}&formato=json&cep_origem=${origem}&cep_destino=${destino}&cm_altura=${altura}&cm_largura=${largura}&cm_comprimento=${comprimento}&peso=${peso}`
        let url = `https://cors-anywhere.herokuapp.com/${URL_BASE}${PARAMS}`

        let {valor, prazo_entrega} = await fetch(url).then((response) => response.json())

        if (!valor || !prazo_entrega) {
            alert('CEP inválido')
            break
        }

        fretes.push({
            valor: parseFloat(valor),
            tipo: `${tipo.toUpperCase()} ${parseFloat(valor).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })}, ${prazo_entrega} ${prazo_entrega === '1' ? 'Dia' : 'Dias'}`,
        })
    }
    return fretes
}

const getAddress = async cep => {
    let url = `https://viacep.com.br/ws/${cep}/json/`
    return await fetch(url).then((response) => response.json())
}

export {hideData, showData, phoneMask, cpfMask, cepMask, mcc, removeCharacter, getDeliveryValues, getAddress}

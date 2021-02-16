const showData = data => {
    try {
        if (data !== null && data !== undefined) {
            data = data.split('').reverse().join('')
            data = atob(data)
            return JSON.parse(data)
        }
    } catch (e) {

    }
}

const hideData = data => {
    if (data !== null && data !== undefined) {
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

const cpfMask = campoTexto => {
    if (campoTexto.length <= 11) {
        campoTexto = removeCharacter(campoTexto)
        return mascaraCpf(campoTexto)
    } else {
        campoTexto = removeCharacter(campoTexto)
        return mascaraCnpj(campoTexto).substring(0, 18)
    }
}

const mascaraCpf = valor => {
    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4")
}

const mascaraCnpj = valor => {
    return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3.\$4\-\$5")
}

const cepMask = cep => {
    cep = removeCharacter(cep)
    return cep.substring(0, 8)
}

const dateMask = date => {
    let v = date.replace(/\D/g, '').slice(0, 10)
    if (v.length >= 5) {
        return `${v.slice(0, 2)}/${v.slice(4)}`
    } else if (v.length >= 3) {
        return `${v.slice(0, 2)}/${v.slice(2)}`
    }
    return v
}

const cardMask = v => {
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{4})/g, "$1 ");
    v = v.replace(/\.$/, "");
    v = v.substring(0, 19)
    return v;
}

const ccvMask = cvv => {
    cvv = removeCharacter(cvv)
    return cvv.substring(0, 4)
}

const removeCharacter = text => {
    text = text.replace(/[^\d]+/g, '')
    return text.trim()
}

const getDeliveryValues = async (origem = '', destino = '', altura = '50', largura = '50', comprimento = '50', peso = '500') => {

    let json = {
        origem: origem,
        destino: destino,
        altura: altura,
        largura: largura,
        comprimento: comprimento,
        peso: peso
    }

    let url = 'https://whiledev.com.br:21045/calculaFrete'
    let {fretes} = await fetch(url, {method: 'post', body: JSON.stringify(json)}).then((response) => response.json())
    return fretes
}

const getAddress = async cep => {
    let url = `https://viacep.com.br/ws/${cep}/json/`
    return await fetch(url).then((response) => response.json())
}

export {
    hideData,
    showData,
    phoneMask,
    cpfMask,
    cepMask,
    dateMask,
    cardMask,
    ccvMask,
    removeCharacter,
    getDeliveryValues,
    getAddress
}

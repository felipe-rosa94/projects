function onCreate() {
    window.Mercadopago.setPublishableKey('TEST-bb26eadd-f187-4249-b04a-42351a53b7d5')
    window.Mercadopago.getIdentificationTypes()
    showProducts()
    discount()
    delivery()
    total()
    cliente()
}

document.getElementById('cardNumber').addEventListener('change', guessPaymentMethod);

function guessPaymentMethod(event) {
    let cardnumber = document.getElementById("cardNumber").value;
    if (cardnumber.length >= 6) {
        let bin = cardnumber.substring(0, 6);
        window.Mercadopago.getPaymentMethod({
            "bin": bin
        }, setPaymentMethod);
    }
};

function setPaymentMethod(status, response) {
    if (status == 200) {
        let paymentMethod = response[0];
        document.getElementById('paymentMethodId').value = paymentMethod.id;

        getIssuers(paymentMethod.id);
    } else {
        console.log(`payment method info error: ${response}`)
        alert(`payment method info error: ${response}`);
    }
}

function getIssuers(paymentMethodId) {
    window.Mercadopago.getIssuers(
        paymentMethodId,
        setIssuers
    );
}

function setIssuers(status, response) {
    if (status == 200) {
        let issuerSelect = document.getElementById('issuer');
        response.forEach(issuer => {
            let opt = document.createElement('option');
            opt.text = issuer.name;
            opt.value = issuer.id;
            issuerSelect.appendChild(opt);
        });

        getInstallments(
            document.getElementById('paymentMethodId').value,
            document.getElementById('transactionAmount').value,
            issuerSelect.value
        );
    } else {
        alert(`issuers method info error: ${response}`);
    }
}

function getInstallments(paymentMethodId, transactionAmount, issuerId) {
    window.Mercadopago.getInstallments({
        "payment_method_id": paymentMethodId,
        "amount": parseFloat(transactionAmount),
        "issuer_id": parseInt(issuerId)
    }, setInstallments);
}

function setInstallments(status, response) {
    if (status == 200) {
        document.getElementById('installments').options.length = 0;
        response[0].payer_costs.forEach(payerCost => {
            let opt = document.createElement('option');
            opt.text = payerCost.recommended_message;
            opt.value = payerCost.installments;
            document.getElementById('installments').appendChild(opt);
        });
    } else {
        alert(`installments method info error: ${response}`);
    }
}

doSubmit = false;
document.getElementById('paymentForm').addEventListener('submit', getCardToken);

function getCardToken(event) {
    event.preventDefault();
    if (!doSubmit) {
        let $form = document.getElementById('paymentForm');
        window.Mercadopago.createToken($form, setCardTokenAndPay);
        return false;
    }
};

function setCardTokenAndPay(status, response) {
    if (status == 200 || status == 201) {

        let cliente = showData(localStorage.getItem(`fb:cliente`))
        let delivery = showData(localStorage.getItem(`fb:tipoEntrega`))
        let total = showData(localStorage.getItem(`fb:total`))

        let json = {
            token: response.id,
            delivery: delivery,
            client: cliente,
            total: total
        }

        let url = 'https://whiledev.com.br:21045/mercadoPago'
        let config = {method: 'post', body: JSON.stringify(json)}

        fetch(url, config)
            .then((data) => data.json())
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })

    } else {
        alert("Verify filled data!\n" + JSON.stringify(response, null, 4));
    }
}

const showProducts = () => {
    let products = showData(localStorage.getItem(`fb:itens`))
    products.forEach(i => {
        labels(i)
    })
}

const discount = () => {
    let discount = showData(localStorage.getItem(`fb:valorDesconto`))
    if (discount) {
        let label = document.getElementById('title-label-price-discount')
        label.innerText = discount.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    }
}

const delivery = () => {
    let delivery = showData(localStorage.getItem(`fb:tipoEntrega`))
    if (delivery) {
        let label = document.getElementById('title-label-price-delevery')
        label.innerText = delivery.valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    }
}

const total = () => {
    let total = showData(localStorage.getItem(`fb:total`))
    if (total) {
        let label = document.getElementById('title-label-price-total')
        label.innerText = total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    }
}

const cliente = () => {
    let cliente = showData(localStorage.getItem(`fb:cliente`))

    let docType = document.getElementById('docType')
    let index = cliente.cpf.length === 14 ? 0 : 1
    docType.options[index].selected = true

    let docNumber = document.getElementById('docNumber')
    docNumber.value = cliente.cpf
}

const labels = objeto => {
    const {produto: {nome, preco}, quantidade} = objeto

    let container = document.getElementById('div-products')
    let div = document.createElement('div')
    let product = document.createElement('label')
    let price = document.createElement('label')

    product.id = 'title-label-product'
    price.id = 'title-label-price'
    div.id = 'div-description-prices'

    product.innerText = nome
    price.innerText = (preco * quantidade).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})

    div.appendChild(product)
    div.appendChild(price)

    container.appendChild(div)
}

const showData = data => {
    if (data) {
        data = data.split('').reverse().join('')
        data = atob(data)
        return JSON.parse(data)
    }
}

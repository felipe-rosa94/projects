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

export {hideData, showData}

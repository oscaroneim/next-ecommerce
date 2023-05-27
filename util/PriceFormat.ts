const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-UK', {
        style: 'currency',
        currency: 'GBP'
    }).format(amount / 100)
}

export default formatPrice
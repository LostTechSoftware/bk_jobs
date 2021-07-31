const { format } = require('date-fns')

module.exports = ({ boleto, now }) => {
  return `
        <h1>Seu boleto FoodZilla foi gerado com vencimento em ${format(now, 'dd-MM-yy')}</h1>
        <h6>Evite bloqueios, qualquer duvida contate-nos clicando <a href="tel:+5519991029113">aqui</a></h6>
        <p>O link do seu boleto: <a>${boleto.invoiceUrl}</a></p>
    `
}

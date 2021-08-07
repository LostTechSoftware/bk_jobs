const { format } = require('date-fns')

module.exports = ({ now, c, franchisee }) => {
  return `
  <h1>Hoje no dia ${format(now, 'dd-MM-yy')}, foi fechado o faturamento da cidade ${c.city_Name}, e o seu lucro foi de: ${(
    (c.revenues * franchisee.percentage) /
    100
  ).toLocaleString('pt-br', {
    currency: 'brl',
    style: 'currency',
  })}, não seu preocupe que o seu pagamento será efetuado em breve!</h1>
`
}

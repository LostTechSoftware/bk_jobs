const { format } = require('date-fns')

module.exports = ({ now, c }) => {
  return `
    <h1>Hoje no dia ${format(now, 'dd-MM-yy')}, foi fechado o faturamento da cidade ${
    c.city_Name
  }, que é do valor de ${c.revenues.toLocaleString('pt-br', {
    currency: 'brl',
    style: 'currency',
  })}</h1>
`
}

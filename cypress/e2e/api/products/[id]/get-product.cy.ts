import spok from 'cy-spok'
it('should get user', () => {
  cy.api({method: 'GET', url: '/api/products/1'}).should(
    spok({
      status: 200,
      body: {id: 1, name: 'Milk'},
    }),
  )
})

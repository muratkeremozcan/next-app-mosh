import spok from 'cy-spok'
it('should get user', () => {
  cy.api({method: 'GET', url: '/api/users/1'}).should(
    spok({
      status: 200,
      body: {id: 1, name: 'Murat'},
    }),
  )
})

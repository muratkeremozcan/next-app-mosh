import spok from 'cy-spok'
it('should get user', () => {
  cy.request('GET', '/api/users/1').should(
    spok({
      status: 200,
      body: {id: 1, name: 'Murat'},
    }),
  )
})

import spok from 'cy-spok'
it('should get user', () => {
  cy.request('GET', '/api/users')
    .should(spok({status: 200}))
    .its('body')
    .should('have.length', 2)
    .each(user =>
      cy.wrap(user).should(spok({id: spok.number, name: spok.string})),
    )
})

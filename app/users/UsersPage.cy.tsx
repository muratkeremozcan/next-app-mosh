import UsersPage from './page'

// TODO: find a way to stub window fetch in a component test for a nextJs server component
describe.skip('<UsersPage />', () => {
  it('should stub window fetch', () => {
    // cy.intercept(
    //   {
    //     method: 'GET',
    //     url: 'https://jsonplaceholder.typicode.com/users',
    //   },
    //   {
    //     fixture: 'users.json',
    //   },
    // ).as('getUsers')

    // cy.stub(window, 'fetch')
    //   .resolves({
    //     json: cy
    //       .stub()
    //       .resolves([{id: 1, name: 'John', email: 'john@example.com'}]),
    //   })
    //   .as('fetchStub')

    // cy.stub(window, 'fetch').resolves({ok: true}).as('fetch')

    // cy.stub(window, 'fetch')
    //   .withArgs('https://jsonplaceholder.typicode.com/users')
    //   .resolves(
    //     Cypress.Promise.resolve({
    //       ok: true,
    //       json: cy
    //         .stub()
    //         .resolves([{id: 1, name: 'John', email: 'john@example.com'}]),
    //     }),
    //   )

    cy.mount(<UsersPage />)
  })
})

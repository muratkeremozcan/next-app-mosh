import UsersPage from './page'

// TODO: find a way to stub window fetch in a component test for a nextJs server component
describe.skip('<UsersPage />', () => {
  it('should stub window fetch', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/users',
      },
      {
        fixture: 'users.json',
      },
    ).as('getUsers')

    cy.mount(<UsersPage />)
  })
})

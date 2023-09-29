import UsersPage from './page'
import users from '@fixtures/users.json'

describe('<UsersPage />', () => {
  it('should render a server component', async () => {
    // stub window.fetch
    cy.stub(window, 'fetch').resolves({
      json: cy.stub().resolves(users),
    })

    // await the server component
    const comp = await UsersPage()

    // mount the awaited server component
    cy.mount(comp)

    cy.getByCy('user-table-comp')
  })
})

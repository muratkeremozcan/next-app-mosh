import UsersTable from './UsersTable'
import users from '@fixtures/users.json'

describe('<UsersTable />', () => {
  it('should ', () => {
    cy.mount(<UsersTable users={users} />)
  })
})

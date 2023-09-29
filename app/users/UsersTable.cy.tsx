import UsersTable from './UsersTable'
import users from '@fixtures/users.json'

describe('<UsersTable />', () => {
  it('should sort by name', () => {
    cy.mount(<UsersTable users={users} sortOrder={'name'} />)

    cy.get('tbody').first().contains('Chelsey Dietrich')
  })
  it('should sort by email', () => {
    cy.mount(<UsersTable users={users} sortOrder={'email'} />)

    cy.get('tbody').first().contains('Chaim_McDermott@dana.io')
  })
})

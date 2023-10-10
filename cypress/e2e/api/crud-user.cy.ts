import '@support/commands/api'
import {createRandomUser} from '@support/utils'
import spok from 'cy-spok'

describe('CRUD User', () => {
  const body = createRandomUser()
  const {name, email} = body

  it('should crud a user', () => {
    cy.createUser(body)
      .should(spok({status: 201}))
      .its('body')
      .should(spok({id: spok.number, name, email}))
      .its('id')
      .then((id: any) => {
        cy.getUser(id).should(
          spok({
            status: 200,
            body: {id: spok.number, name},
          }),
        )

        cy.getUsers()
          .should(spok({status: 200}))
          .its('body')
          .should('be.a', 'array')
          .each(user =>
            cy.wrap(user).should(spok({id: spok.number, name: spok.string})),
          )

        cy.log('**should err when adding existing user**')
        cy.createUser(body, true)
          .should(spok({status: 400}))
          .its('body')
          .should(spok({error: 'User already exists.'}))

        const newName = `edited-${name}`
        const newEmail = `edited${email}`
        cy.updateUser(id, {name: newName, email: newEmail})
          .should(spok({status: 200}))
          .its('body')
          .should(spok({id, name: newName, email: newEmail}))

        cy.deleteUser(id).should(spok({status: 200}))
      })
  })

  it('should fail to delete a user that does not exist', () => {
    const id = '101'

    cy.deleteUser(id, true).should(spok({status: 404}))
  })

  it('should fail update an invalid user', () => {
    const body = {name: ''}

    cy.updateUser('1', body, true)
      .should(spok({status: 400}))
      .its('body')
      .should(
        spok([
          {
            code: 'too_small',
            minimum: 3,
            type: 'string',
            inclusive: true,
            exact: false,
            message: 'String must contain at least 3 character(s)',
            path: ['name'],
          },
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['email'],
            message: 'Required',
          },
        ]),
      )
  })

  it('should fail update a user that does not exist', () => {
    const body = {name: 'Murat', email: 'ast@gmail.com', id: 101}
    const {id} = body

    cy.updateUser(String(id), body, true)
      .should(spok({status: 404}))
      .its('body')
      .should(spok({error: 'The user does not exist.'}))
  })
})

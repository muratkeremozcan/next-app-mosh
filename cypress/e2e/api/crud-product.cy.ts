import '@support/commands/api'
import {createRandomProduct} from '@support/utils'
import spok from 'cy-spok'

describe('CRUD Product', () => {
  const body = createRandomProduct()
  const {name, price} = body

  it('should crud a product', () => {
    cy.createProduct(body)
      .should(spok({status: 201}))
      .its('body')
      .should(spok({id: spok.number, name, price}))
      .its('id')
      .then((id: string) => {
        cy.getProduct(id).should(
          spok({
            status: 200,
            body: {id: spok.number, name, price},
          }),
        )

        cy.getProducts()
          .should(spok({status: 200}))
          .its('body')
          .should('be.a', 'array')
          .each(product =>
            cy.wrap(product).should(spok({id: spok.number, name: spok.string})),
          )

        cy.log('**should err when adding existing product**')
        cy.createProduct(body, true)
          .should(spok({status: 400}))
          .its('body')
          .should(spok({error: 'Product already exists.'}))

        const newName = `edited-${name}`
        const newPrice = Cypress._.random(1, 100)
        cy.updateProduct(id, {name: newName, price: newPrice})
          .should(spok({status: 200}))
          .its('body')
          .should(spok({id, name: newName, price: newPrice}))

        cy.deleteProduct(id).should(spok({status: 200}))
      })
  })

  it('should fail to delete a product that does not exist', () => {
    const id = '101'

    cy.deleteProduct(id, true).should(spok({status: 404}))
  })

  it('should fail update an invalid product', () => {
    const body = {name: ''}

    cy.updateProduct('1', body, true)
      .should(spok({status: 400}))
      .its('body')
      .should(
        spok([
          {
            code: 'too_small',
            minimum: 2,
            type: 'string',
            inclusive: true,
            exact: false,
            message: 'String must contain at least 2 character(s)',
            path: ['name'],
          },
          {
            code: 'invalid_type',
            expected: 'number',
            received: 'undefined',
            path: ['price'],
            message: 'Required',
          },
        ]),
      )
  })

  it('should fail to update a product that does not exist', () => {
    const body = {name: 'Milk', price: 5, id: 101}
    const {id} = body

    cy.updateProduct(String(id), body, true)
      .should(spok({status: 404}))
      .its('body')
      .should(spok({error: 'The product does not exist.'}))
  })
})

// faker is large and slows down test startup
// don't put it in e2e.ts and cause non-faker e2e to be slow
import {createRandomProduct, createRandomUser} from '@support/utils' // faker stuff...
import type {User} from '@/app/api/users/schema'
import type {Product} from '@/app/api/products/schema'

Cypress.Commands.add(
  'createUser',
  (body = createRandomUser(), allowedToFail = false) => {
    cy.log('**createUser**')
    return cy.api({
      method: 'POST',
      url: '/api/users',
      body,
      retryOnStatusCodeFailure: !allowedToFail,
      failOnStatusCode: !allowedToFail,
    })
  },
)

Cypress.Commands.add('getUser', (id: string, failOnStatusCode = false) => {
  cy.log('**getUser**')
  return cy.api({
    method: 'GET',
    url: `/api/users/${id}`,
    retryOnStatusCodeFailure: !failOnStatusCode,
    failOnStatusCode: !failOnStatusCode,
  })
})

Cypress.Commands.add('getUsers', (failOnStatusCode = false) => {
  cy.log('**getUsers**')
  return cy.api({
    method: 'GET',
    url: `/api/users`,
    retryOnStatusCodeFailure: !failOnStatusCode,
    failOnStatusCode: !failOnStatusCode,
  })
})

Cypress.Commands.add('deleteUser', (id: string, allowedToFail = false) => {
  cy.log('**deleteUser**')
  return cy.api({
    method: 'DELETE',
    url: `/api/users/${id}`,
    retryOnStatusCodeFailure: !allowedToFail,
    failOnStatusCode: !allowedToFail,
  })
})

Cypress.Commands.add(
  'updateUser',
  (id: string, body: Partial<User>, allowedToFail = false) => {
    cy.log('**updateUser**')
    return cy.api({
      method: 'PUT',
      url: `/api/users/${id}`,
      body,
      retryOnStatusCodeFailure: !allowedToFail,
      failOnStatusCode: !allowedToFail,
    })
  },
)

// Product commands
Cypress.Commands.add(
  'createProduct',
  (body = createRandomProduct(), allowedToFail = false) => {
    cy.log('**createProduct**')
    return cy.api({
      method: 'POST',
      url: '/api/products',
      body,
      retryOnStatusCodeFailure: !allowedToFail,
      failOnStatusCode: !allowedToFail,
    })
  },
)

Cypress.Commands.add('getProduct', (id: string, failOnStatusCode = false) => {
  cy.log('**getProduct**')
  return cy.api({
    method: 'GET',
    url: `/api/products/${id}`,
    retryOnStatusCodeFailure: !failOnStatusCode,
    failOnStatusCode: !failOnStatusCode,
  })
})

Cypress.Commands.add('getProducts', (failOnStatusCode = false) => {
  cy.log('**getProducts**')
  return cy.api({
    method: 'GET',
    url: `/api/products`,
    retryOnStatusCodeFailure: !failOnStatusCode,
    failOnStatusCode: !failOnStatusCode,
  })
})

Cypress.Commands.add('deleteProduct', (id: string, allowedToFail = false) => {
  cy.log('**deleteProduct**')
  return cy.api({
    method: 'DELETE',
    url: `/api/products/${id}`,
    retryOnStatusCodeFailure: !allowedToFail,
    failOnStatusCode: !allowedToFail,
  })
})

Cypress.Commands.add(
  'updateProduct',
  (id: string, body: Partial<Product>, allowedToFail = false) => {
    cy.log('**updateProduct**')
    return cy.api({
      method: 'PUT',
      url: `/api/products/${id}`,
      body,
      retryOnStatusCodeFailure: !allowedToFail,
      failOnStatusCode: !allowedToFail,
    })
  },
)

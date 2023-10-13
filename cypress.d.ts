/* eslint-disable @typescript-eslint/no-explicit-any */
import type {MountOptions, MountReturn} from 'cypress/react'
import type {User} from '@/app/api/users/schema'

export {}
declare global {
  namespace Cypress {
    interface Chainable {
      /** Yields elements with a data-cy attribute that matches a specified selector.
       * ```
       * cy.getByCy('search-toggle') // where the selector is [data-cy="search-toggle"]
       * ```
       */
      getByCy(qaSelector: string, args?: any): Chainable<JQuery<HTMLElement>>

      /** Yields elements with data-cy attribute that partially matches a specified selector.
       * ```
       * cy.getByCyLike('chat-button') // where the selector is [data-cy="chat-button-start-a-new-claim"]
       * ```
       */
      getByCyLike(
        qaSelector: string,
        args?: any,
      ): Chainable<JQuery<HTMLElement>>

      /** Mounts a React node
       * @param component React Node to mount
       * @param options Additional options to pass into mount
       */
      mount(
        component: React.ReactNode,
        options?: MountOptions,
      ): Cypress.Chainable<MountReturn>

      /** Mounts the component wrapped by RootLayout (for styles)
       * @param component React Node to mount
       * @param options Additional options to pass into mount
       */
      wrappedMount(
        component: React.ReactNode,
        options?: MountOptions,
      ): Cypress.Chainable<MountReturn>

      /** Creates a random user with name and email */
      createUser(
        body?: Partial<User>,
        allowedToFail?: boolean,
      ): Chainable<Response<User> & Messages>

      /** Gets a user by id */
      getUser(
        id: string,
        failOnStatusCode?: boolean,
      ): Chainable<Response<User> & Messages>

      /** Gets all users */
      getUsers(
        failOnStatusCode?: boolean,
      ): Chainable<Response<User[]> & Messages>

      /** Deletes a user by id */
      deleteUser(
        id: string,
        allowedToFail?: boolean,
      ): Chainable<Response<User> & Messages>

      /** Updates a user by id */
      updateUser(
        id: string,
        body: Partial<User>,
        allowedToFail?: boolean,
      ): Chainable<Response<User> & Messages>

      /** Creates a random product with name and email */
      createProduct(
        body?: Partial<Product>,
        allowedToFail?: boolean,
      ): Chainable<Response<unknown> & Messages>

      /** Gets a product by id */
      getProduct(
        id: string,
        failOnStatusCode?: boolean,
      ): Chainable<Response<unknown> & Messages>

      getProducts(
        failOnStatusCode?: boolean,
      ): Chainable<Response<Product[]> & Messages>

      /** Deletes a product by id */
      deleteProduct(
        id: string,
        allowedToFail?: boolean,
      ): Chainable<Response<unknown> & Messages>

      /** Updates a product by id */
      updateProduct(
        id: string,
        body: Partial<Product>,
        allowedToFail?: boolean,
      ): Chainable<Response<unknown> & Messages>

      /**
       * Logs-in user by using Google API request
       */
      googleLogin(): Chainable<Response>

      /**
       * Stubs login via fixture, to get past the auth wall
       */
      stubLogin(): void
    }
  }
}

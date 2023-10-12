describe('Login', () => {
  it('should login', () => {
    const username = 'next.app.mosh@gmail.com'
    const password = 'Password-1'
    const googleDomain = 'https://accounts.google.com'
    cy.visit('/')
    cy.getByCy('navbar-sign-in').click()

    Cypress.on(
      'uncaught:exception',
      err =>
        !err.message.includes('ResizeObserver loop') &&
        !err.message.includes('Error in protected function'),
    )

    cy.contains('Sign in with Google').click()

    // none of this works...

    // cy.origin(googleDomain, () => {
    //   cy.scrollTo('bottom')
    //   cy.get('form[data-provider="google"]').submit()
    // })

    // cy.origin(
    //   'https://accounts.google.com',
    //   {
    //     args: {
    //       username,
    //       password,
    //     },
    //   },
    //   ({username, password}) => {
    //     Cypress.on(
    //       'uncaught:exception',
    //       err =>
    //         !err.message.includes('ResizeObserver loop') &&
    //         !err.message.includes('Error in protected function'),
    //     )

    //     cy.get('input[type="email"]').type(username, {
    //       log: false,
    //     })
    //     // NOTE: The element exists on the original form but is hidden and gets rerendered, which leads to intermittent detached DOM issues
    //     cy.contains('Next').click().wait(4000)
    //     cy.get('[type="password"]').type(password, {
    //       log: false,
    //     })
    //     cy.contains('Next').click().wait(4000)
    //   },
    // )
  })
})

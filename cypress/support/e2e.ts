// put e2e only commands and plugins here
// better to import plugins where relevant, speeds up test warmup
// import '@testing-library/cypress/add-commands'

import './commands'
import '@bahmutov/cy-api'
import 'cypress-map'

Cypress.Commands.add('loginByGoogleApi', () => {
  cy.log('Logging in to Google')

  return cy
    .request({
      method: 'POST',
      url: 'https://www.googleapis.com/oauth2/v4/token',
      body: {
        grant_type: 'refresh_token',
        client_id: Cypress.env('GOOGLE_CLIENT_ID'),
        client_secret: Cypress.env('GOOGLE_CLIENT_SECRET'),
        refresh_token: Cypress.env('GOOGLE_REFRESH_TOKEN'),
      },
    })
    .then(({body}) => {
      const {access_token, id_token} = body

      return cy
        .request({
          method: 'GET',
          url: 'https://www.googleapis.com/oauth2/v3/userinfo',
          headers: {Authorization: `Bearer ${access_token}`},
        })
        .then(({body}) => {
          cy.log(body)
          const userItem = {
            token: id_token,
            user: {
              googleId: body.sub,
              email: body.email,
              givenName: body.given_name,
              familyName: body.family_name,
              imageUrl: body.picture,
            },
          }

          window.localStorage.setItem('googleCypress', JSON.stringify(userItem))

          return cy.visit('/')
        })
    })
})

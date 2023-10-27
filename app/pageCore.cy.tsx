import HomeCoreComponent from './pageCore'
import type {Session} from './pageCore'

describe('<Home />', () => {
  it('should render the user name when there is a session', () => {
    const session: Session = {
      user: {
        name: 'Murat',
        email: 'murat@gmail.com',
        image: null,
      },
      expires: '3000-01-01T00:00:00.000Z',
    }

    cy.mount(<HomeCoreComponent session={session} />)
    cy.contains(`Hello ${session.user.name}`)

    cy.getByCy('home-page-users-link').should('have.attr', 'href', '/users')
    cy.getByCy('add-to-cart-comp').should('be.visible')
  })

  it('should only say hello without a session', () => {
    cy.mount(<HomeCoreComponent session={null} />)
    cy.get('h1').should('have.text', 'Hello ')
  })

  it('should show heavy component after a few seconds', () => {
    cy.mount(<HomeCoreComponent session={null} />)
    cy.contains('button', 'Show heavy component').click()
    cy.contains('My Heavy Component')
  })
})

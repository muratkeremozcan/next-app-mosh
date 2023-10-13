import ProductCard from './ProductCard'

describe('<ProductCard />', () => {
  it('renders', () => {
    cy.mount(<ProductCard />)
    cy.getByCy('add-to-cart-comp').should('be.visible')
  })
})

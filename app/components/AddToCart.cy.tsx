import AddToCart from './AddToCart'

describe('<AddToCart />', () => {
  it('should render', () => {
    cy.mount(<AddToCart />)
    cy.contains('.btn', /add to cart/i)
  })
})

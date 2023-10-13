import PhotoDetailPage from './page'

describe('<PhotoDetailPage />', () => {
  it('renders', () => {
    cy.mount(<PhotoDetailPage params={{id: 42, photoId: 84}} />)
    cy.contains('User 42, PhotoDetailPage 84')
  })
})

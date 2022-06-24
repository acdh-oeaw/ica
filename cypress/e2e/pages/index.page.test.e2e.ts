export {}

describe('HomePage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should set document title', () => {
    cy.title().should('eq', 'Home | Ideas Crossing the Atlantic')
  })

  it('should display page title', () => {
    cy.findByRole('heading', { name: 'Hello, world!' }).should('be.visible')
  })
})

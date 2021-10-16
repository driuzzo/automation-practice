Cypress.Commands.add('backgroundLogin', () => {
    cy.setCookie(
        // cookies do usuário Robert Deniro: 
        // email nove@b.com
        // senha 123456
        'PrestaShop-a30a9934ef476d11b6cc3c983616e364',
        'kYtlweNr4tJfX4Bdi1mhTUvu5sdfuSwpcvwwTabCe2FUOpOjUvohpg0pVqLKVYMx1frJbUjVKpHXe8nmiJnOBZpAvUgxnytA8kguoO3I2qBbOYcXHPrbS7esgl21EbZFFdJUiJcpT%2FfF51z3PRCC1hNYuyHFA3KoOcP5rAOPFN%2FN9NUlSzJzoaZJ1rZ3uSbSJnm1d9LgaTP1O9yxNq6IqfT6%2FSYhx4vMhh6NDdV9sejAmdMEqbJiq9g9S4fJOyHqvKxyeIgtqd8CHYPVy4Dpp1cOIohOQNDENnCWs8%2FoV4ZhYqDbd8BEjpFY%2BVFy27hPchBc2p5Pj6XGxfXHL22lv%2BM0fLGfpRhlaQfVypC6IuU%3D000272'
    )
})

Cypress.Commands.add('accessMyAccount', (first_name, last_name, welcomeMessage) => {
    cy.get('title')
        .should('have.text', 'My Store')

    cy.get('.account')
        .should('have.text', first_name + ' ' + last_name)
        .click()

    cy.get('.info-account')
        .should('have.text', welcomeMessage)
})

Cypress.Commands.add('backToMyAccount', () =>{
    cy.get('a[href="http://automationpractice.com/index.php?controller=my-account"]')
        .eq(2)
        .click()
})


Cypress.Commands.add('backToHome', () =>{
    cy.get('a[href="http://automationpractice.com/"]')
        .eq(2)
        .click()
})

Cypress.Commands.add('pageTitleAssertion', () =>{
    cy.get('title')
        .should('have.text', 'My Store')
})


Cypress.Commands.add('clickOnSignIn', () =>{
    cy.get('.login')
        .should('contain.text', 'Sign in')
        .click()
})

Cypress.Commands.add('login', (email, password) =>{
    cy.get('#email')
        .type(email)
        .blur()
        .should('have.css', 'background-color', 'rgb(221, 249, 225)')        

    cy.get('#passwd')
        .type(password, {log: false})        

    cy.get('#SubmitLogin')
        .should('be.enabled')
        .click()
})

Cypress.Commands.add('emptyEmailLogin', (password) =>{
    cy.get('#email')
        .focus()
        .should('be.empty')
        .blur()
        .should('have.css', 'background-color', 'rgb(255, 241, 242)')        

    cy.get('#passwd')
        .type(password, {log: false})        

    cy.get('#SubmitLogin')
        .should('be.enabled')
        .click()
})

Cypress.Commands.add('emptyPasswordLogin', (email) =>{
    cy.get('#email')
        .type(email)
        .blur()
        .should('have.css', 'background-color', 'rgb(221, 249, 225)')        

    cy.get('#passwd')
        .should('be.empty')

    cy.get('#SubmitLogin')
        .should('be.enabled')
        .click()
})

Cypress.Commands.add('getProductQuickView', (nomeProduto) => {
    cy.get(`.product-name:contains(${nomeProduto})`)
    .first()
    .parents('.right-block')
    .siblings('.left-block')
    .find('.quick-view')
    .invoke('show')
    .click()
})


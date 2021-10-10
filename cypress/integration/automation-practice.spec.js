/// <reference types="Cypress"/>

const faker = require('faker')

const user = {                
    firstName: `${faker.name.firstName(0)}`,
    lastName: `${faker.name.lastName()}`,
    email: function () {
        return this.firstName.toLowerCase() + this.lastName.toLowerCase() + '@mail.com'
    },
    password: `${faker.internet.password()}`,
    birthDay: `${faker.datatype.number({
        'min': 10,
        'max': 28
    })}`,
    birthMonth: `${faker.date.month()}`,
    birthYear: `${faker.datatype.number({
        'min': 1900,
        'max': 2003
    })}`,
    address: `${faker.address.streetAddress()}`,
    city: `${faker.address.cityName()}`,
    state: `${faker.address.state()}`,
    zipCode: `${faker.address.zipCode("#####")}`,
    phoneNumber: `${faker.phone.phoneNumberFormat(1)}`
}

describe('ecommerce app testing', () => {
    context('new user', () => {
        beforeEach(() => {
            cy.visit('/')
        })
        
        it('creates a new user', () => {
            
            cy.get('title')
                .should('have.text', 'My Store')

            cy.get('.login')
                .should('contain.text', 'Sign in')
                .click()

            cy.get('#email_create')
                .should('be.visible')
                .clear()
                .type(user.email())

            cy.get('#SubmitCreate')
                .should('be.visible')
                .and('be.enabled')
                .and('contain.text', 'Create an account')
                .click()
            
            cy.url().should('eq', 'http://automationpractice.com/index.php?controller=authentication&back=my-account#account-creation')

            cy.get('.navigation_page')
                .should('have.text', '	Authentication')

            cy.get('.page-heading')
                .should('have.text', 'Create an account')

            cy.get('#uniform-id_gender1')
                .click()

            cy.get('#customer_firstname')
                .type(user.firstName)

            cy.get('#customer_lastname')
                .type(user.lastName)

            cy.get('#email')
                .should('have.value', user.email())

            cy.get('#passwd')
                .type(user.password)

            cy.get('#days')
                .select(user.birthDay)

            cy.get('#months')
                .select(user.birthMonth)

            cy.get('#years')
                .select(user.birthYear)

            cy.get('#address1') 
                .type(user.address)
            
            cy.get('#city') 
                .type(user.city)

            cy.get('#id_state') 
                .select(user.state)

            cy.get('#postcode')
                .type(user.zipCode)
            
            cy.get('#id_country')
                .should('contain.text', 'United States')

            cy.get('#phone_mobile')
                .type(user.phoneNumber)

            cy.get('#alias')
                .should('have.value', 'My address')

            cy.get('#submitAccount')
                .should('be.visible')
                .click()

            cy.contains('Welcome to your account. Here you can manage all of your personal information and orders.')
        })
    })
})
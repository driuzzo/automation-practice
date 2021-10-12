/// <reference types="Cypress"/>

const faker = require('faker')

const existingUser = 'Robert Deniro'
const welcomeMessage = 'Welcome to your account. Here you can manage all of your personal information and orders.'

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

            cy.clickOnSignIn()

            cy.get('#email_create')
                .should('be.visible')
                .clear()
                .type(user.email())

            cy.get('#SubmitCreate')
                .should('be.visible')
                .and('be.enabled')
                .and('contain.text', 'Create an account')
                .click()
            
            cy.url().should('include', 'controller=authentication&back=my-account#account-creation')

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

            cy.get('.info-account')
                .should('have.text', welcomeMessage)
        })
    })

    context('user login', () => {
        const users = require('../fixtures/users')
        beforeEach(() => {            
            cy.visit('/')
        })

        it('does a valid login', () => {
            cy.pageTitleAssertion()
            cy.clickOnSignIn()
            cy.login(users.user[0].email, users.user[0].password)
            
            cy.get('.info-account')
                .should('have.text', welcomeMessage)
        })

        it('login with invalid password', () => {
            cy.pageTitleAssertion()
            cy.clickOnSignIn()
            cy.login(users.user[0].email, '12345')

            cy.contains('Authentication failed.')
        })

        it('login with invalid email', () => {
            cy.pageTitleAssertion()
            cy.clickOnSignIn()
            cy.login('noves@b.com', users.user[0].password)

            cy.contains('Authentication failed.')
        })

        it('login with empty email', () => {
            cy.pageTitleAssertion()
            cy.clickOnSignIn()
            cy.emptyEmailLogin(users.user[0].password)

            cy.contains('An email address required.')
        })

        it('login with empty password', () => {
            cy.pageTitleAssertion()
            cy.clickOnSignIn()
            cy.emptyPasswordLogin(users.user[0].email)

            cy.contains('Password is required.')
        })

    })

    context('existing user', () => {
        const users = require('../fixtures/users')
        beforeEach(() => {
            cy.backgroundLogin()
            cy.visit('/')
        })
        
        it('checks my personal information', () => {
            
            cy.accessMyAccount(users.user[0].first_name, users.user[0].last_name, welcomeMessage)

            cy.get('a[title="Information"]')
                .should('have.text', 'My personal information')
                .click()

            cy.get('.page-subheading')
                .should('contain.text', 'Your personal information' )

            cy.get('#id_gender1')
                .should('be.checked')              
            
            cy.get('#firstname')
                .should('have.value', users.user[0].first_name)

            cy.get('#lastname')
                .should('have.value', users.user[0].last_name)

            cy.get('#email')
                .should('have.value', users.user[0].email)

            cy.get('#days')
                .should('have.value', users.user[0].birth_day)

            cy.get('#months')
                .should('have.value', '4')

            cy.get('#months > option[value="4"]').should('contain.text', users.user[0].birth_month)

            cy.get('#years')
                .should('have.value', users.user[0].birth_year)

            cy.get('#old_passwd')
                .should('be.empty')

            cy.get('#passwd')
                .should('be.empty')

            cy.get('#confirmation')
                .should('be.empty')
            
            cy.backToMyAccount()

        })

        it('checks my addresses', () => {
            cy.accessMyAccount(users.user[0].first_name, users.user[0].last_name, welcomeMessage)

            cy.get('a[title="Addresses"]')
                .should('have.text', 'My addresses')
                .click()

            cy.get('.page-heading')
                .should('have.text', 'My addresses')

            cy.get('.address_name')
                .first()
                .should('contain.text', users.user[0].first_name)

            cy.get('.address_name')
                .next()
                .should('contain.text', users.user[0].last_name)
                
            cy.get('.address_address1')
                .first()
                .should('contain.text', users.user[0].address)

            cy.get('ul[class="last_item item box"]')
                .find('li')
                .eq(4)
                .within(() => {
                    cy.get('span')
                        .eq(0)
                        .should('contain.text', users.user[0].city)
                  })
                .within(() => {
                    cy.get('span')
                        .eq(1)
                        .should('contain.text', users.user[0].state)
                  })

                .within(() => {
                    cy.get('span')
                        .eq(2)
                        .should('contain.text', users.user[0].zip_code)
                  })

            cy.get('ul[class="last_item item box"]')
                .find('li')
                .eq(5)
                .should('contain.text', users.user[0].country)

            cy.get('.address_phone_mobile')
                .first()
                .should('contain.text', users.user[0].mobile_phone)
            
            cy.backToMyAccount()

        })

        it.only('logout', () => {

            cy.accessMyAccount(users.user[0].first_name, users.user[0].last_name, welcomeMessage)

            cy.get('.logout')
                .should('contain.text', 'Sign out')
                .click()

            cy.url().should('include', 'controller=authentication&back=my-account')

            cy.get('.navigation_page')
                .should('have.text', '	Authentication')

            cy.get('.login')
                .should('contain.text', 'Sign in')            
        })
    })
})
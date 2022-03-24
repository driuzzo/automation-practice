/// <reference types="Cypress"/>

const faker = require('faker')

const blouseProduct = 'Blouse'

const printedSearch = 'printed'

const printedDress = 'Printed Dress'

const invalidSearch = 'zero'

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
            cy.visit('http://automationpractice.com/index.php?controller=authentication&back=my-account')
        })

        it('does a valid login', () => {

            cy.login(users.user[0].email, users.user[0].password)
            
            cy.get('.info-account')
                .should('have.text', welcomeMessage)
        })

        it('login with invalid email', () => {

            cy.login('noves@b.com', users.user[0].password)

            cy.contains('Authentication failed.')
        })

        it('login with invalid password', () => {

            cy.login(users.user[0].email, '12345')

            cy.contains('Authentication failed.')
        })

        it('login with empty email', () => {

            cy.emptyEmailLogin(users.user[0].password)

            cy.contains('An email address required.')
        })

        it('login with empty password', () => {

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

        it('logout', () => {

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

    context('orders', () => {
        const users = require('../fixtures/users')
        beforeEach(() => {
            cy.backgroundLogin()
            cy.visit('/')
        })

        it('does a quick view from an item and access each thumbnail', () => {
            cy.getProductQuickView(blouseProduct)

            cy.get('iframe', {timeout: 15000})
                .should('be.visible')
                .then(($iframe) => {
            const $body = $iframe
                .contents()
                .find('body')

            cy.wrap($body)
                .find('[itemprop="name"]')
                .should('have.text', `${blouseProduct}`)
                
            cy.wrap($body)
                .find('#quantity_wanted')
                .should('have.value', '1')

            cy.wrap($body)
                .find('#bigpic')
                .as('bigpic')

            cy.wrap($body)
                .find('#thumbs_list_frame > li').each((item) => {
                    cy.wrap(item)
                        .trigger('mouseover')
                        .invoke('attr', 'id')
                        .then($id => {
                            const idvalue = $id.charAt($id.length-1)

                        cy.get('@bigpic')
                            .should('have.attr', 'src', `http://automationpractice.com/img/p/${idvalue}/${idvalue}-large_default.jpg`)
                        })
                })

            cy.get('a[title="Close"]')
                .click()
            
            })
        })

        it('searches for a product with 1 result', () => {
            cy.intercept(
                'GET',
                `**search&q=${blouseProduct}**`
            ).as('getSearch')
            
            cy.get('#search_query_top')
                .type(blouseProduct)
                .type('{enter}')

            cy.get('ul[class="product_list grid row"]>li')
                .should('have.length', 1)

            cy.get('.heading-counter')
                .should('contain.text', '1 result has been found.')

            })

        it('searches for a product with more than one result', () => {
            cy.intercept(
                'GET',
                `**search&q=${printedSearch}**`
            ).as('getSearch')
            
            cy.get('#search_query_top')
                .type(printedSearch)
                .type('{enter}')

            cy.wait('@getSearch')
    
            cy.get('ul[class="product_list grid row"]>li')
                .then($list => {
                    const listSize = $list.length

                cy.get('.heading-counter')
                    .should('contain.text', `${listSize} results have been found.`)
                })    
            })
            
        it('searches for a product with no results', () => {
            
            cy.get('#search_query_top')
                .type(invalidSearch)
                .type('{enter}')

            cy.contains('.alert-warning', `No results were found for your search "${invalidSearch}"`)

            cy.contains('.heading-counter', '0 results have been found.')
        })

        it('checks cart is empty', () => {
            cy.get('.ajax_cart_no_product')
                .should('be.visible')
                .and('have.text', '(empty)')
        })

        it.only('searches for a product and order it', () => {
            cy.intercept(
                'GET',
                `**search&q=${printedSearch}**`
            ).as('getSearch')
            
            cy.get('#search_query_top')
                .type(printedSearch)
                .type('{enter}')

            // cy.wait('@getSearch')
    
            cy.get('ul[class="product_list grid row"]>li')
                .find(`.product-name:contains(${printedDress})`)
                .eq(0).as('printedDressObject')

            cy.get('@printedDressObject')
                .parents('.right-block')
                .find('.availability .available-now')
                .should('contain', 'In stock')

            cy.get('@printedDressObject')
                .parents('.right-block')
                .find('span[class="price product-price"]')
                .invoke('text')
                .then((price) => {

                    const printedDressPrice = price.trim()
                    cy.get('@printedDressObject')
                        .parents('.right-block')
                        .find('a[title="View"]')
                        .click()

                    cy.get('#our_price_display')
                        .should('have.text', `${printedDressPrice}`)
                })

            cy.get('h1')
                .should('have.text', `${printedDress}`)
            
            cy.get('#quantity_wanted')
                .should('have.value', '1')

            cy.get('#group_1').select('M')

            cy.get('button[name="Submit"]')
                .should('be.visible')
                .and('contain.text', 'Add to cart')
                .click()

            cy.get('#layer_cart', {timeout: 20000})
                .should('be.visible')

            cy.get('a[title="Proceed to checkout"]', {timeout: 20000})
                .should('be.visible')
                .and('contain.text', 'Proceed to checkout')
                .click()
        })
    })
})
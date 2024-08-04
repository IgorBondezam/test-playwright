import {expect, test} from '@playwright/test'


test.beforeEach(async ({page}) => {
  await page.goto('http://localhost:4200/')
  await page.getByText('Forms').click()
  await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async ({page}) =>{
  //by tag name
  // page.locator('what tag I want to find', {})
  page.locator('input') //will get all inputs on page
  page.locator('input').first() //will get first of all the inputs on page

  //by ID
  await page.locator('#inputEmail1').click() //Will get the tag with id = ...

  //by Class value
  page.locator(".shape-rectangle") // Will get the tag with class = ...

  //by attribut
  page.locator('[placeholder="Email"]')

  //by Class value (full)
  page.locator('[class = "input-full-width size-medium status-basic shape-rectangle nb-transition"]')

  //combine different selectors
  page.locator('input[placeholder="Email"]') // without space, always concat one with other

  //by XPath (not RECOMMEND)
  page.locator('//*[@id="inputEmail1"]')

  // by partial text match
  page.locator(':text("Using")')

  //by exact text match
  page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async ({page}) =>{
  await page.getByRole('textbox', {name: "Email"}).first().click()
  await page.getByRole('button', {name: "SIGN IN"}).first().click()

  await page.getByLabel('Email').first().click()

  await page.getByPlaceholder('Jane Doe').first().click()

  await page.getByText('Using the Grid').first().click()

  await page.getByTestId('SignIn').click()

  await page.getByTitle('IoT Dashboard').first().click()

})

test('Location chield elements', async ({page}) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click() // spaces define a chield from the parent element
  //The same thing
  await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

  await page.locator('nb-card').getByRole('button', {name: "SIGN IN"}).first().click()

  await page.locator('nb-card').nth(3).getByRole('button').click() //ADDING GET BY INDEX IN ORDER TOP-DOWN
  //OBS INDEX ALWAYS START FROM THE 0
})

test('locating parent eleemtns',async ({page}) => {
  await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
  await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

  await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
  await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

  await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: 'Sign in'}).getByRole('textbox', {name: "Email"}).click()

  //Not Recommend
  await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
  //Funciona como o .. dentro de um diretório, volta para o diretório pai. com isso o XPATH referencia a tag pai após achar a tag filha com o texto de Using the Grid
})

test('Reusing the locators', async ({page})=>{
  // await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).fill('test@tesh.com')
  // await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Password"}).fill('Welcome123')
  // await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('button').click() Reusing these methods

  const basicForm = page.locator('nb-card').filter({hasText: "Basic form"});
  const emailForm = basicForm.getByRole('textbox', {name: "Email"});

  await emailForm.fill('test@test.com')
  await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
  await basicForm.locator('nb-checkbox').click()
  await basicForm.getByRole('button').click()

  await expect(emailForm).toHaveValue('test@test.com')
})

test('Extracting values', async ({page}) => {
  //Single text value

  const basicForm = page.locator('nb-card').filter({hasText: "Basic form"});
  const buttonText: string = await basicForm.locator('button').textContent()
  expect(buttonText).toEqual('Submit')

  //All text value
  const allRadioButtonsLAbels: string[] = await page.locator('nb-radio').allTextContents()
  expect(allRadioButtonsLAbels).toContain('Option 1')

  //Input value
  const emailField = basicForm.getByRole('textbox', {name: "Email"})
  await emailField.fill('test@test.com')
  const emailValue: string =  await emailField.inputValue()
  expect(emailValue).toEqual('test@test.com')

  const placeHolderValue: string = await emailField.getAttribute('placeholder')
  expect(placeHolderValue).toEqual('Email')
})

test('Assertions', async ({page}) => {
  const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button');

  //General assertions

  const value = 5
  expect(value).toEqual(5)

  const text = await basicFormButton.textContent()
  expect(text).toEqual("Submit")

  //Locator Assertion
  await expect(basicFormButton).toHaveText('Submit')

  //Soft Assertion - Se o teste quebrar ele continuara executando, sem parar no primeiro fail
  await  expect.soft(basicFormButton).toHaveText('Submit')
  await basicFormButton.click()


})

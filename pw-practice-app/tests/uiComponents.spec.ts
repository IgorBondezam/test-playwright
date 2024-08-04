import {expect, test} from '@playwright/test'



test.beforeEach(async ({page}) => {
  await page.goto('http://localhost:4200/')

})

test.describe('Form layouts page', ()=> {

  test.beforeEach(async ({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
  })

  test('input fields', async ({page}) => {
    const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"})
      .getByRole('textbox', {name: "email"})

    await usingTheGridEmailInput.fill('test@test.com') //the command fill() will filling your textbox with the param
    await usingTheGridEmailInput.clear() //the command clear() will clear your input field
    await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 500}) //the command pressSequentially() will press the keyboard keys by sequentially. Used to put a delay from a key to other

    //generic assertion

    const inputValue = await usingTheGridEmailInput.inputValue() // extract the value from a field
    expect(inputValue).toEqual('test2@test.com')

    //locator assertion

    await expect(usingTheGridEmailInput).toHaveValue('test2@test.com') //to input fields we use toHaveValue and not toHaveText. This one will not work
  })

  test('radio buttons', async ({page}) => {
    const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})
    // await usingTheGridForm.getByLabel('Option 1').check({force: true}) //command check will find and check the radio button with the text.
    // But if the radio has a status different of check, it will ignore. So we pass the option force: true
    await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).check({force: true})

    // gereric assertion
    const radioStatus = await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked() // will return a boolean if check or false if not check
    expect(radioStatus).toBeTruthy() // valid if the param is true

    //locator assertion
    await expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked()

    await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force: true})
    expect(await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy()
    expect(await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy()
  })
})

test.describe('Modal & Overlays - Toarstr', ()=> {
  test.beforeEach(async ({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()
  })

  test('checkbox', async ({page}) => {
    const checkbox = page.getByRole('checkbox', {name: "Hide on click"})
    await checkbox.click({force: true})
    await checkbox.check({force: true}) //The differenc between check and click is, click is click something,
    // check always will set true the check value, for this example,
    // the click will check and the method check will do nothing because the checkbox is already checked
    await checkbox.uncheck({force: true})

    const checkbox2 = page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"})
    await checkbox2.check({force: true})
    await checkbox2.uncheck({force: true})
    await checkbox2.check({force: true})


    const allBoxes =  page.getByRole('checkbox') //list of all checkbox
    for(const box of await allBoxes.all()){
      await box.check({force: true})
      expect(await  box.isChecked()).toBeTruthy()
    }
    for(const box of await allBoxes.all()){
      await box.uncheck({force: true})
      expect(await  box.isChecked()).toBeFalsy()
    }
  })
})


test('list and dropdowns', async ({page}) =>{
  const dropDownMenu = page.locator('ngx-header nb-select')
  await dropDownMenu.click()

  page.getByRole('list') // when the list has a UL tag
  page.getByRole('listitem') // when the list has a LI tag

  // const optionList = page.getByRole('list').locator('nb-option')
  const optionList = page.locator('nb-option-list nb-option')

  await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate'])
  await optionList.filter({hasText: 'Cosmic'}).click()

  const header = page.locator('nb-layout-header')
  await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

  const colors = {
    "Light": "rgb(255, 255, 255)",
    "Dark": "rgb(34, 43, 69)",
    "Cosmic": "rgb(50, 50, 89)",
    "Corporate": "rgb(255, 255, 255)",
  }

  for(const color in colors){
    await dropDownMenu.click()
    await optionList.filter({hasText: color}).click()
    await expect(header).toHaveCSS('background-color', colors[color])
  }
})


test('tooltips', async ({page}) => {
  await page.getByText('Modal & Overlays').click()
  await page.getByText('Tooltip').click()

  const toolTipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
  await toolTipCard.getByRole('button', {name: 'top'}).hover() //get the value after a hover, simulation of a hover

  page.getByRole('tooltip') //if you have a role tooltip created
  const tooltip = await page.locator('nb-tooltip').textContent()
  expect(tooltip).toEqual('This is a tooltip')
})

test.describe('Tables & Data', () => {

  test.beforeEach(async ({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()
  })

  test('dialog box - Alert browser', async ({page}) => {
    //The playwright always cancel the value from a dialog box, so you can't delete or read what is in the dialog

    page.on('dialog', dialog => {
      //Actions when a dialog box is in your screen that will be executed
      expect(dialog.message()).toEqual('Are you sure you want to delete?')
      dialog.accept()
    })

    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')

  })


  test('web tables', async ({page}) => {

    //1 get the row by any test in this row
    const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'})
    await targetRow.locator('.nb-edit').click()
    //Then the value turn to a inputs so the targetRow doesn't work anymore

    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    //2 Get the row bvased on the value in the specific column

    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowById = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click()

    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    //3 test filter of the table
    const ages = ["20", "30", "40", "200"]

    for(let age of ages){
      await page.locator('input-filter').getByPlaceholder('Age').clear()
      await page.locator('input-filter').getByPlaceholder('Age').fill(age)
      await page.waitForTimeout(500)
      const ageRows = page.locator('tbody tr')

      for(let row of await ageRows.all()){
        const cellValue = await row.locator('td').last().textContent()

        if(age=="200"){
          expect(await page.getByRole('table').textContent()).toContain('No data found')
        }
        else {
          expect(cellValue).toEqual(age);
        }
      }
    }
      await page.locator('input-filter').getByPlaceholder('Age').clear()
  })
})


test('datepicker', async ({page}) => {
  await page.getByText('Forms').click()
  await page.getByText('Datepicker').click()

  const calendarInputField = page.getByPlaceholder('Form Picker')
  await calendarInputField.click()

  let date = new Date()
  date.setDate(date.getDate() + 1)
  const expectedDate = date.getDate().toString()

  const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
  const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
  const expectedYear = date.getFullYear()

  let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
  const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`

  while (!calendarMonthAndYear.includes(expectedMonthAndYear)){
    await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
    calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
  }

  await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
  await expect(calendarInputField).toHaveValue( `${expectedMonthShort} ${expectedDate}, ${expectedYear}`)
})

test('sliders', async ({page}) => {
  //Update attibute
  // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
  // await tempGauge.evaluate(node => {
  //   node.setAttribute('cx', '232.630')
  //   node.setAttribute('cy', '232.630')
  // })
  // await tempGauge.click()

  //Mouse moving
  const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
  await tempBox.scrollIntoViewIfNeeded() //Will scroll the mouse in the box

  const box = await tempBox.boundingBox() //Create coordinate in the element, where x=0 and y=0 is the top left part of the square
  const x = box.x + box.width / 2 //get the center X coordinate
  const y = box.y + box.height / 2 //get the center Y coordinate
  await page.mouse.move(x,y)
  await page.mouse.down() //press left click
  await page.mouse.move(x + 100, y) //move to de right
  await page.mouse.move(x + 100, y + 100) // move down
  await page.mouse.up() // keep out left click

})

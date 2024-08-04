//https://playwright.dev/docs/actionability

import {expect, test} from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
})

test('Auto waiting', async ({page})=> {
    const successButton = page.locator('.bg-success')

    //Se o timeout do testes estiver em 10 segundos ele não irá rodar, pois é uma propriedadae de auto-await
    // await successButton.click()
    // await successButton.waitFor({state: "attached"}) //o teste esperará uma mudançaa de estado e com isso não irá quebrar por timeout
    // const text = await successButton.textContent()
    // expect(text).toEqual('Data Loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data Loaded with AJAX get request.', {timeout: 30000}) //ou seto para o timeout dele demorar um pouco mais

})

test('alternative waits', async ({page})=> {

    const successButton = page.locator('.bg-success')

    //__ wait for element
    // await page.waitForSelector('.bg-success')

    //__ wait for particular response
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //__ wait for network calls to be completed(Not Recommended)
    await page.waitForLoadState('networkidle')

    const text = await successButton.allTextContents()
    expect(text).toContain('Data Loaded with AJAX get request.')
})

test('timeouts', async ({page})=> {
    test.setTimeout(10000)
    test.slow() //Aumenta 3 vezes o tempo necessário para o teste passar. Por exemplo se o timeout for 10s ele vai dar timeout em 30s
    const successButton = page.locator('.bg-success')
    await successButton.click({timeout: 16000})
})

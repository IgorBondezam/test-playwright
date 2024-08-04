//https://playwright.dev/docs/actionability

import {expect, test} from '@playwright/test'
test('drag and drop with iFrame', async ({page})=> {
  await page.goto('http://www.globalsqa.com/demo-site/draganddrop/')

  const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
  await frame.locator('li', {hasText: 'High Tatras 2'}).dragTo(frame.locator('#trash'))

  //or
  await frame.locator('li', {hasText: 'High Tatras 4'}).hover() // deixa em cima do item
  await page.mouse.down() // clica
  await frame.locator('#trash').hover() // deixa em cima da lixeira
  await page.mouse.up() // solta o click

  await expect(frame.locator('#trash li h5')).toHaveText(['High Tatras 2', 'High Tatras 4'])
})


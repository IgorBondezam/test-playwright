import {expect, test} from '@playwright/test'
import tags from '../test-data/tags.json'

test.beforeEach(async ({page}) => {
  await page.route('*/**/api/tags', async route => {  // Mocking API - Intercept API route
    await route.fulfill({ //Using route.fulfill I can change the values of a request. Headers, body or methods
      body: JSON.stringify(tags)
    })
  })
  await page.route('*/**/api/articles*', async route => {
    const response = await route.fetch(); //Now I will return the value from API and then modify the firt article to what I want
    const responseBody = await response.json();
    responseBody.article[0].title = 'This is a test title';
    responseBody.article[0].description = 'This is a description';

    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })

  await page.goto('https://conduit.bondaracademy.com/')
})

test('Auto waiting', async ({page})=> {
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  await expect(page.locator('app-article-list h1')).toContainText('This is a test title');
  await expect(page.locator('app-article-list p')).toContainText('This is a description');
})


test('delete artice', async({page, request}) => {

  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', { //Create the article to delete after
    data:{
      "article":{"tagList":[],"title":"This is a test title","description":"This is a test description","body":"This is a test body"}
    }
  })
  expect(articleResponse.status()).toEqual(201)

  await page.getByText('Global Feed').click()
  await page.getByText('This is a test title').click()
  await page.getByRole('button', {name: "Delete Article"}).first().click() //Delete article
  await page.getByText('Global Feed').click()

  await expect(page.locator('app-article-list h1').first()).not.toContainText('This is a test title')

})

test('create article', async({page, request}) => {
  await page.getByText('New Article').click()
  await page.getByRole('textbox', {name:'Article Title'}).fill('Playwright is awesome')
  await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('About the Playwright')
  await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('We like to use playwright for automation')
  await page.getByRole('button', {name:'Publish Article'}).click()
  const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
  const articleResponseBody = await articleResponse.json()
  const slugId = articleResponseBody.article.slug

  await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome')
  await page.getByText('Home').first().click()
  await page.getByText('Global Feed').click()

  await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome')

  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`)
  expect(deleteArticleResponse.status()).toEqual(204)
})

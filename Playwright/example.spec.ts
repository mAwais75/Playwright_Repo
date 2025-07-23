import { test, expect } from '@playwright/test';

test.beforeEach(({page})=>{
page.goto('http://localhost:4200/pages/iot-dashboard');
})

test('Click on forms', async ({ page }) => {
  await page.getByText('Forms').click();
  await page.getByText('Form Layouts').click();
  await page.getByText('Datepicker').click();
});

test('Click on Charts and Tables & Data', async ({ page }) => {
  
  await page.getByRole('link',{name:'Charts'}).first().click();
  await page.getByText('Tables & Data').click()
  //await page.locator(':text("Charts")').click()
});

test('Locating Child Elements', async ({ page }) => {
  
  await page.getByText('Forms').click();
  await page.getByText('Form Layouts').click();
  await page.locator('nb-card nb-radio :text-is("Option 1")').click()
  await page.locator('nb-card').getByRole('button',{name:"Sign in"}).first().click()
  await page.locator('nb-card').nth(3).getByRole('button',{name:'submit'}).click()
});

test('Locating Parent Elements',async({page})=>{
  await page.getByText('Forms').click();
  await page.getByText('Form Layouts').click();
  
  //we can differentiate elements using "has text" or "has locator" to find parent elements 
  await page.locator('nb-card', {hasText:'Using the Grid'}).getByPlaceholder('Email').fill('awais')
  await page.locator('nb-card', {has:page.locator('#inputPassword2')}).getByRole('textbox',{name:'Password'}).fill('123')
  
  //Filter is a playwright command that we need in order to chain further command and implement user facing locators
  await page.locator('nb-card').filter({hasText:'Basic form'}).getByRole('textbox',{name:'Email'}).fill('AWAIS')
  await page.locator('nb-card').filter({has:page.locator('#exampleInputPassword1')}).getByPlaceholder('Password').fill('1234')

  //Locating a "Sign in" button who has a check box "remember me" using chaining filter command
  await page.locator('nb-card').filter({has:page.locator('nb-checkbox')}).filter({hasText:'Sign in'})
          .getByRole('button',{name:"Sign in"}).click()

  //Locating an email field and enter email whose div has a check box "remember me" using chaining filter command
  await page.locator('nb-card').filter({has:page.locator('nb-checkbox')}).filter({hasText:'Sign in'})
          .getByRole('textbox',{name:"Email"}).fill('Khalid')
        
})

test('Reusing the Locators', async ({page})=>{

  // First, navigate to the target section
  await page.getByText('Forms').click();
  await page.getByText('Form Layouts').click();

  //creating variables and saving commands to resue it later
  const basicForm = page.locator('nb-card').filter({hasText:'Basic form'})
  const emailField = basicForm.getByRole('textbox',{name:'Email'}) 

  
  await emailField .fill('awais@test.com')
  await page.locator('nb-card').filter({has:page.locator('#exampleInputPassword1')}).getByPlaceholder('Password').fill('1234')
  await basicForm.locator('nb-checkbox').click()
  await basicForm.getByRole('button').click()

  //Assertion
  await expect(emailField).toHaveValue('awais@test.com')
})

test('Extracting values', async({page})=>{
  //Extracting single text value
   
  // First, navigate to the target section
  await page.getByText('Forms').click();
  await page.getByText('Form Layouts').click();

   const basicForm = page.locator('nb-card').filter({hasText:'Basic form'})
   const buttonText =  await basicForm.locator('button').textContent()

   //assertion
   expect(buttonText).toEqual('Submit')

   //Extracting mulitple text values
   const allRadioButtonsLable= await page.locator('nb-radio').allTextContents()

   //assertion to make sure all the radio button lables should have the value "Option 2"
   expect(allRadioButtonsLable).toContain("Option 2")

   //grabbing Input value from a text field
   const emailField = basicForm.getByRole('textbox',{name:'Email'})
   await emailField.fill('awais@test.com')

   const emailValue = await emailField.inputValue()
   expect(emailValue).toEqual('awais@test.com')
})
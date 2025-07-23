import { test, expect } from '@playwright/test';

test('Shadow DOM', async({page})=>{

    await page.goto('https://selectorshub.com/xpath-practice-page/')
   
    //locating the shadow root element first 
    const shadowRoot =  page.locator('div#userName')
    
    //Now locating the targeted element under shadow root
    await shadowRoot.locator('#kils').fill('AWAIS')

    //Alternative way to achieve the above in a single line
    // await page.locator('#userName #kils').fill('AWAIS')
    
   
    // Get value and assert
    const filledValue = await page.locator('#userName').locator('#kils').inputValue();
    expect(filledValue).toBe('AWAIS');
    
})



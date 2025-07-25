import {test, expect } from "@playwright/test"

test('Drag and Drop with iFrames', async({page})=>{

    await page.goto('https://www.globalsqa.com/demo-site/draganddrop/')
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
    await frame.locator('li', {hasText:'High Tatras 2'}).dragTo(frame.locator('#trash'))

    //more precise strategy using mouse action to achieve above goal
     await frame.locator('li', {hasText:'High Tatras 4'}).hover()
     await page.mouse.down()//to take action from mouse
     await frame.locator('#trash').hover()
     await page.mouse.up()//to release the mouse

     //Assertion 
     await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2","High Tatras 4"])

})
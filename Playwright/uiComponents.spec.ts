import { test, expect } from '@playwright/test';
import { X_OK } from 'constants';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200/pages/iot-dashboard');
});

test.describe('Forms Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
  });

  test('Input Fields', async ({ page }) => {
    const UsingTheGridEmailField = await page
      .locator('nb-card', { hasText: 'Using the Grid' })
      .getByRole('textbox', { name: 'Email' });

    await UsingTheGridEmailField.fill('awais@test.com');

    // General Assertion
    const inputValue = await UsingTheGridEmailField.inputValue();
    expect(inputValue).toEqual('awais@test.com');

    // Locator Assertion
    await expect(UsingTheGridEmailField).toHaveValue('awais@test.com');
  });

  test('Radio Buttons', async ({ page }) => {
    const UsingTheGridRadioButton = await page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('radio', { name: 'Option 1' });

    await UsingTheGridRadioButton.check({ force: true });
    await expect(UsingTheGridRadioButton).toBeTruthy();

    const UsingTheGridRadioButton2 = await page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('radio', { name: 'Option 2' });
    await UsingTheGridRadioButton2.check({force:true});

    await expect(UsingTheGridRadioButton).not.toBeChecked();
    await expect(UsingTheGridRadioButton2).toBeChecked();

  });
});

test('CheckBoxes', async({page})=>{
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.locator('nb-checkbox').getByRole('checkbox', {name:"Hide on click"}).check({force:true})
    const option2 = await page.locator('nb-checkbox').getByRole('checkbox', {name:"Prevent arising of duplicate toast"})//.check({force:true})

    await option2.check({force:true})
    await expect(option2).toBeChecked()

    //get all the options in an array and serially click on all
    const allBoxes = page.locator('nb-checkbox').getByRole('checkbox')
    for(const box of await allBoxes.all()){
        await box.uncheck({force:true})
        expect(await box.isChecked()).toBeFalsy()
    }
})

 test('Tooltip', async({page})=>{

        await page.getByText('Modal & Overlays').click()
        await page.getByText('Tooltip').click()

       const tooltiCard = page.locator('nb-card',{hasText:"Tooltip Placements"})
       await tooltiCard.getByRole('button',{name:"Top"}).hover()

    //    //if you have role "tooltip" created by devs.but in our case we do not created
    //    page.getByRole('tooltip')
    
        const tooltip = await page.locator('nb-tooltip').textContent()
        expect(tooltip).toEqual('This is a tooltip') 
       })

       test('Bowser Dialogue Box that is not inspectable',async({page})=>{

        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()

        
        //we will add page listner as the confirmation dialogue box is not inspectable as other elements
        //we are adding the listner first becuz Playwright will capture and handle it
        //Think of it like someone knocking on your door.
        // If you're already listening (standing near the door), you'll hear the knock.
        // If you plug in your headphones after the knock, you missed it — too late.
          page.on('dialog', dialog=>{
            expect(dialog.message()).toEqual('Are you sure you want to delete?')
            dialog.accept()
        })
    
        await page.getByRole('table').locator('tr', {hasText:"mdo@gmail.com"}).locator('.nb-trash').click()
        
        //Assertion
        await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
    }) 


    test('Lists and Dropdowns', async({page})=>{
       const DropdownMenu = page.locator('ngx-header nb-select')
       await DropdownMenu.click()

    //    page.getByRole('list') //we use it when list has a tag "ul"
    //    page.getByRole('listitem') //we use it when list has a tag "li"

    //in oour case we don't have these scenarios so, we will create customize locators to get the list option
        const optionsList = page.locator('nb-option-list nb-option')
        await expect(optionsList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]) //becuz the list we got here is of an array type 
    
        //Lets click on "Cosmic" option now from the list
        await optionsList.filter({hasText:"Cosmic"}).click()

        //lets verify the color that changed with the selection of the option cosmic
        const header = page.locator('nb-layout-header');
        await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)');

        //Now, on the basis of color we can loop through each option of the list from the dropdown and assert 
        const colors = {
                "Light": "rgb(255, 255, 255)",
                "Dark": "rgb(34, 43, 69)",
                "Cosmic": "rgb(50, 50, 89)",
                "Corporate": "rgb(255, 255, 255)"
        }

        await DropdownMenu.click() //to begin the loop
        
        for(const color in colors){
        await optionsList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        
        if(color!= 'Corporate')
        await DropdownMenu.click() //in order to click on the dropdown and open it for the next iteration
        }
    })
    


    test('Web Tables',async({page})=>{

      await page.getByText('Tables & Data').click()
      await page.getByText('Smart Table').click()
      
      //selecting the row by using unique email and click on edit pencil button 
     const selectRow = page.getByRole('row',{name:"twitter@outlook.com"})
     await selectRow.locator('.nb-edit').click()

     //the above locator i.e. 'selectRow' wont work after clicking the edit button as after clicking 
     //on the edit button the DOM has been changed and the field becomes an input field and the value becomes a property
     //in order to change/edit the age of the selected row we need to change the locator 
     
     await page.locator('input-editor').getByPlaceholder('Age').clear()
     await page.locator('input-editor').getByPlaceholder('Age').fill('75')
     await page.locator('.nb-checkmark').click()
      
    //get the row based on a specific column that is located on page 2 and update the email address

    //await page.locator('.ng2-smart-pagination pagination').getByRole('link',{name:'2'}).click()
    //await page.locator('.ng2-smart-pagination .page-link', { hasText: '2' }).click();
    await page.getByRole('link', { name: '2' }).click()

      const targetRowById = page.getByRole('row', {name: "11"})
      .filter({has: page.locator('td').nth(1).getByText('11')})
      
      await targetRowById.locator('.nb-edit').click()
      await page.locator('input-editor').getByPlaceholder('E-mail').clear()
      await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
      await page.locator('.nb-checkmark').click()
      await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

      //scenario: writing the scripts for tgesting the filter feature of the web table by enter age 
      //in the age field using an array, that will consequently display the relevant records as per entered age

      const ages = ['20', '30', '40', '200']

      for(let age of ages){

        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)

        const allFilteredRows = page.locator('tbody tr')//it will provide alll the rows that are filtered

        //the following for loop will get all the rows in an array by using .all() function
        for(let row of await allFilteredRows.all()){

          //now, we will be getting the cell value to make sure its matching according to the filter applied
          const cellValue = await row.locator('td').last().textContent()
          if(age == '200'){
            const noDataFoundMsg = page.locator('tbody').getByText('No data found')
            await expect(noDataFoundMsg).toContainText('No data found')
          }else{
            expect(cellValue).toEqual(age)
          }
          
        }
      
      }
  
  })


  test('Datepickers', async({page})=>{
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()
  
    const calenderInputField = page.getByPlaceholder('Form Picker')
    await calenderInputField.click()

    //Selecting date from th calender 
    await page.locator('[class="day-cell ng-star-inserted"]').getByText('1',{exact:true}).click()//as get by text partially selects the text so, we will pass a flag of exact true if we want to match the exact text 
    await expect(calenderInputField).toHaveValue('Jun 1, 2025')
  
  })



test('Sliders', async({page})=>{
  
  //Update attribute
  // const tempGuage = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
  // await tempGuage.evaluate(Node=>{
  //   Node.setAttribute('cx', '232.63098833543773')
  //   Node.setAttribute('cy', '232.6309883354377')
  // })
  // await tempGuage.click()//trigger the action in order to trigger the event to experience the change on the UI

  //Through mouse movement
  const tempGuage = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
  await tempGuage.scrollIntoViewIfNeeded()//this will make sure the area we are about to do mouse movement is visible

  const box = await tempGuage.boundingBox()

  //now, we will take our starting point from the mid section instead of start
  const x = box.x + box.width/2
  const y = box.y + box.height/2

  //now, we will do mouse actions for the real time simultion
  await page.mouse.move(x,y)
  await page.mouse.down()
  page.mouse.move(x+100, y)
  page.mouse.move(x+100, y+250)
  page.mouse.up() // to loose the mouse

  //Assertion
  const tempValue = page.locator('.value.temperature');
  await expect(tempValue).toContainText('30');



})
import { test, expect } from '@playwright/test';
import { NavigationPage } from '../Page-objects/navigationPage';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200/pages/iot-dashboard');
});

test('Navigate to forms layout page', async({page})=>{

    //creating instance of the class using "new" keyword to use the objects we created for navigating to forms layout page
    const navigateTo = new NavigationPage(page)
    await navigateTo.formsLayoutPage()
    await navigateTo.datePickerPage()
    await navigateTo.smartTablesPage()
    await navigateTo.toasterPage()
    await navigateTo.tooltipPage()
})
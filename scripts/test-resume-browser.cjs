// Local browser acceptance. Set RESUME_TEST_URL for custom-domain or Pages base tests.
const { chromium } = require('/Users/bettercallme/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const assert = require('node:assert/strict');const fs=require('node:fs');const path=require('node:path')
const base=process.env.RESUME_TEST_URL || 'http://127.0.0.1:4178/';const review=path.resolve('.resume-review');fs.mkdirSync(review,{recursive:true})
;(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chromium'});const checks=[],errors=[]
 const ok=(name,condition)=>{assert.ok(condition,name);checks.push(name)}
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message))
  await page.goto(base+'resume',{waitUntil:'networkidle'});ok(`${width}: resume route`,await page.locator('h1').innerText()==='Resume.')
  await page.reload({waitUntil:'networkidle'});ok(`${width}: direct refresh`,await page.locator('.resume-page').count()===1)
  ok(`${width}: no horizontal overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
  ok(`${width}: nav active`,await page.getByRole('link',{name:'Résumé',exact:true}).getAttribute('aria-current')==='page')
  const text=await page.locator('main').innerText();for(const term of ['天津丁尘文化传媒','杭州树成林教育科技集团有限公司','远程合作','10万+','470万+'])ok(`${width}: fact ${term}`,text.includes(term))
  ok(`${width}: phone hidden`,!text.includes('18270896361'));ok(`${width}: newest experience first`,text.indexOf('天津丁尘')<text.indexOf('@晓羊学长'))
  await page.getByRole('link',{name:'Experience',exact:true}).click();ok(`${width}: chapter anchor`,new URL(page.url()).hash==='#experience')
  const email=page.locator('.resume-contacts a').first();ok(`${width}: contact`,await email.getAttribute('href')==='mailto:cocobolo_111@icloud.com')
  for(const link of await page.locator('.resume-detail h3 a').all()){
   const href=await link.getAttribute('href');const response=await page.request.get(new URL(href,base).href);ok(`${width}: case HTTP ${href}`,response.status()===200)
  }
  // Click real case and return, not only a status request.
  await page.locator('.resume-detail h3 a').first().click();await page.waitForLoadState('networkidle');ok(`${width}: real case component`,await page.locator('.case-study').count()===1)
  await page.goBack({waitUntil:'networkidle'});ok(`${width}: back to resume`,await page.locator('.resume-page').count()===1)
  const download=page.getByRole('link',{name:'下载 PDF',exact:false});const href=await download.getAttribute('href');const response=await page.request.get(new URL(href,base).href)
  ok(`${width}: PDF content type`,response.headers()['content-type'].includes('application/pdf'));ok(`${width}: PDF bytes`,(await response.body()).subarray(0,5).toString()==='%PDF-')
  const event=page.waitForEvent('download');await download.click();const file=await event;ok(`${width}: actual download`,file.suggestedFilename().endsWith('.pdf'))
  const popup=page.waitForEvent('popup');await page.getByRole('link',{name:'在线预览'}).click();const preview=await popup;await preview.waitForURL('**/resume/he-yang-resume.pdf');ok(`${width}: preview URL`,preview.url().includes('he-yang-resume.pdf'));await preview.close()
  // Verify keyboard focus and visible contrast-style affordance.
  await page.goto(base+'resume',{waitUntil:'networkidle'});await page.keyboard.press('Tab');ok(`${width}: keyboard skip link`,await page.locator('.skip-link').evaluate(e=>e===document.activeElement))
  await page.locator('h1').click();await page.screenshot({path:path.join(review,`${base.includes('personal-portfolio')?'resume-pages':'resume'}-${width}.png`),fullPage:true});await page.close()
 }
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'})
 for(const route of ['', 'work/traintrace','work/ai-content-growth-os']){await page.goto(base+route,{waitUntil:'networkidle'});ok(`existing ${route||'home'} retained`,await page.locator('.resume-page').count()===0);ok(`existing ${route||'home'} loaded`,!await page.getByText('这个案例还没上架。').count())}
 ok('no browser exceptions',errors.length===0);await browser.close();fs.writeFileSync(path.join(review,base.includes('personal-portfolio')?'browser-pages.json':'browser-root.json'),JSON.stringify({base,checks,errors,passed:checks.length},null,2));console.log(JSON.stringify({passed:checks.length,errors}))
})().catch(e=>{console.error(e);process.exit(1)})

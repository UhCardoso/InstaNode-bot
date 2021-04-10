const puppeteer = require('puppeteer');
const fs = require('fs');

const auth = require('./config/auth-info.json');
const profiles = require('./config/profiles.json');

let botFollowed = 0;
let botUnfollow = 0;

async function botStart() {
    let error = false;

     //===============================
    // DADOS DE LOGIN
    const user = auth.user;  
    const password = auth.password;
    // ===============================

     //========================================
    // PERFIS ALVOS                     
      const perfil1 = profiles.perfil1;   
      const perfil2 = profiles.perfil2;     
      const perfil3 = profiles.perfil3;     
      const perfil4 = profiles.perfil4;
      const perfil5 = profiles.perfil5;
      const perfil6 = profiles.perfil6;
      const perfil7 = profiles.perfil7; 
    // ========================================
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--disable-setuid-sandbox', '--no-sandbox', '--enable-features=NetworkService']
    });
    const page = await browser.newPage();

    // Verificar se cookie existe
    const arquivo = await fs.existsSync('./cookies.json');
    if(arquivo) {
        console.log("================= Cookie encontrado ==================");

        // Reutilizar cookies
        const cookiesString = await fs.readFileSync('./cookies.json');
        const cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);

        try {
            await page.goto('https://www.instagram.com/');
    
            // Negar notificaçao 
            await page.waitForSelector('body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm');
            await page.click('body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm')
            
            // Parar de seguir perfis
            await page.goto(`https://www.instagram.com/${user}/`);
            await page.waitForSelector('#react-root > section > main > div > header > section > ul > li:nth-child(3) > a');
            await page.click('#react-root > section > main > div > header > section > ul > li:nth-child(3) > a');
        } catch(err) {
            console.log("Erro ao acessar meu perfil");
            await browser.close();
            initBot();
            error = true;
        }

        let finishUnfollow = true;
        for(i = 1; i <= 5; i++) {
            try{
                await page.waitForSelector(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                let textButton = await page.$(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                let valueTextButton = await page.evaluate(el => el.textContent, textButton);
                
                if(valueTextButton == 'Seguindo') {
                    await page.click(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`, {delay: 100});
                    await page.waitForSelector('body > div:nth-child(19) > div > div > div > div.mt3GC > button.aOOlW.-Cab_')
                    await page.click('body > div:nth-child(19) > div > div > div > div.mt3GC > button.aOOlW.-Cab_', {delay: 100});
                    botUnfollow = botUnfollow+1;
                }

                if( i == 5) {
                    finishUnfollow = true;
                }
            } catch(err) {
                finishUnfollow = true;
                console.log("Erro ao deixar de seguir perfis");
                await browser.close();
                if(!error) {
                    initBot();
                }
                error = true;
            }
        }

        if(finishUnfollow) {
            let totalFollowing = 0;
            let totalFollowed = 0;
            let followAnotherProfile = false;

            try{
                // Navegar para pagina e clicar em seguidores
                await page.goto(`https://www.instagram.com/${perfil1}/`);
                await page.waitForSelector('#react-root > section > main > div > header > section > ul > li:nth-child(2) > a');
                await page.click('#react-root > section > main > div > header > section > ul > li:nth-child(2) > a');
                
                console.log(' ');
                console.log('--------------------------------------');
                console.log(`Pegando seguidores de ${perfil1}...`);
                console.log('--------------------------------------');            

                // Seguir perfis
                for(i = 1; i <= 11; i++) {

                    await page.waitForSelector(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                    let textButton = await page.$(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                    let valueTextButton = await page.evaluate(el => el.textContent, textButton);
                    
                    if(valueTextButton == 'Seguir' && totalFollowed <= 11) {
                        await page.click(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`, {delay: 100});
                        totalFollowed = totalFollowed + 1;
                        console.log('Seguiu um total de '+i+' neste perfil');
                        console.log('Seguiu até agora no : '+totalFollowed);
                        botFollowed = botFollowed+1;
                        
                    } else {
                        totalFollowing = totalFollowing + 1;
                        console.log('Ja segue um total de: '+totalFollowing);
                        if(totalFollowing == 3 || totalFollowed > 11) {
                            followAnotherProfile = true;
                            break;
                        }
                    }
                }
            } catch(err) {
                await browser.close();
                if(!error) {
                    initBot();
                }
                error = true;
            }

            console.log('Seguiu até agora no  '+totalFollowed);

            try{
                // Seguir outro perfil
                if(followAnotherProfile) {
                    followAnotherProfile = false;
                    totalFollowing = 0;

                    // Navegar para pagina e clicar em seguidores
                    await page.goto(`https://www.instagram.com/${perfil2}/`);
                    await page.waitForSelector('#react-root > section > main > div > header > section > ul > li:nth-child(2) > a');
                    await page.click('#react-root > section > main > div > header > section > ul > li:nth-child(2) > a');
                    
                    console.log(' ');
                    console.log('-----------------------------------');
                    console.log(`Pegando seguidores de ${perfil2}...`);
                    console.log('-----------------------------------');

                    // Seguir perfis
                    for(i = 1; i <= 11; i++) {

                        await page.waitForSelector(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                        let textButton = await page.$(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                        let valueTextButton = await page.evaluate(el => el.textContent, textButton);
                        
                        if(valueTextButton == 'Seguir' && totalFollowed <= 11) {
                            await page.click(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`, {delay: 100});
                            totalFollowed = totalFollowed + 1;
                            console.log('Seguiu um total de '+i+' neste perfil');
                            console.log('Seguiu até agora no : '+totalFollowed);
                            botFollowed = botFollowed+1;
                            
                        } else {
                            totalFollowing = totalFollowing + 1;
                            console.log('Ja segue um total de: '+totalFollowing);
                            if(totalFollowing == 3 || totalFollowed > 11) {
                                followAnotherProfile = true;
                                break;
                            }
                        }
                    }
                }
            } catch(err) {
                await browser.close();
                if(!error) {
                    initBot();
                }
                error = true;
            } 

            console.log('Seguiu até agora no  '+totalFollowed);

            try {
                // Seguir outro perfil
                if(followAnotherProfile) {
                    followAnotherProfile = false;
                    totalFollowing = 0;

                    // Navegar para pagina e clicar em seguidores
                    await page.goto(`https://www.instagram.com/${perfil3}/`);
                    await page.waitForSelector('#react-root > section > main > div > header > section > ul > li:nth-child(2) > a');
                    await page.click('#react-root > section > main > div > header > section > ul > li:nth-child(2) > a');
                    
                    console.log(' ');
                    console.log('--------------------------------------------');    
                    console.log(`Pegando seguidores de ${perfil3}...`);
                    console.log('--------------------------------------------');

                    // Seguir perfis
                    for(i = 1; i <= 11; i++) {

                        await page.waitForSelector(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                        let textButton = await page.$(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                        let valueTextButton = await page.evaluate(el => el.textContent, textButton);
                        
                        if(valueTextButton == 'Seguir' && totalFollowed <= 11 ) {
                            await page.click(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`, {delay: 100});
                            totalFollowed = totalFollowed + 1;
                            console.log('Seguiu um total de '+i+' neste perfil');
                            botFollowed = botFollowed+1;

                        } else {
                            totalFollowing = totalFollowing + 1;
                            console.log('Ja segue um total de: '+totalFollowing);
                            if(totalFollowing == 3 || totalFollowed > 11) {
                                followAnotherProfile = true;
                                break;
                            }
                        }
                    }

                }
            } catch(err) {
                await browser.close();
                if(!error) {
                    initBot();
                }
                error = true;
            }

            console.log('Seguiu até agora no  '+totalFollowed);

            try {
                // Seguir outro perfil
                if(followAnotherProfile) {
                    followAnotherProfile = false;
                    totalFollowing = 0;

                    // Navegar para pagina e clicar em seguidores
                    await page.goto(`https://www.instagram.com/${perfil4}/`);
                    await page.waitForSelector('#react-root > section > main > div > header > section > ul > li:nth-child(2) > a');
                    await page.click('#react-root > section > main > div > header > section > ul > li:nth-child(2) > a');
                    
                    console.log(' ');
                    console.log('--------------------------------------------');    
                    console.log(`Pegando seguidores de ${perfil4}...`);
                    console.log('--------------------------------------------');

                    // Seguir perfis
                    for(i = 1; i <= 11; i++) {

                        await page.waitForSelector(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                        let textButton = await page.$(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                        let valueTextButton = await page.evaluate(el => el.textContent, textButton);
                        
                        if(valueTextButton == 'Seguir' && totalFollowed <= 11) {
                            await page.click(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`, {delay: 100});
                            totalFollowed = totalFollowed + 1;
                            console.log('Seguiu um total de '+i+' neste perfil');
                            botFollowed = botFollowed+1;

                        } else {
                            totalFollowing = totalFollowing + 1;
                            console.log('Ja segue um total de: '+totalFollowing);
                            if(totalFollowing == 3 || totalFollowed > 11) {
                                followAnotherProfile = true;
                                break;
                            }
                        }
                    }
                }
            } catch(err) {
                await browser.close();
                if(!error) {
                    initBot();
                }
                error = true;
            }
            
            console.log('Seguiu até agora no  '+totalFollowed);

            try {
                // Seguir outro perfil
                if(followAnotherProfile) {
                    followAnotherProfile = false;
                    totalFollowing = 0;

                    // Navegar para pagina e clicar em seguidores
                    await page.goto(`https://www.instagram.com/${perfil5}/`);
                    await page.waitForSelector('#react-root > section > main > div > header > section > ul > li:nth-child(2) > a');
                    await page.click('#react-root > section > main > div > header > section > ul > li:nth-child(2) > a');
                    
                    console.log(' ');
                    console.log('--------------------------------------------');    
                    console.log(`Pegando seguidores de ${perfil5}...`);
                    console.log('--------------------------------------------');

                    // Seguir perfis
                    for(i = 1; i <= 11; i++) {

                        await page.waitForSelector(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                        let textButton = await page.$(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                        let valueTextButton = await page.evaluate(el => el.textContent, textButton);
                        
                        if(valueTextButton == 'Seguir' && totalFollowed <= 11) {
                            await page.click(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`, {delay: 100});
                            totalFollowed = totalFollowed + 1;
                            console.log('Seguiu um total de '+i+' neste perfil');
                            botFollowed = botFollowed+1;

                        } else {
                            totalFollowing = totalFollowing + 1;
                            console.log('Ja segue um total de: '+totalFollowing);
                            if(totalFollowing == 3 || totalFollowed > 11) {
                                followAnotherProfile = true;
                                break;
                            }
                        }
                    }
                }
            } catch(err) {
                await browser.close();
                if(!error) {
                    initBot();
                }
                error = true;
            }

            console.log('Seguiu até agora no  '+totalFollowed);

            try {
                // Seguir outro perfil
                if(followAnotherProfile) {
                    followAnotherProfile = false;
                    totalFollowing = 0;

                    // Navegar para pagina e clicar em seguidores
                    await page.goto(`https://www.instagram.com/${perfil6}/`);
                    await page.waitForSelector('#react-root > section > main > div > header > section > ul > li:nth-child(2) > a');
                    await page.click('#react-root > section > main > div > header > section > ul > li:nth-child(2) > a');
                    
                    console.log(' ');
                    console.log('--------------------------------------------');    
                    console.log(`Pegando seguidores de ${perfil6}...`);
                    console.log('--------------------------------------------');

                    // Seguir perfis
                    for(i = 1; i <= 11; i++) {

                        await page.waitForSelector(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                        let textButton = await page.$(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                        let valueTextButton = await page.evaluate(el => el.textContent, textButton);
                        
                        if(valueTextButton == 'Seguir' && totalFollowed <= 11) {
                            await page.click(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`, {delay: 100});
                            totalFollowed = totalFollowed + 1;
                            console.log('Seguiu um total de '+i+' neste perfil');
                            botFollowed = botFollowed+1;

                        } else {
                            totalFollowing = totalFollowing + 1;
                            console.log('Ja segue um total de: '+totalFollowing);
                            if(totalFollowing == 3 || totalFollowed > 11) {
                                followAnotherProfile = true;
                                break;
                            }
                        }
                    }
                }
            } catch(err) {
                await browser.close();
                if(!error) {
                    initBot();
                }
                error = true;
            }

            console.log('Seguiu até agora no  '+totalFollowed);

            try {
                // Seguir outro perfil
                if(followAnotherProfile) {
                    followAnotherProfile = false;
                    totalFollowing = 0;

                    // Navegar para pagina e clicar em seguidores
                    await page.goto(`https://www.instagram.com/${perfil7}/`);
                    await page.waitForSelector('#react-root > section > main > div > header > section > ul > li:nth-child(2) > a');
                    await page.click('#react-root > section > main > div > header > section > ul > li:nth-child(2) > a');
                    
                    console.log(' ');
                    console.log('--------------------------------------------');    
                    console.log(`Pegando seguidores de ${perfil7}...`);
                    console.log('--------------------------------------------');

                    // Seguir perfis
                    for(i = 1; i <= 11; i++) {

                        await page.waitForSelector(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                        let textButton = await page.$(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                        let valueTextButton = await page.evaluate(el => el.textContent, textButton);
                        
                        if(valueTextButton == 'Seguir' && totalFollowed <= 11) {
                            await page.click(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`, {delay: 100});
                            totalFollowed = totalFollowed + 1;
                            console.log('Seguiu um total de '+i+' neste perfil');
                            botFollowed = botFollowed+1;

                        } else {
                            totalFollowing = totalFollowing + 1;
                            console.log('Ja segue um total de: '+totalFollowing);
                            if(totalFollowing == 3 || totalFollowed > 11) {
                                break;
                            }
                        }
                    }
                }
            } catch(err) {
                await browser.close();
                if(!error) {
                    initBot();
                }
                error = true;
            }

            console.log('Seguiu até agora no  '+totalFollowed);

            console.log(' ');
            console.log('-------------------------------------');
            console.log('|          RELATÓRIO FINAL           |')
            console.log('-------------------------------------');
            console.log('O bot parou de seguir um total de: '+botUnfollow+' perfis');
            console.log('O Bot seguiu um total de: '+botFollowed+' perfis');
        
            
            browser.close();
        }
    } else {
        try {
            console.log("================= Cookie não encontrado ==================");
            await page.goto('https://www.instagram.com/');

            // Autenticacao
            await page.waitFor('input[name="username"]')
            await page.type('input[name="username"]', user , {delay: 100});
            await page.type('input[name="password"]', password, {delay: 100});
            await page.keyboard.press('Enter');


            // Salvar info de login
            await page.waitForSelector('#react-root > section > main > div > div > div > section > div > button')
            await page.click("#react-root > section > main > div > div > div > section > div > button")

            // Negar notificaçao 
            await page.waitForSelector('body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm');
            await page.click('body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm')

            // Salvar cookies
            const cookies = await page.cookies();
            await fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2));
            
            await page.close();
            await browser.close();
            initBot();
        
        } catch(err) {
            await browser.close();
            initBot();
        }
    }
}

function initBot() {
    botStart();
}
initBot();
setInterval(initBot, 1200000);

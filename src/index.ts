import * as Nightmare from 'nightmare';
import * as dotenv from 'dotenv';

dotenv.config();

// ? http://kylestetz.github.io/Sentencer/
// ? http://metaphorpsum.com/

(async () => {
    try {
        const nightmare = new Nightmare({ show: true });

        const hrefs = await getDailyLinks(nightmare);
        for (let href of hrefs) {
            await nightmare.goto(href).wait(2000).then(_ => _);
            // todo: add logic to handle quizes and such :)
        }

        searchBing(nightmare, 'react router');
        await nightmare.end().then(_ => _);
    } catch (err) {
        console.error(err);
    }
})();

function login(nightmare: Nightmare) {
    return nightmare
        .goto('https://account.microsoft.com/rewards/')
        .click('#signinhero')
        .type('input[name="loginfmt"]', process.env.MS_USER)
        .click('input[value="Next"]')
        .wait(() => !document.querySelector('input[name="passwd"]').classList.contains('moveOffScreen'))
        .type('input[name="passwd"]', process.env.MS_PASS)
        .click('input[Value="Sign in"]')
        .wait('mee-rewards-daily-set-section');
}

function searchBing(nightmare: Nightmare, searchString: string) {
    return nightmare
        .goto('https://www.bing.com/')
        .type('#sb_form_q', searchString)
        .click('#sb_form_go')
        .wait(2000);
}

async function getDailyLinks(nightmare) {
    login(nightmare);
    return nightmare
        .evaluate(() => {
            const iterator = document.querySelectorAll('mee-rewards-daily-set-section button + mee-card-group mee-card').values();
            return Array.from(iterator)
                .map((element) => element.querySelector('a.c-call-to-action'))
                .map((anchor: HTMLAnchorElement) => anchor.href);
        })
        .then((hrefs: string[]) => hrefs);
}

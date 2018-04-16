import * as Nightmare from 'nightmare';
import * as dotenv from 'dotenv';

dotenv.config();

const nightmare = new Nightmare({
    show: true,
    openDevTools: {
        mode: 'detach'
    }
});

(async () => {
    try {
        const hrefs = await getDailyLinks();
        for (let href of hrefs) {
            await nightmare.goto(href).wait(5000).then(_ => _);
            // todo: add logic to handle quizes and such :)
        }
        nightmare.end().then(_ => _);
    } catch (err) {
        console.error(err);
    }
})();

async function getDailyLinks() {
    return nightmare
        .goto('https://account.microsoft.com/rewards/')
        .click('#signinhero')
        .type('input[name="loginfmt"]', process.env.MS_USER)
        .click('input[value="Next"]')
        .wait(() => !document.querySelector('input[name="passwd"]').classList.contains('moveOffScreen'))
        .type('input[name="passwd"]', process.env.MS_PASS)
        .click('input[Value="Sign in"]')
        .wait('mee-rewards-daily-set-section')
        .evaluate(() => {
            const iterator = document.querySelectorAll('mee-rewards-daily-set-section button + mee-card-group mee-card').values();
            return Array.from(iterator)
                .map((element) => element.querySelector('a.c-call-to-action'))
                .map((anchor: HTMLAnchorElement) => anchor.href);
        })
        .then((hrefs: string[]) => hrefs);
}

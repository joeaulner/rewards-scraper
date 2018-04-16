import * as Nightmare from 'nightmare';
import * as dotenv from 'dotenv';

dotenv.config();

const nightmare = new Nightmare({
    loadImages: false,
    show: true,
    openDevTools: {
        mode: 'detach'
    }
});

nightmare
    .goto('https://account.microsoft.com/rewards/')
    .click('#signinhero')
    .type('input[name="loginfmt"]', process.env.MS_USER)
    .click('input[value="Next"]')
    .wait(() => !document.querySelector('input[name="passwd"]').classList.contains('moveOffScreen'))
    .type('input[name="passwd"]', process.env.MS_PASS)
    .click('input[Value="Sign in"]')
    .wait('mee-rewards-daily-set-section')
    .evaluate(() => {
        // todo: figure out why element list is being "sanitized" before being returned to the node execution context
        const dailyCards: Element[] = [];
        const elements = document.querySelectorAll('mee-rewards-daily-set-section button + mee-card-group mee-card').values();
        let next = elements.next();
        while (!next.done) {
            console.log(next.value);
            dailyCards.push(next.value);
            next = elements.next();
        }
        return dailyCards;
    })
    .then((data) => {
        debugger;
    })
    .catch((err) => {
        debugger;
    });

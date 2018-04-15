import * as Nightmare from 'nightmare';

const nightmare = new Nightmare({
    loadImages: false,
    show: true
});

nightmare
    .goto('https://account.microsoft.com/rewards/')
    .click('#signinhero')
    .type('input[name="loginfmt"]', '*****')
    .click('input[value="Next"]')
    .type('input[name="passwd"]', '*****')
    .click('input[Value="Sign in"]')
    .then((data) => {
        debugger;
    })
    .catch((err) => {
        debugger;
    });

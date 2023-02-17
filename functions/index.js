const functionsFirebase = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const axios = require("axios");
const cheerio = require("cheerio");
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
exports.helloWorld = functionsFirebase.https.onRequest(async (request, response) => {
    let today = new Date();
    let options = {
        timeZone: 'America/Chicago',
        year: "numeric", month: "short", day: "numeric"
    };
    let todayFormatted = new Intl.DateTimeFormat('en-US', options).format(today);

    let newDate = new Date()
    const optionsM = {month: "short", timeZone: 'America/Chicago'};
    let month = new Intl.DateTimeFormat("en-US", optionsM).format(newDate);

    const ll = await axios.get("https://www.illinoislottery.com/dbg/results/pick3?page=1");
    const $ = cheerio.load(ll.data);

    const divsWithClassDfs = $('.results__list-item').get().reverse();
    let gridBallPicks;
    let fireball;
    $(divsWithClassDfs).each(async (i, elem) => {
        const divWithClassFs = $(elem).find('.dbg-results__date-info');
        let drawMonthTextSecond
        let secondElement
        const middayOrEvening = $(elem).find('.dbg-results__draw-info');
        if (divWithClassFs.text().substring(0, 3) === 'Feb') {
            const prevElem = $(divsWithClassDfs[i - 1]);
            if (prevElem) {
                // access elements in the previous `results__list-item`
                drawMonthTextSecond = prevElem.find('.dbg-results__date-info');

                secondElement = prevElem.find(".grid-ball--pick3-primary")
                    .map((pickIndex, pickElement) => {
                        let xx = $(pickElement).text()
                        return parseInt(xx.replace(/[^0-9]/g, ""));
                    })
                    .get()
            }


            gridBallPicks = $(elem)
                .find(".grid-ball--pick3-primary")
                .map((pickIndex, pickElement) => {
                    let xx = $(pickElement).text()
                    return parseInt(xx.replace(/[^0-9]/g, ""));
                })
                .get()

            fireball = $(elem)
                .find(".grid-ball--pick3-secondary")
                .map((pickIndex, pickElement) => {
                    let xx = $(pickElement).text()
                    return parseInt(xx.replace(/[^0-9]/g, ""));
                })
                .get()

            const evenOddCheck = gridBallPicks.map(num => {
                return num % 2 === 0 ? 'even' : 'odd'
            })

            const evenOddCheckFirstTwo = gridBallPicks.slice(0, 2).map(num => {
                return num % 2 === 0 ? 'even' : 'odd'
            })

            const evenOddCheckLastTwo = gridBallPicks.slice(-2).map(num => {
                return num % 2 === 0 ? 'even' : 'odd'
            })

            let firstAndLastArr = [gridBallPicks[0], gridBallPicks[2]]
            const evenOddCheckFirstAndLast = firstAndLastArr.map(num => {
                return num % 2 === 0 ? 'even' : 'odd'
            })

            let letter = [];

            for (let i = 0; i < gridBallPicks.length - 1; i++) {
                if (gridBallPicks[i] > gridBallPicks[i + 1]) {
                    letter.push("L");
                }
                if (gridBallPicks[i] === gridBallPicks[i + 1]) {
                    letter.push("E");
                }
                if (gridBallPicks[i] < gridBallPicks[i + 1]) {
                    letter.push("H");
                }
            }

            let r = parseInt(divWithClassFs.text().match(/\d+/)?.[0])
            let y = middayOrEvening.text().replace(/[^a-zA-Z]+/g, "")
            if(y==='midday'){
                r = r * 2
            }else {
                r = (r * 2) + 1
            }

            const subtractArrays = (arrayOne, arrayTwo) => {
                let resultArray = [];
                for (let i = 0; i < arrayOne.length; i++) {
                    resultArray.push(arrayOne[i] - arrayTwo[i]);
                }
                return resultArray;
            };

            const result = {
                numbers: [...gridBallPicks],
                drawDate: divWithClassFs.text(),
                drawMonth: divWithClassFs.text().substring(0, 3),
                index: r,
                time: middayOrEvening.text().replace(/[^a-zA-Z]+/g, ""),
                fireball: fireball[0],
                winningCombinationsObj: {
                    list: [
                        [fireball[0], gridBallPicks[1], gridBallPicks[2]].join(''),
                        [gridBallPicks[0], fireball[0], gridBallPicks[2]].join(''),
                        [gridBallPicks[0], gridBallPicks[1], fireball[0]].join('')
                    ]
                },
                sumAllThreeNums: gridBallPicks[0] + gridBallPicks[1] + gridBallPicks[2],
                evenOdd: evenOddCheck.join(','),
                firstTwoNumsObj: {
                    firstTwoNumsString: gridBallPicks.slice(0, 2).join(','),
                    firstTwoNumsSum: gridBallPicks[0] + gridBallPicks[1],
                    firstTwoEvenOdd: evenOddCheckFirstTwo.join(',')
                },
                lastTwoNumsObj: {
                    lastTwoNumsString: gridBallPicks.slice(-2).join(','),
                    lastTwoNumsSum: gridBallPicks[1] + gridBallPicks[2],
                    lastTwoEvenOdd: evenOddCheckLastTwo.join(',')
                },
                firstAndLastNumsObj: {
                    firstAndLastNumsString: [gridBallPicks[0], gridBallPicks[gridBallPicks.length - 1]].join(','),
                    firstAndLastNumsSum: gridBallPicks[0] + gridBallPicks[2],
                    firstTwoEvenOdd: evenOddCheckFirstAndLast.join(',')
                },
                previousDrawPlusNegative: {
                    numbers: divWithClassFs.text().substring(0, 3)===drawMonthTextSecond.text().substring(0, 3)?subtractArrays(gridBallPicks, secondElement):null,
                    numbersString: divWithClassFs.text().substring(0, 3)===drawMonthTextSecond.text().substring(0, 3)?subtractArrays(gridBallPicks, secondElement).join(''):null,
                    numbersFirstTwoString: divWithClassFs.text().substring(0, 3)===drawMonthTextSecond.text().substring(0, 3)?subtractArrays(gridBallPicks, secondElement).slice(0, 2).join(''):null
                },
                previousDrawTwoNumDown:{
                    first: [gridBallPicks[0], secondElement[0]].join(''),
                    second: [gridBallPicks[1], secondElement[1]].join(''),
                    third: [gridBallPicks[2], secondElement[2]].join('')
                },
                lowHighEqual: letter.join(''),
                fullNumsString: gridBallPicks.join(''),
                timestamp: admin.firestore.Timestamp.now()
            };

            // console.log(result)
            await admin.firestore().collection('picks').add(result);

        }

    });
    response.send("hello");

});


// exports.getOne = functionsFirebase.pubsub.schedule('0 13,23 * * *').timeZone('America/Chicago').onRun(async context => {
//     let today = new Date();
//     let options = {
//         timeZone: 'America/Chicago',
//         year: "numeric", month: "short", day: "numeric"
//     };
//     let todayFormatted = new Intl.DateTimeFormat('en-US', options).format(today);
//
//
//     const ll = await axios.get("https://www.illinoislottery.com/dbg/results/pick3");
//     const $ = cheerio.load(ll.data);
//
//     const divsWithClassDfs = $('.results__list-item').first().get();
//     let gridBallPicks;
//     let fireball;
//     $(divsWithClassDfs).each(async (i, elem) => {
//         const divWithClassFs = $(elem).find('.dbg-results__date-info');
//         const middayOrEvening = $(elem).find('.dbg-results__draw-info');
//         if (divWithClassFs.text() === todayFormatted) {
//             gridBallPicks = $(elem)
//                 .find(".grid-ball--pick3-primary")
//                 .map((pickIndex, pickElement) => {
//                     let xx = $(pickElement).text()
//                     return parseInt(xx.replace(/[^0-9]/g, ""));
//                 })
//                 .get()
//
//             fireball = $(elem)
//                 .find(".grid-ball--pick3-secondary")
//                 .map((pickIndex, pickElement) => {
//                     let xx = $(pickElement).text()
//                     return parseInt(xx.replace(/[^0-9]/g, ""));
//                 })
//                 .get()
//
//             const evenOddCheck = gridBallPicks.map(num => {
//                 return num % 2 === 0 ? 'even' : 'odd'
//             })
//
//             const evenOddCheckFirstTwo = gridBallPicks.slice(0, 2).map(num => {
//                 return num % 2 === 0 ? 'even' : 'odd'
//             })
//
//             const evenOddCheckLastTwo = gridBallPicks.slice(-2).map(num => {
//                 return num % 2 === 0 ? 'even' : 'odd'
//             })
//
//             let firstAndLastArr = [gridBallPicks[0], gridBallPicks[2]]
//             const evenOddCheckFirstAndLast = firstAndLastArr.map(num => {
//                 return num % 2 === 0 ? 'even' : 'odd'
//             })
//
//             let letter = [];
//
//             for (let i = 0; i < gridBallPicks.length - 1; i++) {
//                 if (gridBallPicks[i] > gridBallPicks[i + 1]) {
//                     letter.push("L");
//                 }
//                 if (gridBallPicks[i] === gridBallPicks[i + 1]) {
//                     letter.push("E");
//                 }
//                 if (gridBallPicks[i] < gridBallPicks[i + 1]) {
//                     letter.push("H");
//                 }
//             }
//
//             let r = parseInt(divWithClassFs.text().match(/\d+/)?.[0])
//             let y = middayOrEvening.text().replace(/[^a-zA-Z]+/g, "")
//             if(y==='midday'){
//                 r = r * 2
//             }else {
//                 r = (r * 2) + 1
//             }
//
//             const result = {
//                 numbers: [...gridBallPicks],
//                 drawDate: todayFormatted,
//                 drawMonth: divWithClassFs.text().substring(0, 3),
//                 index: r,
//                 time: middayOrEvening.text().replace(/[^a-zA-Z]+/g, ""),
//                 fireball: fireball[0],
//                 winningCombinationsObj: {
//                     list: [
//                         [fireball[0], gridBallPicks[1], gridBallPicks[2]].join(''),
//                         [gridBallPicks[0], fireball[0], gridBallPicks[2]].join(''),
//                         [gridBallPicks[0], gridBallPicks[1], fireball[0]].join('')
//                     ]
//                 },
//                 sumAllThreeNums: gridBallPicks[0] + gridBallPicks[1] + gridBallPicks[2],
//                 evenOdd: evenOddCheck.join(','),
//                 firstTwoNumsObj: {
//                     firstTwoNumsString: gridBallPicks.slice(0, 2).join(','),
//                     firstTwoNumsSum: gridBallPicks[0] + gridBallPicks[1],
//                     firstTwoEvenOdd: evenOddCheckFirstTwo.join(',')
//                 },
//                 lastTwoNumsObj: {
//                     lastTwoNumsString: gridBallPicks.slice(-2).join(','),
//                     lastTwoNumsSum: gridBallPicks[1] + gridBallPicks[2],
//                     lastTwoEvenOdd: evenOddCheckLastTwo.join(',')
//                 },
//                 firstAndLastNumsObj: {
//                     firstAndLastNumsString: [gridBallPicks[0], gridBallPicks[gridBallPicks.length - 1]].join(','),
//                     firstAndLastNumsSum: gridBallPicks[0] + gridBallPicks[2],
//                     firstTwoEvenOdd: evenOddCheckFirstAndLast.join(',')
//                 },
//                 lowHighEqual: letter.join(''),
//                 fullNumsString: gridBallPicks.join(''),
//                 timestamp: admin.firestore.Timestamp.now()
//             };
//             await admin.firestore().collection('picks').add(result);
//             return false;
//
//         }
//     });
//     return null;
// });


exports.getOne = functionsFirebase.pubsub.schedule('0 13,23 * * *').timeZone('America/Chicago').onRun(async context => {
    let today = new Date();
    let options = {
        timeZone: 'America/Chicago',
        year: "numeric", month: "short", day: "numeric"
    };
    let todayFormatted = new Intl.DateTimeFormat('en-US', options).format(today);


    const ll = await axios.get("https://www.illinoislottery.com/dbg/results/pick3");
    const $ = cheerio.load(ll.data);

    const divsWithClassDfs = $('.results__list-item');
    const firstElement = divsWithClassDfs.eq(0);
    const secondElement = divsWithClassDfs.eq(1);
    const drawMonthText = firstElement.find('.dbg-results__date-info');
    const drawMonthTextSecond = firstElement.find('.dbg-results__date-info');
    const middayOrEvening = firstElement.find('.dbg-results__draw-info');
    const fireball = firstElement.find(".grid-ball--pick3-secondary")
                .map((pickIndex, pickElement) => {
                    let xx = $(pickElement).text()
                    return parseInt(xx.replace(/[^0-9]/g, ""));
                })
                .get()
    let gridBallPicks = firstElement.find(".grid-ball--pick3-primary")
        .map((pickIndex, pickElement) => {
            let xx = $(pickElement).text()
            return parseInt(xx.replace(/[^0-9]/g, ""));
        })
        .get()

    let second = secondElement.find(".grid-ball--pick3-primary")
        .map((pickIndex, pickElement) => {
            let xx = $(pickElement).text()
            return parseInt(xx.replace(/[^0-9]/g, ""));
        })
        .get()

    const subtractArrays = (arrayOne, arrayTwo) => {
        let resultArray = [];
        for (let i = 0; i < arrayOne.length; i++) {
            resultArray.push(arrayOne[i] - arrayTwo[i]);
        }
        return resultArray;
    };


    const evenOddCheck = gridBallPicks.map(num => {
        return num % 2 === 0 ? 'even' : 'odd'
    })

    const evenOddCheckFirstTwo = gridBallPicks.slice(0, 2).map(num => {
        return num % 2 === 0 ? 'even' : 'odd'
    })

    const evenOddCheckLastTwo = gridBallPicks.slice(-2).map(num => {
        return num % 2 === 0 ? 'even' : 'odd'
    })

    let firstAndLastArr = [gridBallPicks[0], gridBallPicks[2]]
    const evenOddCheckFirstAndLast = firstAndLastArr.map(num => {
        return num % 2 === 0 ? 'even' : 'odd'
    })

    let letter = [];

    for (let i = 0; i < gridBallPicks.length - 1; i++) {
        if (gridBallPicks[i] > gridBallPicks[i + 1]) {
            letter.push("L");
        }
        if (gridBallPicks[i] === gridBallPicks[i + 1]) {
            letter.push("E");
        }
        if (gridBallPicks[i] < gridBallPicks[i + 1]) {
            letter.push("H");
        }
    }

    let r = parseInt(drawMonthText.text().match(/\d+/)?.[0])
    let y = middayOrEvening.text().replace(/[^a-zA-Z]+/g, "")
    if(y==='midday'){
        r = r * 2
    }else {
        r = (r * 2) + 1
    }

    const result = {
        numbers: [...gridBallPicks],
        drawDate: todayFormatted,
        drawMonth: drawMonthText.text().substring(0, 3),
        index: r,
        time: middayOrEvening.text().replace(/[^a-zA-Z]+/g, ""),
        fireball: fireball[0],
        winningCombinationsObj: {
            list: [
                [fireball[0], gridBallPicks[1], gridBallPicks[2]].join(''),
                [gridBallPicks[0], fireball[0], gridBallPicks[2]].join(''),
                [gridBallPicks[0], gridBallPicks[1], fireball[0]].join('')
            ]
        },
        sumAllThreeNums: gridBallPicks[0] + gridBallPicks[1] + gridBallPicks[2],
        evenOdd: evenOddCheck.join(','),
        firstTwoNumsObj: {
            firstTwoNumsString: gridBallPicks.slice(0, 2).join(''),
            firstTwoNumsSum: gridBallPicks[0] + gridBallPicks[1],
            firstTwoEvenOdd: evenOddCheckFirstTwo.join('')
        },
        lastTwoNumsObj: {
            lastTwoNumsString: gridBallPicks.slice(-2).join(''),
            lastTwoNumsSum: gridBallPicks[1] + gridBallPicks[2],
            lastTwoEvenOdd: evenOddCheckLastTwo.join('')
        },
        firstAndLastNumsObj: {
            firstAndLastNumsString: [gridBallPicks[0], gridBallPicks[gridBallPicks.length - 1]].join(''),
            firstAndLastNumsSum: gridBallPicks[0] + gridBallPicks[2],
            firstTwoEvenOdd: evenOddCheckFirstAndLast.join(',')
        },
        previousDrawPlusNegative: {
            numbers: drawMonthText.text().substring(0, 3)===drawMonthTextSecond.text().substring(0, 3)?subtractArrays(gridBallPicks, second):null,
            numbersString: drawMonthText.text().substring(0, 3)===drawMonthTextSecond.text().substring(0, 3)?subtractArrays(gridBallPicks, second).join(''):null,
            numbersFirstTwoString: drawMonthText.text().substring(0, 3)===drawMonthTextSecond.text().substring(0, 3)?subtractArrays(gridBallPicks, second).slice(0, 2).join(''):null
        },
        previousDrawTwoNumDown:{
            first: [gridBallPicks[0], second[0]].join(''),
            second: [gridBallPicks[1], second[1]].join(''),
            third: [gridBallPicks[2], second[2]].join('')
        },
        lowHighEqual: letter.join(''),
        fullNumsString: gridBallPicks.join(''),
        timestamp: admin.firestore.Timestamp.now()
    };
    await admin.firestore().collection('picks').add(result);
    return null
});


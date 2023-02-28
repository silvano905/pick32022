const functionsFirebase = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const axios = require("axios");
const cheerio = require("cheerio");

const CurrentThreeSingle = require('./callableFunctions/CurrentThreeSingle');
const GetRandomThreeNumbers = require('./callableFunctions/GetRandomThreeNumbers');
const DrawSameDay = require('./callableFunctions/DrawSameDay');
const PreviousDrawPlusNegative = require('./callableFunctions/PreviousDrawPlusNegative');
const TotalPreviousDrawPlusNegative = require('./callableFunctions/TotalPreviousDrawPlusNegative');
const TotalPreviousDrawTwoNumDown = require('./callableFunctions/TotalPreviousDrawTwoNumDown');
const FirstTwoPreviousTen = require('./callableFunctions/FirstTwoPreviousTen');
const CheckIfRandomNumAppearsInPreviousComb = require('./callableFunctions/CheckIfRandomNumAppearsInPreviousComb');
const CheckSimilarWinningNumbers = require('./callableFunctions/CheckSimilarWinningNumbers');
const CheckSimilarAllThreeNumsSum = require('./callableFunctions/CheckSimilarAllThreeNumsSum');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started
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

exports.getGuesses = functionsFirebase.pubsub.schedule('5 10,20 * * *').timeZone('America/Chicago').onRun(async context => {    let newDate = new Date()
    const optionsM = {month: "short", timeZone: 'America/Chicago'};

    //delete previous objects in collection
    const collectionRef = admin.firestore().collection('guesses');
    const query = collectionRef
    const newDateThree = new Date()

    const batchOne = admin.firestore().batch();
    const snapshot = await query.get();

    snapshot.docs.forEach((doc) => {
        batchOne.delete(doc.ref);
    });

    await batchOne.commit();

    let month = new Intl.DateTimeFormat("en-US", optionsM).format(newDateThree);
    const drawsCollection = admin.firestore().collection('picks').where('drawMonth', '==', month).orderBy('timestamp', 'desc');
    if(drawsCollection){
        const snapshot = await drawsCollection.get();
        const draws = [];

        // Loop through the documents and add them to the array
        snapshot.forEach(doc => {
            draws.push(doc.data());
        });


        //to get past draw same day
        const xxCollection = admin.firestore().collection('picks')
            .where('index', '==', draws[0].index+1)
            .orderBy('timestamp', 'desc')
            .limit(1);

        const xxSnapshot = await xxCollection.get();
        const xxDoc = xxSnapshot.docs[0];
        //end

        const items = []
        let count = 0;
        while (count < 500) {
            let totalPoints = 0
            let dontAdd = false


            let tt = await CurrentThreeSingle(draws.slice(0, 3))
            let randomNumber = await GetRandomThreeNumbers(tt)



            let nn = await DrawSameDay(xxDoc.data(), randomNumber)
            totalPoints += nn.count
            if(!nn.pass){
                dontAdd = true
            }


            const [fullString, firstTwoString] = await PreviousDrawPlusNegative(draws.slice(0, 1), randomNumber)
            let xc = await TotalPreviousDrawPlusNegative(draws, fullString, firstTwoString)
            totalPoints += xc.firstTwo
            if(xc.full>=1){
                dontAdd = true
            }
            let pv = {
                first: [randomNumber.numbers[0], draws[0].numbers[0]].join(''),
                second: [randomNumber.numbers[1], draws[0].numbers[1]].join(''),
                third: [randomNumber.numbers[2], draws[0].numbers[2]].join('')
            }
            let sv = await TotalPreviousDrawTwoNumDown(draws, pv)
            let allSVSum = sv.one + sv.two + sv.three
            if(allSVSum>1){
                totalPoints += allSVSum
            }
            // totalPoints += sv.one
            // totalPoints += sv.two
            // totalPoints += sv.three


            let rt = await FirstTwoPreviousTen(draws.slice(0,10), randomNumber)
            totalPoints += rt

            let iu = await CheckIfRandomNumAppearsInPreviousComb(randomNumber.fullNumsString, draws.slice(0,20))
            totalPoints += iu

            let jg = await CheckSimilarWinningNumbers(randomNumber, draws)
            if(!jg){
                dontAdd = true
            }

            for (let i = 0; i < items.length; i++) {
                if (items[i].numbers[0] === randomNumber.numbers[0] && items[i].numbers[1] === randomNumber.numbers[1]) {
                    dontAdd = true;
                    break;
                }
            }

            for (let i = 0; i < items.length; i++) {
                if (items[i].numbers[1] === randomNumber.numbers[1] && items[i].numbers[2] === randomNumber.numbers[2]) {
                    dontAdd = true;
                    break;
                }
            }

            for (let i = 0; i < items.length; i++) {
                if (items[i].numbers[0] === randomNumber.numbers[0] && items[i].numbers[2] === randomNumber.numbers[2]) {
                    dontAdd = true;
                    break;
                }
            }

            let rd = await CheckSimilarAllThreeNumsSum(randomNumber, draws.slice(0,5))
            if(!rd){
                dontAdd = false
            }

            if(randomNumber.sumAllThreeNums<7||randomNumber.sumAllThreeNums>21){
                dontAdd = true
            }
            if(randomNumber.evenOdd===draws[0].evenOdd){
                dontAdd = true
            }
            if(items.some(obj => obj.fullNumsString === randomNumber.fullNumsString)){
                dontAdd = true
            }


            let countOne = 0;
            for (let i = 0; i < items.length; i++) {
                if (items[i].numbers[0] === randomNumber.numbers[0]) {
                    countOne++;
                }
            }
            if(countOne===2){
                dontAdd = true
            }

            let countTwo = 0;
            for (let i = 0; i < items.length; i++) {
                if (items[i].numbers[1] === randomNumber.numbers[1]) {
                    countTwo++;
                }
            }
            if(countTwo===2){
                dontAdd = true
            }

            let countThree = 0;
            for (let i = 0; i < items.length; i++) {
                if (items[i].numbers[2] === randomNumber.numbers[2]) {
                    countThree++;
                }
            }
            if(countThree===2){
                dontAdd = true
            }

            if(totalPoints<1&&!dontAdd){
                items.push(randomNumber);
            }
            count++;
        }
        const guessesCollection = admin.firestore().collection('guesses');
        const batch = admin.firestore().batch();

        // Loop through the array and add write operations to the batch
        items.forEach(numObj => {
            const docRef = guessesCollection.doc();
            batch.set(docRef, numObj);
        });

        // Commit the batch
        batch.commit().then(() => {
            console.log('Batch write succeeded');
        }).catch(error => {
            console.error('Batch write failed:', error);
        });

    }

    return null
})


exports.checkGuesses = functionsFirebase.pubsub.schedule('5 13,23 * * *').timeZone('America/Chicago').onRun(async context => {    const optionsM = {month: "short", timeZone: 'America/Chicago'};

    const newDateTwo = new Date()
    let month = new Intl.DateTimeFormat("en-US", optionsM).format(newDateTwo);


    const xxCollection = admin.firestore().collection('picks')
        .where('drawMonth', '==', month)
        .orderBy('timestamp', 'desc')
        .limit(1);

    const xxSnapshot = await xxCollection.get();
    const xxDoc = xxSnapshot.docs[0];


    const collectionRef = admin.firestore().collection('guesses');
    const query = collectionRef

    const snapshot = await query.get();

    for (const doc of snapshot.docs) {
        if(doc.data().fullNumsString===xxDoc.data().fullNumsString){
            let citiesRef = await admin.firestore().collection('guesses').doc(doc.id);
            await citiesRef.update({
                correctGuess: true
            })
        }
        if(xxDoc.data().winningCombinationsObj.list.includes(doc.data().fullNumsString)){
            let citiesRef = await admin.firestore().collection('guesses').doc(doc.id);
            await citiesRef.update({
                correctGuess: true
            })
        }
    }


    return null
})

exports.checkIfPass = functionsFirebase.pubsub.schedule('3 13,23 * * *').timeZone('America/Chicago').onRun(async context => {
    const newDateTwo = new Date()
    const optionsMM = {month: "short", timeZone: 'America/Chicago'};

    let month = new Intl.DateTimeFormat("en-US", optionsMM).format(newDateTwo);

    const drawsCollection = admin.firestore().collection('picks').where('drawMonth', '==', month).orderBy('timestamp', 'desc');
    const snapshot = await drawsCollection.get();
    const draws = [];
    const idPicks = []

    // Loop through the documents and add them to the array
    snapshot.forEach(doc=> {
        draws.push(doc.data());
        idPicks.push(doc.id)

    })

    const randomNumber = draws[1]

    const [fullString, firstTwoString] = await PreviousDrawPlusNegative(draws[2], randomNumber)
    let xc = await TotalPreviousDrawPlusNegative(draws, fullString, firstTwoString)
    let totalPoints = 0
    let dontAdd = false
    totalPoints += xc.firstTwo
    if(xc.full>=1){
        dontAdd = true
    }


    let pv = {
        first: [randomNumber.numbers[0], draws[2].numbers[0]].join(''),
        second: [randomNumber.numbers[1], draws[2].numbers[1]].join(''),
        third: [randomNumber.numbers[2], draws[2].numbers[2]].join('')
    }
    let sv = await TotalPreviousDrawTwoNumDown(draws.slice(2), pv)
    let allSVSum = sv.one + sv.two + sv.three
    if(allSVSum>1){
        totalPoints += allSVSum
    }


    let rt = await FirstTwoPreviousTen(draws.slice(2,12), randomNumber)
    totalPoints += rt

    let iu = await CheckIfRandomNumAppearsInPreviousComb(randomNumber.fullNumsString, draws.slice(2,22))
    totalPoints += iu


    let jg = await CheckSimilarWinningNumbers(randomNumber, draws.slice(2))
    if(!jg){
        dontAdd = true
    }


    let rd = await CheckSimilarAllThreeNumsSum(randomNumber, draws.slice(2,7))
    if(!rd){
        dontAdd = false
    }

    if(randomNumber.sumAllThreeNums<7||randomNumber.sumAllThreeNums>21){
        dontAdd = true
    }
    if(randomNumber.evenOdd===draws[2].evenOdd){
        dontAdd = true
    }

    let objRef = await admin.firestore().collection('picks').doc(idPicks[2]);
    await objRef.update({
        points: totalPoints,
        dontAdd: dontAdd
    })

    return false

});


import {collection, deleteDoc, doc, getDocs,
    limit, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {auth, db} from '../../config-firebase/firebase'

export async function CurrentThreeSingle(draws) {
    try {
        const list = [
            {
                number: 0,
                countFirst: 0,
                countSecond: 0,
                countThird: 0
            },
            {
                number: 1,
                countFirst: 0,
                countSecond: 0,
                countThird: 0
            },
            {
                number: 2,
                countFirst: 0,
                countSecond: 0,
                countThird: 0
            },
            {
                number: 3,
                countFirst: 0,
                countSecond: 0,
                countThird: 0
            },
            {
                number: 4,
                countFirst: 0,
                countSecond: 0,
                countThird: 0
            },
            {
                number: 5,
                countFirst: 0,
                countSecond: 0,
                countThird: 0
            },
            {
                number: 6,
                countFirst: 0,
                countSecond: 0,
                countThird: 0
            },
            {
                number: 7,
                countFirst: 0,
                countSecond: 0,
                countThird: 0
            },
            {
                number: 8,
                countFirst: 0,
                countSecond: 0,
                countThird: 0
            },
            {
                number: 9,
                countFirst: 0,
                countSecond: 0,
                countThird: 0
            }

        ]
        let newList = {
            first: [],
            second: [],
            third: []
        }

        for (const [key, value] of Object.entries(draws)) {
            list.forEach(function (arrayItem) {
                if(arrayItem.number===value.data.numbers[0]){
                    arrayItem.countFirst += 1
                }
                if(arrayItem.number===value.data.numbers[1]){
                    arrayItem.countSecond += 1
                }
                if(arrayItem.number===value.data.numbers[2]){
                    arrayItem.countThird += 1
                }
            })
        }

        list.forEach(function (arrayItem) {
            if(arrayItem.countFirst<2){
                newList.first.push(arrayItem.number)
            }
            if(arrayItem.countSecond<2){
                newList.second.push(arrayItem.number)
            }
            if(arrayItem.countThird<2){
                newList.third.push(arrayItem.number)
            }
        })

        return newList


    } catch (err) {
        return 'error'
    }

}

export async function DrawSameDay(draw, random) {
    try {
        let obj = {
            pass: true,
            count: 0
        }
        let pastDrawSameDay;
        let combRef = await collection(db, 'picks')
        let combQuery = await query(combRef, orderBy('timestamp', 'desc'), where("index", "==", draw[0].data.index+1), limit(1))
        await getDocs(combQuery).then(x=> {
            x.forEach((doc) => {
                pastDrawSameDay = doc.data()
            });
        })
        if(pastDrawSameDay.fullNumsString===random.fullNumsString){
            obj.pass = false
        }
        if(pastDrawSameDay.evenOdd===random.evenOdd){
            obj.count += 2
        }
        if(pastDrawSameDay.lowHighEqual===random.lowHighEqual){
            obj.count += 1
        }
        return obj

    }catch (e) {
        return 'error'
    }

}

export async function PreviousDrawPlusNegative(previousDraw, random){
    try {
        const subtractArrays = (arrayOne, arrayTwo) => {
            let resultArray = [];
            for (let i = 0; i < arrayOne.length; i++) {
                resultArray.push(arrayOne[i] - arrayTwo[i]);
            }
            return resultArray;
        };
        let fullString = subtractArrays(random.numbers, previousDraw[0].data.numbers).join('')
        let firstTwoString = subtractArrays(random.numbers, previousDraw[0].data.numbers).slice(0, 2).join('')
        return [fullString, firstTwoString]
    }catch (e) {
        return 'error'
    }
}

export async function GetRandomThreeNumbers(list){
    let result = {
        numbers: []
    };
    for (let listName in list) {
        let currentList = list[listName];
        let randomIndex = Math.floor(Math.random() * currentList.length);
        let randomNumber = currentList[randomIndex];
        result.numbers.push(randomNumber);
    }
    const evenOddCheck = result.numbers.map(num => {
        return num % 2 === 0 ? 'even' : 'odd'
    })
    result['evenOdd'] = evenOddCheck.join(',')

    let letter = [];

    for (let i = 0; i < result.numbers.length - 1; i++) {
        if (result.numbers[i] > result.numbers[i + 1]) {
            letter.push("L");
        }
        if (result.numbers[i] === result.numbers[i + 1]) {
            letter.push("E");
        }
        if (result.numbers[i] < result.numbers[i + 1]) {
            letter.push("H");
        }
    }
    result['lowHighEqual'] = letter.join('')

    result['fullNumsString'] = result.numbers.join('')

    const evenOddCheckFirstTwo = result.numbers.slice(0, 2).map(num => {
        return num % 2 === 0 ? 'even' : 'odd'
    })

    const evenOddCheckLastTwo = result.numbers.slice(-2).map(num => {
        return num % 2 === 0 ? 'even' : 'odd'
    })

    let firstAndLastArr = [result.numbers[0], result.numbers[2]]
    const evenOddCheckFirstAndLast = firstAndLastArr.map(num => {
        return num % 2 === 0 ? 'even' : 'odd'
    })
    result['firstTwoNumsObj'] = {
        firstTwoNumsString: result.numbers.slice(0, 2).join(''),
        firstTwoNumsSum: result.numbers[0] + result.numbers[1],
        firstTwoEvenOdd: evenOddCheckFirstTwo.join('')
    }

    result['lastTwoNumsObj'] = {
        lastTwoNumsString: result.numbers.slice(-2).join(''),
        lastTwoNumsSum: result.numbers[1] + result.numbers[2],
        lastTwoEvenOdd: evenOddCheckLastTwo.join('')
    }

    result['firstAndLastNumsObj'] = {
        firstAndLastNumsString: [result.numbers[0], result.numbers[result.numbers.length - 1]].join(''),
        firstAndLastNumsSum: result.numbers[0] + result.numbers[2],
        firstTwoEvenOdd: evenOddCheckFirstAndLast.join(',')
    }

    result['sumAllThreeNums'] = result.numbers[0]+result.numbers[1]+result.numbers[2]

    return result
}

export async function TotalPreviousDrawPlusNegative(list, objPreviousPlusNegativeFull, objPreviousPlusNegativeFirstTwo){
    let count = {
        full: 0,
        firstTwo: 0
    }
    list.forEach(function (arrayItem) {
        if(arrayItem.data.previousDrawPlusNegative.numbersString===objPreviousPlusNegativeFull){
            count.full += 1
        }
        if(arrayItem.data.previousDrawPlusNegative.numbersFirstTwoString===objPreviousPlusNegativeFirstTwo){
            count.firstTwo += 1
        }
    })
    return count
}

export async function TotalPreviousDrawTwoNumDown(list, obj){
    let count = {
        one: 0,
        two: 0,
        three: 0
    }
    list.forEach(function (arrayItem) {
        if(arrayItem.data.previousDrawTwoNumDown.first===obj.first){
            count.one += 1
        }
        if(arrayItem.data.previousDrawTwoNumDown.second===obj.second){
            count.two += 1
        }
        if(arrayItem.data.previousDrawTwoNumDown.third===obj.third){
            count.two += 1
        }
    })
    return count
}

export async function FirstTwoPreviousTen(list, obj){
    let count = 0
    list.forEach(function (arrayItem) {
        if(arrayItem.data.firstTwoNumsObj.firstTwoNumsSum===obj.firstTwoNumsObj.firstTwoNumsSum&&
            arrayItem.data.firstTwoNumsObj.firstTwoEvenOdd===obj.firstTwoNumsObj.firstTwoEvenOdd){
            count += 1
        }
        if(arrayItem.data.firstTwoNumsObj.firstTwoNumsString===obj.firstTwoNumsObj.firstTwoNumsString&&
            arrayItem.data.firstTwoNumsObj.firstTwoNumsSum===obj.firstTwoNumsObj.firstTwoNumsSum){
            count += 1
        }

        if(arrayItem.data.lastTwoNumsObj.lastTwoNumsSum===obj.lastTwoNumsObj.lastTwoNumsSum&&
            arrayItem.data.lastTwoNumsObj.lastTwoEvenOdd===obj.lastTwoNumsObj.lastTwoEvenOdd){
            count += 1
        }
        if(arrayItem.data.lastTwoNumsObj.lastTwoNumsString===obj.lastTwoNumsObj.lastTwoNumsString&&
            arrayItem.data.lastTwoNumsObj.lastTwoNumsSum===obj.lastTwoNumsObj.lastTwoNumsSum){
            count += 1
        }

        //I made a mistake for the firstAndLastNumbsObj / evenOdd - it should be firstAndLastEvenOdd instead of
        //firstTwoEvenOdd but ill change it later but for now just ignore the naming error
        if(arrayItem.data.firstAndLastNumsObj.firstAndLastNumsSum===obj.firstAndLastNumsObj.firstAndLastNumsSum&&
            arrayItem.data.firstAndLastNumsObj.firstTwoEvenOdd===obj.firstAndLastNumsObj.firstTwoEvenOdd){
            count += 1
        }
        if(arrayItem.data.firstAndLastNumsObj.firstAndLastNumsString===obj.firstAndLastNumsObj.firstAndLastNumsString&&
            arrayItem.data.firstAndLastNumsObj.firstAndLastNumsSum===obj.firstAndLastNumsObj.firstAndLastNumsSum){
            count += 1
        }

    })
    return count
}

export async function CheckIfRandomNumAppearsInPreviousComb(num, array){
    let count = 0;
    for (let i = 0; i < array.length; i++) {
        const list = array[i].data.winningCombinationsObj.list;
        for (let j = 0; j < list.length; j++) {
            if (list[j] === num) {
                count++;
            }
        }
    }
    return count;
}

export async function CheckSimilarWinningNumbers(num, array){
    let pass = true;
    for (let i = 0; i < array.length; i++) {
        if(array[i].data.fullNumsString===num.fullNumsString){
            pass = false
        }
    }
    return pass;
}

export async function CheckSimilarAllThreeNumsSum(num, array){
    let pass = true;
    for (let i = 0; i < array.length; i++) {
        if(array[i].data.sumAllThreeNums===num.sumAllThreeNums){
            pass = false
        }
    }
    return pass;
}
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {db} from "../../config-firebase/firebase";

export async function firstTwoSimilar(num, posts) {
    try {
        let finalCount = 0

        for (const [key, value] of Object.entries(posts)) {

            let firstTwo = value.data.firstTwo

            if (JSON.stringify(firstTwo) === JSON.stringify(num.slice(0,2))) {
                finalCount += 1
            }

        }

        return finalCount


    } catch (err) {
        return 'error'
    }

}

export async function lastTwoSimilar(num, posts) {
    try {
        let finalCount = 0

        for (const [key, value] of Object.entries(posts)) {

            let lastTwo = value.data.lastTwo


            if (JSON.stringify(lastTwo) === JSON.stringify(num.slice(1,3))) {
                finalCount += 1
            }
        }

        return finalCount

    } catch (err) {
        return 'error'
    }

}

export async function allSums(num, posts){
    let count = 0
    for (const [key, value] of Object.entries(posts)) {

        let sum = value.data.sum

        if(JSON.stringify(sum) === num){
            count += 1
        }
    }
    return count
}

export async function allPicksSimilarity(num, posts){
    let count = 0
    for (const [key, value] of Object.entries(posts)) {

        if(num.full === value.data.fullNum){
            count += 1
        }
    }
    return count
}

export async function allCombinations() {
    let list = []
    let popularLowHigh = ['l h ', 'l l ', 'l e ', 'h l ', 'h h ', 'h e ']
    for (let one = 0; one <= 9; one++) {
        for (let two = 0; two <= 9; two++) {
            for (let three = 0; three <= 9; three++) {
                let highLowList = '';

                let evenOrOddArr = '';
                if(one % 2 === 0) {
                    evenOrOddArr += 'even'+ ' '
                }else {
                    evenOrOddArr += 'odd'+ ' '
                }
                if(two % 2 === 0) {
                    evenOrOddArr += 'even'+ ' '
                }else {
                    evenOrOddArr += 'odd'+ ' '
                }
                if(three % 2 === 0) {
                    evenOrOddArr += 'even'+ ' '
                }else {
                    evenOrOddArr += 'odd'+ ' '
                }

                let sumOneTwoEvenOddString = ''
                if((one+two) % 2 === 0){
                    sumOneTwoEvenOddString += 'even' + ' '
                }else {
                    sumOneTwoEvenOddString += 'odd'+ ' '
                }
                if((two+three) % 2 === 0){
                    sumOneTwoEvenOddString += 'even' + ' '
                }else {
                    sumOneTwoEvenOddString += 'odd'+ ' '
                }


                let arr = [one,two,three]
                if(arr[0]>arr[1]){
                    highLowList += 'l '
                }
                if(arr[0]<arr[1]){
                    highLowList += 'h '
                }
                if(arr[0]===arr[1]){
                    highLowList += 'e '
                }

                if(arr[1]>arr[2]){
                    highLowList += 'l '
                }
                if(arr[1]<arr[2]){
                    highLowList += 'h '
                }
                if(arr[1]===arr[2]){
                    highLowList += 'e '
                }

                let total = one + two + three
                let obj = {
                    num: arr,
                    full: arr.join(''),
                    highLow: highLowList,
                    evenOdd: evenOrOddArr,
                    sumOneTwo: one+two,
                    sumTwoThree: two+three,
                    sumOneTwoThree: (one+two)+(two+three),
                    sumOneTwoThreeEvenOdd: sumOneTwoEvenOddString,
                    total: total
                }
                //original was 10-18
                //changed to 8-21
                if(total >= 5 && total <= 22 &&
                    popularLowHigh.includes(highLowList)){
                    list.push(obj)
                }
            }

        }

    }

    return list
}

export async function submittedNum(num) {
    let list = []
    let popularLowHigh = ['l h ', 'l l ', 'l e ', 'h l ', 'h h ', 'h e ']
    for (let one = 0; one <= 9; one++) {
        for (let two = 0; two <= 9; two++) {
            for (let three = 0; three <= 9; three++) {
                let highLowList = '';

                let evenOrOddArr = '';
                if(one % 2 === 0) {
                    evenOrOddArr += 'even'+ ' '
                }else {
                    evenOrOddArr += 'odd'+ ' '
                }
                if(two % 2 === 0) {
                    evenOrOddArr += 'even'+ ' '
                }else {
                    evenOrOddArr += 'odd'+ ' '
                }
                if(three % 2 === 0) {
                    evenOrOddArr += 'even'+ ' '
                }else {
                    evenOrOddArr += 'odd'+ ' '
                }

                let sumOneTwoEvenOddString = ''
                if((one+two) % 2 === 0){
                    sumOneTwoEvenOddString += 'even' + ' '
                }else {
                    sumOneTwoEvenOddString += 'odd'+ ' '
                }
                if((two+three) % 2 === 0){
                    sumOneTwoEvenOddString += 'even' + ' '
                }else {
                    sumOneTwoEvenOddString += 'odd'+ ' '
                }


                let arr = [one,two,three]
                if(arr[0]>arr[1]){
                    highLowList += 'l '
                }
                if(arr[0]<arr[1]){
                    highLowList += 'h '
                }
                if(arr[0]===arr[1]){
                    highLowList += 'e '
                }

                if(arr[1]>arr[2]){
                    highLowList += 'l '
                }
                if(arr[1]<arr[2]){
                    highLowList += 'h '
                }
                if(arr[1]===arr[2]){
                    highLowList += 'e '
                }

                let total = one + two + three
                let obj = {
                    num: arr,
                    full: arr.join(''),
                    highLow: highLowList,
                    evenOdd: evenOrOddArr,
                    sumOneTwo: one+two,
                    sumTwoThree: two+three,
                    sumOneTwoThree: (one+two)+(two+three),
                    sumOneTwoThreeEvenOdd: sumOneTwoEvenOddString,
                    total: total
                }
                //original was 10-18
                //changed to 8-21
                if(total >= 8 && total <= 18 &&
                    popularLowHigh.includes(highLowList)){
                    list.push(obj)
                }
            }

        }

    }
    return list
}

export async function firstLastSimilar(num, posts) {
    try {
        let finalCount = 0

        for (const [key, value] of Object.entries(posts)) {

            let first = value.data.one
            let three = value.data.three
            let finalNum = `[${first},${three}]`

            let secondFirst = num.slice(-3, -2);
            let secondLast = num.slice(-1)
            let secondFinalNum = `[${secondFirst},${secondLast}]`

            if (finalNum === secondFinalNum) {
                finalCount += 1
            }

        }

        return finalCount


    } catch (err) {
        return 'error'
    }

}

export async function lowHighUp(num, newest){
    let highLowList = ''
    let first = newest.data.fullNum
    let second = num

    if(first[0]>second[0]){
        highLowList += 'l '
    }
    if(first[0]<second[0]){
        highLowList += 'h '
    }
    if(first[0]===second[0]){
        highLowList += 'e '
    }

    if(first[1]>second[1]){
        highLowList += 'l '
    }
    if(first[1]<second[1]){
        highLowList += 'h '
    }
    if(first[1]===second[1]){
        highLowList += 'e '
    }

    if(first[2]>second[2]){
        highLowList += 'l '
    }
    if(first[2]<second[2]){
        highLowList += 'h '
    }
    if(first[2]===second[2]){
        highLowList += 'e '
    }

    return highLowList
}

export async function firstTwoSum(num, newestTwo){
    try {
        let count = 0

        for (const [key, value] of Object.entries(newestTwo)) {

            let totalSum = value.data.one + value.data.two

            if (totalSum === num[0]+num[1]) {
                count += 1
            }
        }

        return count
    } catch (err) {
        console.error(err.message);
    }
}

export async function firstTwoSumAndLastTwoSum(num, picks){
    try {
        let finalCount = 0
        let countFirstTwo = 0
        let countLastTwo = 0

        for (const [key, value] of Object.entries(picks)) {

            let one = value.data.sumOneTwo
            let two = value.data.sumTwoThree

            if (one === num.sumOneTwo) {
                countFirstTwo += 1
            }
            if (two === num.sumTwoThree) {
                countLastTwo += 1
            }
        }

        if(countLastTwo >2 && countFirstTwo >2){
            finalCount += 1
        }

        return finalCount
    } catch (err) {
        console.error(err.message);
    }
}

export async function lastTwoSum(num, newestTwo){
    try {
        let count = 0

        for (const [key, value] of Object.entries(newestTwo)) {

            let totalSum = value.data.two + value.data.three

            if (totalSum === num[1]+num[2]) {
                count += 1
            }
        }

        return count
    } catch (err) {
        console.error(err.message);
    }
}

export async function sumOneTwoAndTwoThreeSimilarity(num, picks){
    try {
        let count = 0

        for (const [key, value] of Object.entries(picks)) {

            let totalSum = value.data.sumOneTwo + '' + value.data.sumTwoThree
            let totalSumRandomNumber = num.sumOneTwo+ '' + num.sumTwoThree

            if (totalSum === totalSumRandomNumber) {
                count += 1
            }
        }

        return count
    } catch (err) {
        console.error(err.message);
    }
}


//section for previousComp
export async function previousCombEvenOdd(num, picks){
    try {
        let count = 0

        for (const [key, value] of Object.entries(picks)) {

            let one = value.data.previousComb?value.data.previousComb.evenOdd:null

            if (one === num.previousComb.evenOdd) {
                count += 1
            }
        }

        return count
    } catch (err) {
        console.error(err.message);
    }
}

export async function previousCombFirstTwo(num, picks){
    try {
        let count = 0

        for (const [key, value] of Object.entries(picks)) {

            let one = value.data.previousComb?value.data.previousComb.firstTwo:null

            if (one === num.previousComb.firstTwo) {
                count += 1
            }
        }

        return count
    } catch (err) {
        console.error(err.message);
    }
}

export async function previousCombLastTwo(num, picks){
    try {
        let count = 0

        for (const [key, value] of Object.entries(picks)) {

            let one = value.data.previousComb?value.data.previousComb.lastTwo:null

            if (one === num.previousComb.lastTwo) {
                count += 1
            }
        }

        return count
    } catch (err) {
        console.error(err.message);
    }
}


export async function previousCombSumFinal(num, picks){
    try {
        let count = 0

        for (const [key, value] of Object.entries(picks)) {

            if(value.data.previousComb){
                let one = value.data.previousComb.sumFinal
                if(one === num.previousComb.sumFinal){
                    count += 1
                }
            }

        }

        return count
    } catch (err) {
        console.error(err.message);
    }
}

export async function previousCombOneTwoThree(num, picks){
    try {
        let finalCount = 0
        let oneCount = 0
        let twoCount = 0
        let threeCount = 0


        for (const [key, value] of Object.entries(picks)) {

            let one = value.data.previousComb?value.data.previousComb.one:null
            let two = value.data.previousComb?value.data.previousComb.two:null
            let three = value.data.previousComb?value.data.previousComb.three:null

            if (one === num.previousComb.one){
                oneCount += 1
            }

            if (two === num.previousComb.two){
                twoCount += 1
            }

            if (three === num.previousComb.three){
                threeCount += 1
            }

        }
        if(oneCount>2&&twoCount>2&&threeCount>2){
            finalCount += 1
        }

        return finalCount
    } catch (err) {
        console.error(err.message);
    }
}

export async function previousCombTwo(num, picks){
    try {
        let count = 0

        for (const [key, value] of Object.entries(picks)) {

            let one = value.data.previousComb?value.data.previousComb.two:null

            if (one === num.previousComb.two) {
                count += 1
            }
        }

        return count
    } catch (err) {
        console.error(err.message);
    }
}

export async function previousCombThree(num, picks){
    try {
        let count = 0

        for (const [key, value] of Object.entries(picks)) {

            let one = value.data.previousComb?value.data.previousComb.three:null

            if (one === num.previousComb.three) {
                count += 1
            }
        }

        return count
    } catch (err) {
        console.error(err.message);
    }
}


export async function previousCombSumFirstTwoAndLastTwo(num, picks){
    try {
        let countFirstTwo = 0
        let countLastTwo = 0
        let finalCount = 0

        for (const [key, value] of Object.entries(picks)) {

            let firstTwo = value.data.previousComb?value.data.previousComb?.sumFirstTwo:null
            let lastTwo = value.data.previousComb?value.data.previousComb.sumLastTwo:null


            if (firstTwo === num.previousComb.sumFirstTwo) {
                countFirstTwo += 1
            }

            if (lastTwo === num.previousComb.sumLastTwo) {
                countLastTwo += 1
            }
        }
        if(countLastTwo>0&&countFirstTwo>0){
            finalCount = 1
        }

        return finalCount
    } catch (err) {
        console.error(err.message);
    }
}

export async function previousCombSumFirstTwoAndLastTwoString(num, picks){
    try {
        let count = 0

        for (const [key, value] of Object.entries(picks)) {

            let firstTwo = value.data.previousComb?value.data.previousComb?.sumFirstTwo:null
            let lastTwo = value.data.previousComb?value.data.previousComb.sumLastTwo:null

            let string = firstTwo + ''+ lastTwo
            let submittedNumString = num.previousComb.sumFirstTwo + ''+ num.previousComb.sumLastTwo


            if (string === submittedNumString) {
               count += 1
            }

        }

        return count
    } catch (err) {
        console.error(err.message);
    }
}

export async function previousCombAll(num, picks){
    try {
        let count = 0

        for (const [key, value] of Object.entries(picks)) {

            let one = value.data.previousComb?value.data.previousComb.all:null

            if (one === num.previousComb.all) {
                count += 1
            }

        }

        return count
    } catch (err) {
        console.error(err.message);
    }
}


// export async function lowHighThree(picks){
//     try {
//         let popularLowHighTree = [
//             {
//                 name: 'l l l ',
//                 count: 0
//             },
//             {
//                 name: 'l l h ',
//                 count: 0
//             },
//             {
//                 name: 'l h h ',
//                 count: 0
//             },
//             {
//                 name: 'l h l ',
//                 count: 0
//             },
//             {
//                 name: 'h h h ',
//                 count: 0
//             },
//             {
//                 name: 'h h l ',
//                 count: 0
//             },
//             {
//                 name: 'h l l ',
//                 count: 0
//             },
//             {
//                 name: 'h l h ',
//                 count: 0
//             }
//         ]
//
//         for (const [key, value] of Object.entries(picks)) {
//             // for (let x in popularLowHighTree) {
//             //     if(x.name===value.data.evenOdd){
//             //         x.count += 1
//             //     }
//             //
//             // }
//             popularLowHighTree.forEach(function (arrayItem) {
//                 if(arrayItem.name===value.data.evenOdd){
//                     arrayItem.count += 1
//                 }else {
//                     console.log(value.data.evenOdd)
//                     console.log(arrayItem.name)
//                 }
//             })
//         }
//         return popularLowHighTree
//
//
//     }catch (err) {
//         console.error(err.message)
//     }
// }
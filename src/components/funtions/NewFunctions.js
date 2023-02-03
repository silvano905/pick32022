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

export async function DrawSameDay(draws) {
    try {
        let index = 8
        let numFound;
        let combRef = await collection(db, 'picks')
        let combQuery = await query(combRef, orderBy('timestamp', 'desc'), where("index", "==", index), limit(1))
        await getDocs(combQuery).then(x=> {
            x.forEach((doc) => {
                numFound = doc.data()
            });
        })
        return numFound

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
    console.log(result);
}
async function GetRandomThreeNumbers(list){
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

    result['correctGuess'] = false

    result['sumAllThreeNums'] = result.numbers[0]+result.numbers[1]+result.numbers[2]

    return result
}

module.exports = GetRandomThreeNumbers
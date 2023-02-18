async function CurrentThreeSingle(draws) {
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
                if(arrayItem.number===value.numbers[0]){
                    arrayItem.countFirst += 1
                }
                if(arrayItem.number===value.numbers[1]){
                    arrayItem.countSecond += 1
                }
                if(arrayItem.number===value.numbers[2]){
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

module.exports = CurrentThreeSingle
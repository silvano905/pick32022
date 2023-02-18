async function PreviousDrawPlusNegative(previousDraw, random){
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

module.exports = PreviousDrawPlusNegative
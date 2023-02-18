async function FirstTwoPreviousTen(list, obj){
    let count = 0
    list.forEach(function (arrayItem) {
        if(arrayItem.firstTwoNumsObj.firstTwoNumsSum===obj.firstTwoNumsObj.firstTwoNumsSum&&
            arrayItem.firstTwoNumsObj.firstTwoEvenOdd===obj.firstTwoNumsObj.firstTwoEvenOdd){
            count += 1
        }
        if(arrayItem.firstTwoNumsObj.firstTwoNumsString===obj.firstTwoNumsObj.firstTwoNumsString&&
            arrayItem.firstTwoNumsObj.firstTwoNumsSum===obj.firstTwoNumsObj.firstTwoNumsSum){
            count += 1
        }

        if(arrayItem.lastTwoNumsObj.lastTwoNumsSum===obj.lastTwoNumsObj.lastTwoNumsSum&&
            arrayItem.lastTwoNumsObj.lastTwoEvenOdd===obj.lastTwoNumsObj.lastTwoEvenOdd){
            count += 1
        }
        if(arrayItem.lastTwoNumsObj.lastTwoNumsString===obj.lastTwoNumsObj.lastTwoNumsString&&
            arrayItem.lastTwoNumsObj.lastTwoNumsSum===obj.lastTwoNumsObj.lastTwoNumsSum){
            count += 1
        }

        //I made a mistake for the firstAndLastNumbsObj / evenOdd - it should be firstAndLastEvenOdd instead of
        //firstTwoEvenOdd but ill change it later but for now just ignore the naming error
        if(arrayItem.firstAndLastNumsObj.firstAndLastNumsSum===obj.firstAndLastNumsObj.firstAndLastNumsSum&&
            arrayItem.firstAndLastNumsObj.firstTwoEvenOdd===obj.firstAndLastNumsObj.firstTwoEvenOdd){
            count += 1
        }
        if(arrayItem.firstAndLastNumsObj.firstAndLastNumsString===obj.firstAndLastNumsObj.firstAndLastNumsString&&
            arrayItem.firstAndLastNumsObj.firstAndLastNumsSum===obj.firstAndLastNumsObj.firstAndLastNumsSum){
            count += 1
        }

    })
    return count
}

module.exports = FirstTwoPreviousTen
async function TotalPreviousDrawPlusNegative(list, objPreviousPlusNegativeFull, objPreviousPlusNegativeFirstTwo){
    let count = {
        full: 0,
        firstTwo: 0
    }
    list.forEach(function (arrayItem) {
        if(arrayItem.previousDrawPlusNegative.numbersString===objPreviousPlusNegativeFull){
            count.full += 1
        }
        if(arrayItem.previousDrawPlusNegative.numbersFirstTwoString===objPreviousPlusNegativeFirstTwo){
            count.firstTwo += 1
        }
    })
    return count
}

module.exports = TotalPreviousDrawPlusNegative
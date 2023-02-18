async function CheckSimilarWinningNumbers(num, array){
    let pass = true;
    for (let i = 0; i < array.length; i++) {
        if(array[i].fullNumsString===num.fullNumsString){
            pass = false
        }
    }
    return pass;
}

module.exports = CheckSimilarWinningNumbers
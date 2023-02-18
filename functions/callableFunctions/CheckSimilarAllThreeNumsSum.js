async function CheckSimilarAllThreeNumsSum(num, array){
    let pass = true;
    for (let i = 0; i < array.length; i++) {
        if(array[i].sumAllThreeNums===num.sumAllThreeNums){
            pass = false
        }
    }
    return pass;
}
module.exports = CheckSimilarAllThreeNumsSum
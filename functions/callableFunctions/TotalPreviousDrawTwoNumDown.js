async function TotalPreviousDrawTwoNumDown(list, obj){
    let count = {
        one: 0,
        two: 0,
        three: 0
    }
    list.forEach(function (arrayItem) {
        if(arrayItem.previousDrawTwoNumDown.first===obj.first){
            count.one += 1
        }
        if(arrayItem.previousDrawTwoNumDown.second===obj.second){
            count.two += 1
        }
        if(arrayItem.previousDrawTwoNumDown.third===obj.third){
            count.two += 1
        }
    })
    return count
}

module.exports = TotalPreviousDrawTwoNumDown
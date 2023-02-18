async function DrawSameDay(pastDrawSameDay, random) {
    try {
        let obj = {
            pass: true,
            count: 0
        }
        if(pastDrawSameDay.fullNumsString===random.fullNumsString){
            obj.pass = false
        }
        if(pastDrawSameDay.evenOdd===random.evenOdd){
            obj.count += 2
        }
        if(pastDrawSameDay.lowHighEqual===random.lowHighEqual){
            obj.count += 1
        }
        return obj

    }catch (e) {
        return 'error'
    }

}

module.exports = DrawSameDay
async function CheckIfRandomNumAppearsInPreviousComb(num, array){
    let count = 0;
    for (let i = 0; i < array.length; i++) {
        const list = array[i].winningCombinationsObj.list;
        for (let j = 0; j < list.length; j++) {
            if (list[j] === num) {
                count++;
            }
        }
    }
    return count;
}

module.exports = CheckIfRandomNumAppearsInPreviousComb
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {db} from "../../config-firebase/firebase";

export async function firstTwoSimilar(num, posts) {
    try {
        let finalCount = 0

        for (const [key, value] of Object.entries(posts)) {

            let firstTwo = value.data.firstTwo

            if (JSON.stringify(firstTwo) === JSON.stringify(num.slice(0,2))) {
                finalCount += 1
            }

        }

        return finalCount


    } catch (err) {
        return 'error'
    }

}

export async function lastTwoSimilar(num, posts) {
    try {
        let finalCount = 0

        for (const [key, value] of Object.entries(posts)) {

            let lastTwo = value.data.lastTwo


            if (JSON.stringify(lastTwo) === JSON.stringify(num.slice(1,3))) {
                finalCount += 1
            }
        }

        return finalCount

    } catch (err) {
        return 'error'
    }

}

export async function allSums(num, posts){
    let count = 0
    for (const [key, value] of Object.entries(posts)) {

        let sum = value.data.sum

        if(JSON.stringify(sum) === num){
            count += 1
        }
    }
    return count
}


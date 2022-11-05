import {db} from '../../config-firebase/firebase'
import {addDoc, collection, onSnapshot, orderBy, query, serverTimestamp,
    where, limit, getDocs, updateDoc, doc} from "firebase/firestore";
import {selectSum} from "../../redux/picks/picksSlice";
import {useDispatch, useSelector} from "react-redux";

export async function evenOddHistory(picks){
    try {
        let popularLowHighTree = [
            {
                name: 'even even even ',
                count: 0
            },
            {
                name: 'even even odd ',
                count: 0
            },
            {
                name: 'even odd odd ',
                count: 0
            },
            {
                name: 'even odd even ',
                count: 0
            },
            {
                name: 'odd odd odd ',
                count: 0
            },
            {
                name: 'odd even even ',
                count: 0
            },
            {
                name: 'odd odd even ',
                count: 0
            },
            {
                name: 'odd even odd ',
                count: 0
            }
        ]

        for (const [key, value] of Object.entries(picks)) {
            popularLowHighTree.forEach(function (arrayItem) {
                if(arrayItem.name===value.data.evenOdd){
                    arrayItem.count += 1
                }
            })
        }
        return popularLowHighTree


    }catch (err) {
        console.error(err.message)
    }
}

export async function sum(picks, currentSum){
    try {
        let list = [
            {
                num: 0,
                count: 0
            },
            {
                num: 1,
                count: 0
            },
            {
                num: 2,
                count: 0
            },
            {
                num: 3,
                count: 0
            },
            {
                num: 4,
                count: 0
            },
            {
                num: 5,
                count: 0
            },
            {
                num: 6,
                count: 0
            },
            {
                num: 7,
                count: 0
            },
            {
                num: 8,
                count: 0
            },
            {
                num: 9,
                count: 0
            },
            {
                num: 10,
                count: 0
            },
            {
                num: 11,
                count: 0
            },
            {
                num: 12,
                count: 0
            },
            {
                num: 13,
                count: 0
            },
            {
                num: 14,
                count: 0
            },
            {
                num: 15,
                count: 0
            },
            {
                num: 16,
                count: 0
            },
            {
                num: 17,
                count: 0
            },
            {
                num: 18,
                count: 0
            },
            {
                num: 19,
                count: 0
            },
            {
                num: 20,
                count: 0
            }

        ]

        for (const [key, value] of Object.entries(picks)) {
            list.forEach(function (arrayItem) {
                if(arrayItem.num===value.data.sum){
                    arrayItem.count += 1
                }
            })
        }
        // return list
        if(currentSum){
            updateDoc(doc(db, 'sum', currentSum.id), {
                arr: list
            }).then()
        }else {
            let today = new Date();
            let month = today.toLocaleString('default', { month: 'long' });
            addDoc(collection(db, "sum"), {
                month: month,
                arr: list,
                timestamp: serverTimestamp()
            }).then()
        }



    }catch (err) {
        console.error(err.message)
    }
}

export async function sumPair(picks, currentSumPair){
    try {
        let list = [
            {
                num: 5,
                countOneTwo: 0,
                countTwoThree: 0
            },
            {
                num: 6,
                countOneTwo: 0,
                countTwoThree: 0
            },
            {
                num: 7,
                countOneTwo: 0,
                countTwoThree: 0
            },
            {
                num: 8,
                countOneTwo: 0,
                countTwoThree: 0
            },
            {
                num: 9,
                countOneTwo: 0,
                countTwoThree: 0
            },
            {
                num: 10,
                countOneTwo: 0,
                countTwoThree: 0
            },
            {
                num: 11,
                countOneTwo: 0,
                countTwoThree: 0
            },
            {
                num: 12,
                countOneTwo: 0,
                countTwoThree: 0
            },
            {
                num: 13,
                countOneTwo: 0,
                countTwoThree: 0
            },
            {
                num: 14,
                countOneTwo: 0,
                countTwoThree: 0
            },
            {
                num: 15,
                countOneTwo: 0,
                countTwoThree: 0
            },
            {
                num: 16,
                countOneTwo: 0,
                countTwoThree: 0
            },
            {
                num: 17,
                countOneTwo: 0,
                countTwoThree: 0
            },
            {
                num: 18,
                countOneTwo: 0,
                countTwoThree: 0
            },
            {
                num: 19,
                countOneTwo: 0,
                countTwoThree: 0
            },
        ]

        for (const [key, value] of Object.entries(picks)) {
            list.forEach(function (arrayItem) {
                if(arrayItem.num===value.data.sumOneTwo){
                    arrayItem.countOneTwo += 1
                }
                if(arrayItem.num===value.data.sumTwoThree){
                    arrayItem.countTwoThree += 1
                }
            })
        }

        // return list
        if(currentSumPair){
            updateDoc(doc(db, 'sumPair', currentSumPair.id), {
                arr: list
            }).then()
        }else {
            let today = new Date();
            let month = today.toLocaleString('default', { month: 'long' });
            addDoc(collection(db, "sumPair"), {
                month: month,
                arr: list,
                timestamp: serverTimestamp()
            }).then()
        }


    }catch (err) {
        console.error(err.message)
    }
}

export async function sumOneTwoThree(picks, currentSumOneTwoThree){
    try {
        let list = [
            {
                num: 7,
                count: 0
            },
            {
                num: 8,
                count: 0
            },
            {
                num: 9,
                count: 0
            },
            {
                num: 10,
                count: 0
            },
            {
                num: 11,
                count: 0
            },
            {
                num: 12,
                count: 0
            },
            {
                num: 13,
                count: 0
            },
            {
                num: 14,
                count: 0
            },
            {
                num: 15,
                count: 0
            },
            {
                num: 16,
                count: 0
            },
            {
                num: 17,
                count: 0
            },
            {
                num: 18,
                count: 0
            },
            {
                num: 19,
                count: 0
            },
            {
                num: 20,
                count: 0
            },
            {
                num: 21,
                count: 0
            },
            {
                num: 22,
                count: 0
            },
            {
                num: 23,
                count: 0
            },
            {
                num: 24,
                count: 0
            },

        ]

        for (const [key, value] of Object.entries(picks)) {
            list.forEach(function (arrayItem) {
                if(arrayItem.num===value.data.sumOneTwoThreeNum){
                    arrayItem.count += 1
                }
            })
        }
        // return list
        if(currentSumOneTwoThree){
            updateDoc(doc(db, 'sumOneTwoThree', currentSumOneTwoThree.id), {
                arr: list
            }).then()
        }else {
            let today = new Date();
            let month = today.toLocaleString('default', { month: 'long' });
            addDoc(collection(db, "sumOneTwoThree"), {
                month: month,
                arr: list,
                timestamp: serverTimestamp()
            }).then()
        }


    }catch (err) {
        console.error(err.message)
    }
}
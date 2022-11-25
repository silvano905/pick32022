import {useDispatch, useSelector} from "react-redux";
import React, {Fragment, useEffect, useState} from "react";
import {
    allCombinations,
    allSums, firstLastSimilar, firstTwoSimilar,
    lastTwoSimilar, lowHighUp, sumOneTwoAndTwoThreeSimilarity,
    previousCombEvenOdd, previousCombLastTwo, previousCombFirstTwo,
    previousCombSumFinal, previousCombOneTwoThree, allPicksSimilarity,
    previousCombSumFirstTwoAndLastTwo, previousCombSumFirstTwoAndLastTwoString,
    previousCombAll, firstTwoSumAndLastTwoSum
} from "../funtions/Main";
import {selectAllPicks, selectCombinations, selectPicks} from "../../redux/picks/picksSlice";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: theme.palette.text.secondary,
    marginBottom: 10,
    background: '#fdfffc',
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
}));

const CheckNumbersThirdEngine = () => {
    const picks = useSelector(selectPicks)
    const allPicks = useSelector(selectAllPicks)
    const allCombinations = useSelector(selectCombinations)
    const [foundChecker, setFoundChecker] = useState({});

    const runEngine = async (submittedNum) => {
        if(submittedNum&&submittedNum.full){
            setFoundChecker({})
            //checking all possible winning combinations
            let fireballNumbers = [0,1,2,3,4,5,6,7,8,9]
            for( let i = 0; i < fireballNumbers.length; i++){

                if ( fireballNumbers[i] === parseInt(fireball)) {

                    fireballNumbers.splice(i, 1);
                }

            }

            let xx = submittedNum.num
            let sex = []

            for (const x of fireballNumbers) {
                let one = xx[0]
                let two = xx[1]
                let three = xx[2]
                let finalOne = [x,two,three]
                let finalTwo = [one,x,three]
                let finalThree = [one,two,x]

                sex.push(finalOne.join(''))
                sex.push(finalTwo.join(''))
                sex.push(finalThree.join(''))

            }

            let totalBad = 0
            let totalSimilar = 0
            let totalFound = 0
            for (const numbers of sex) {
                let found = allCombinations.data.arr.find(element => element.full === numbers);
                if(found){
                    totalFound += 1
                    let one = await firstTwoSimilar(found.full, picks.slice(0, 5))
                    if(one>=1){
                        totalBad += 1
                        // runWhile = true
                    }

                    //last two numbers can not be similar to previous last two numbers [x,(x,x)]
                    let two = await lastTwoSimilar(found.full, picks.slice(0,5))
                    if(two>=1){
                        totalBad += 1
                        // console.log('run again lastTwoSimilar')
                        // runWhile = true

                    }

                    let checkAllSimilarity = await allPicksSimilarity(found, allPicks)
                    if(checkAllSimilarity>=1){
                        totalSimilar += 1
                        // console.log('run again lastTwoSimilar')
                        // runWhile = true

                    }


                    //the current sum of the 3 numbers can not be similar to previous sums of winning number
                    //ex 4, 2, 8 (4 + 2 + 8 = 14) | 14 is the current sum
                    let three = await allSums(found.total, picks.slice(0,1))
                    if(three>=1){
                        totalBad += 1
                        // console.log('run again allSums')
                        // runWhile = true

                    }


                    //first and last number can not be similar to first and last previous numbers of winning numbers
                    let four = await firstLastSimilar(found.full, picks.slice(0, 5))
                    if(four>=1){
                        totalBad += 1
                        // console.log('run again firstLastSimilar')
                        // runWhile = true

                    }


                    //the random combination number (evenOdd) can not be similar to the most recent winning number (evenOdd)
                    //ex 2, 4, 3 (2 is even, 4 is even and 3 is odd | = even, even, odd
                    if(found.evenOdd===picks[0].data.evenOdd){
                        totalBad += 1
                        // console.log('run again evenOdd')
                        // runWhile = true

                    }

                    // first numbers sum compare to the two newest winning numbers
                    // ex 3, 5, 2 (3 + 5 = 8) | 8 is first two sum
                    // ex 3, 5, 2 (5 + 2 = 7) | 7 is last two sum
                    // firstTwoSum(submittedNum.num, picks.slice(0,2)).then(x=>x>=1&&similaritiesFunc('similar firstTwoSum'))
                    // lastTwoSum(submittedNum.num, picks.slice(0,2)).then(x=>x>=1&&similaritiesFunc('similar lastTwoSum'))
                    let five = await firstTwoSumAndLastTwoSum(found, picks.slice(0, 5))
                    if(five>=1){
                        totalBad += 1
                        // console.log('run again firstTwoSumAndLastTwoSum')
                        // runWhile = true

                    }


                    //ex 3, 5, 7 (8,12 = 20) => 20 is sumOneTwoAndTwoThreeSimilarity
                    let six = await sumOneTwoAndTwoThreeSimilarity({sumOneTwo: found.sumOneTwo, sumTwoThree: found.sumTwoThree},
                        picks.slice(0,5))
                    if(six>=1){
                        totalBad += 1
                        // console.log('run again sumOneTwoAndTwoThreeSimilarity')
                        // runWhile = true

                    }


                }

            }
            setFoundChecker({
                totalFound: totalFound,
                totalBad: totalBad,
                totalSimilar: totalSimilar
            })
            console.log(`${totalBad}--${totalSimilar}---${submittedNum.full}----totalFound=${totalFound}`)


            if(submittedNum.total<5){
                similaritiesFunc('combination not in range 8-21')
            }
            if(submittedNum.total>=22){
                similaritiesFunc('combination not in range 8-21')
            }

            //first two numbers can not be similar to previous first two numbers [(x,x),x]
            firstTwoSimilar(submittedNum.full, picks.slice(0, 5)).then(x=>x>=1&&similaritiesFunc('firstTwoSimilar'))

            //last two numbers can not be similar to previous last two numbers [x,(x,x)]
            lastTwoSimilar(submittedNum.full, picks.slice(0,5)).then(x=>x>=1&&similaritiesFunc('lastTwoSimilar'))

            //the current sum of the 3 numbers can not be similar to previous sums of winning numbers
            //ex 4, 2, 8 (4 + 2 + 8 = 14) | 14 is the current sum
            allSums(submittedNum.total, picks).then(x=>x>=1&&similaritiesFunc('similar sum'))

            //first and last number can not be similar to first and last previous numbers of winning numbers
            firstLastSimilar(submittedNum.full, picks.slice(0, 5)).then(x=>x>=1&&similaritiesFunc('first and last similar'))

            allPicksSimilarity(submittedNum.full,allPicks).then(x=>x>=1&&similaritiesFunc('similar combination 60'))

            //the random number has to be included in the popularLowHigUp list
            // lowHighUp(submittedNum.full, picks[0]).then(x=>{
            //     let popularLowHighUp = [ 'l l l ', 'l l h ', 'l h h ', 'l h l ', 'h h h ', 'h h l ', 'h l l ', 'h l h ' ]
            //     if(!popularLowHighUp.includes(x)){
            //         similaritiesFunc('not in popular LowHighUp (l h h )')
            //     }
            // })

            //the random combination number (evenOdd) can not be similar to the most recent winning number (evenOdd)
            //ex 2, 4, 3 (2 is even, 4 is even and 3 is odd | = even, even, odd
            if(submittedNum.evenOdd===picks[0].data.evenOdd){
                similaritiesFunc('similar evenOdd to the newest winning number')
            }

            //TODO
            //ex 4, 7, 2 (4 + 7 = 11 and 7 + 2 = 9 | final result is 11,9 | 11 is odd and 9 is odd | 'odd odd'
            // if(submittedNum.sumOneTwoThreeEvenOdd===picks[0].data.sumOneTwoThreeEvenOdd){
            //     similaritiesFunc('similar sumOneTwoThreeEvenOdd')
            // }

            //first numbers sum compare to the two newest winning numbers
            //ex 3, 5, 2 (3 + 5 = 8) | 8 is first two sum
            //ex 3, 5, 2 (5 + 2 = 7) | 7 is last two sum
            // firstTwoSum(submittedNum.num, picks.slice(0,2)).then(x=>x>=1&&similaritiesFunc('similar firstTwoSum'))
            // lastTwoSum(submittedNum.num, picks.slice(0,2)).then(x=>x>=1&&similaritiesFunc('similar lastTwoSum'))

            //TODO
            //changed from 20 to 10
            firstTwoSumAndLastTwoSum(submittedNum, picks.slice(0, 5)).then(x=>x>=1&&similaritiesFunc('similar firstTwoAndLastTwoSum'))

            //ex 3, 5, 7 (8,12 = 20) => 20 is sumOneTwoAndTwoThreeSimilarity
            sumOneTwoAndTwoThreeSimilarity({sumOneTwo: submittedNum.sumOneTwo, sumTwoThree: submittedNum.sumTwoThree},
                picks.slice(0,5)).then(x=>x>=1&&similaritiesFunc('similar sumOneTwoAndTwoThreeSimilarity'))
        }
        console.log(submittedNum)


    }


    const [formData, setFormData] = useState({
        one: '',
        two: '',
        three: '',
        fireball: ''
    });
    const [similarities, setSimilarities] = useState([]);
    const [numbers, setNumbers] = useState('');
    const { one, two, three, fireball } = formData;
    let list = [0,1,2,3,4,5,6,7,8,9]
    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    const similaritiesFunc = (msg) => {
        setSimilarities(current => [...current, msg]);
    }


    let sp;
    if(similarities){
        sp = similarities.map(item => {
            return (
                <div>
                    <p>{item}</p>
                </div>
            )
        })
    }

    const checkNum = (e) => {
        e.preventDefault()
        setSimilarities([])
        setNumbers(`${one}, ${two}, ${three}`)

        let highLowList = '';

        let evenOrOddArr = '';
        if(one % 2 === 0) {
            evenOrOddArr += 'even'+ ' '
        }else {
            evenOrOddArr += 'odd'+ ' '
        }
        if(two % 2 === 0) {
            evenOrOddArr += 'even'+ ' '
        }else {
            evenOrOddArr += 'odd'+ ' '
        }
        if(three % 2 === 0) {
            evenOrOddArr += 'even'+ ' '
        }else {
            evenOrOddArr += 'odd'+ ' '
        }

        let sumOneTwoEvenOddString = ''
        if((one+two) % 2 === 0){
            sumOneTwoEvenOddString += 'even' + ' '
        }else {
            sumOneTwoEvenOddString += 'odd'+ ' '
        }
        if((two+three) % 2 === 0){
            sumOneTwoEvenOddString += 'even' + ' '
        }else {
            sumOneTwoEvenOddString += 'odd'+ ' '
        }


        let arr = [one,two,three]
        if(arr[0]>arr[1]){
            highLowList += 'l '
        }
        if(arr[0]<arr[1]){
            highLowList += 'h '
        }
        if(arr[0]===arr[1]){
            highLowList += 'e '
        }

        if(arr[1]>arr[2]){
            highLowList += 'l '
        }
        if(arr[1]<arr[2]){
            highLowList += 'h '
        }
        if(arr[1]===arr[2]){
            highLowList += 'e '
        }

        let previousEvenOrOddArr
        if(picks&&picks[0]) {
            previousEvenOrOddArr = '';
            if ((picks[0].data.one + one) % 2 === 0) {
                previousEvenOrOddArr += 'even' + ' '
            } else {
                previousEvenOrOddArr += 'odd' + ' '
            }
            if ((picks[0].data.two + two) % 2 === 0) {
                previousEvenOrOddArr += 'even' + ' '
            } else {
                previousEvenOrOddArr += 'odd' + ' '
            }
            if ((picks[0].data.three + three) % 2 === 0) {
                previousEvenOrOddArr += 'even' + ' '
            } else {
                previousEvenOrOddArr += 'odd' + ' '
            }
        }

        let total = one + two + three
        let obj = {
            num: arr,
            full: arr.join(''),
            highLow: highLowList,
            evenOdd: evenOrOddArr,
            sumOneTwo: one+two,
            sumTwoThree: two+three,
            sumOneTwoThree: (one+two)+(two+three),
            sumOneTwoThreeEvenOdd: sumOneTwoEvenOddString,
            previousComb:{
                evenOdd: previousEvenOrOddArr,
                firstTwo: (picks[0].data.one + one) + ''+(picks[0].data.two + two),
                lastTwo: (picks[0].data.two + two) + ''+(picks[0].data.three + three),
                sumFinal: (picks[0].data.one + one) + (picks[0].data.two + two) + (picks[0].data.three + three),
                one: picks[0].data.one + one,
                two: picks[0].data.two + two,
                three: picks[0].data.three + three,
                sumFirstTwo: (picks[0].data.one + one)+(picks[0].data.two + two),
                sumLastTwo: (picks[0].data.two + two) + (picks[0].data.three + three),
                all: (picks[0].data.one + one) + ''+(picks[0].data.two + two) + ''+ (picks[0].data.three + three)

            },
            total: total,
            fireball: fireball
        }
        runEngine(obj)
        setFormData({one: '', two: '', three: '', fireball: ''})

    }
    return(
        <Grid item xs={11} sm={11} lg={12}>
            <Item elevation={4}>
                <Typography variant="h5" gutterBottom style={{color: 'black', marginTop: 10}}>
                    Check Numbers
                </Typography>
                <Typography variant="h5" gutterBottom style={{color: 'black', marginTop: 10}}>
                    {numbers}
                </Typography>
                {foundChecker.totalFound&&
                    <>
                        <Typography variant="h6" gutterBottom style={{color: 'blue', marginTop: 10}}>
                            similarFound: {foundChecker.totalSimilar}
                        </Typography>
                        <Typography variant="h6" gutterBottom style={{color: 'blue', marginTop: 10}}>
                            totalFound: {foundChecker.totalFound}
                        </Typography>
                        <Typography variant="h6" gutterBottom style={{color: 'blue', marginTop: 10}}>
                            totalBad: {foundChecker.totalBad}
                        </Typography>
                    </>

                }
                <>
                    {sp}
                </>
                <form onSubmit={checkNum} style={{marginTop: 10}}>
                    <Grid container spacing={2} justifyContent="center">


                        <Grid item sm={11} lg={7} xs={11}>
                            <FormControl style={{width: 200}}>
                                <InputLabel id="demo-simple-select-label">One</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={one}
                                    label="One"
                                    name='one'
                                    required
                                    onChange={onChange}
                                >
                                    {list.map(item => {
                                        return (
                                            <MenuItem value={item}>
                                                {item}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item sm={11} lg={7} xs={11}>
                            <FormControl style={{width: 200}}>
                                <InputLabel id="demo-simple-select-label">Two</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={two}
                                    label="Two"
                                    name='two'
                                    required
                                    onChange={onChange}
                                >
                                    {list.map(item => {
                                        return (
                                            <MenuItem value={item}>
                                                {item}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item sm={11} lg={7} xs={11}>
                            <FormControl style={{width: 200}}>
                                <InputLabel id="demo-simple-select-label">Three</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={three}
                                    label="Three"
                                    name='three'
                                    required
                                    onChange={onChange}
                                >
                                    {list.map(item => {
                                        return (
                                            <MenuItem value={item}>
                                                {item}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item sm={11} lg={7} xs={11}>
                            <FormControl style={{width: 200}}>
                                <InputLabel id="demo-simple-select-label">Fireball</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={fireball}
                                    label="Fireball"
                                    name='fireball'
                                    required
                                    onChange={onChange}
                                >
                                    {list.map(item => {
                                        return (
                                            <MenuItem value={item}>
                                                {item}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>


                        <Grid item sm={9} lg={8} xs={9}>
                            <Button style={{margin: 10}} type="submit" variant="contained" color="primary">check</Button>
                        </Grid>


                    </Grid>
                </form>
            </Item>
        </Grid>
    )

}
export default CheckNumbersThirdEngine;
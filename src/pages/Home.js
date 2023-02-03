import React, {useState, useEffect} from 'react';
import { useLocation } from "react-router-dom";

import {
    collection, addDoc, doc,
    query, orderBy, serverTimestamp, limit,
    onSnapshot, getDocs, where, deleteDoc
} from "firebase/firestore";
import {db} from '../config-firebase/firebase'
import {getPicks, selectPicks, selectSum,
    getSum, getSumPair, selectSumPair, selectSumOneTwoThree, getSumOneTwoThree, getCombinations, selectCombinations} from "../redux/picks/picksSlice";
import Spinner from "../components/spinner/Spinner";
import Grid from "@mui/material/Grid";
import {useDispatch, useSelector} from "react-redux";
import {
    firstTwoSimilar,
    lastTwoSimilar,
    allSums,
    allCombinations,
    firstLastSimilar,
    lowHighUp,
    firstTwoSum,
    lastTwoSum,
    sumOneTwoAndTwoThreeSimilarity,
    firstTwoSumAndLastTwoSum,
    previousCombEvenOdd,
    previousCombFirstTwo,
    previousCombLastTwo,
    previousCombSumFinal,
    previousCombOneTwoThree,
    previousCombSumFirstTwoAndLastTwo, previousCombSumFirstTwoAndLastTwoString, previousCombAll
} from "../components/funtions/Main";
import {sum, evenOddHistory, sumPair, sumOneTwoThree} from "../components/funtions/History"
import CreatePost from "./CreatePost";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CheckNumbers from "../components/checkNumbers/CheckNumbers";
import {selectUser} from "../redux/user/userSlice";
import {styled} from "@mui/material/styles";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Divider from '@mui/material/Divider';
import Paper from "@mui/material/Paper";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
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

function Home() {
    const dispatch = useDispatch()
    const picks = useSelector(selectPicks)
    const currentSum = useSelector(selectSum)
    const currentSumPair = useSelector(selectSumPair)
    const currentSumOneTwoThree = useSelector(selectSumOneTwoThree)
    const allCombinations = useSelector(selectCombinations)

    useEffect(() => {
        let today = new Date();
        // let month = today.toLocaleString('default', { month: 'long' });
        let month = 'November'

        let quinielasRef = collection(db, 'posts')
        let quinielasQuery = query(quinielasRef, orderBy('timestamp', 'desc'),
            where("month", "==", month))
        onSnapshot(quinielasQuery, (snapshot) => {
            dispatch(
                getPicks(
                    snapshot.docs.map(doc => ({data: doc.data(), id: doc.id}))
                )
            )
        })

        //all combinations
        let combRef = collection(db, 'combinations')
        let combQuery = query(combRef, orderBy('timestamp', 'desc'))
        getDocs(combQuery).then(x=> {
            x.forEach((doc) => {
                dispatch(getCombinations({data: doc.data(), id: doc.id}))
            });
        })

        //sum
        let sumRef = collection(db, 'sum')
        let sumQuery = query(sumRef, orderBy('timestamp', 'desc'),
            where("month", "==", month))
        getDocs(sumQuery).then(x=> {
            x.forEach((doc) => {
                dispatch(getSum({data: doc.data(), id: doc.id}))
            });
        })

        //sumPair
        let sumPairRef = collection(db, 'sumPair')
        let sumPairQuery = query(sumPairRef, orderBy('timestamp', 'desc'),
            where("month", "==", month))
        getDocs(sumPairQuery).then(x=> {
            x.forEach((doc) => {
                dispatch(getSumPair({data: doc.data(), id: doc.id}))
            });
        })

        // //sumOneTwoThree
        let sumOneTwoThreeRef = collection(db, 'sumOneTwoThree')
        let sumOneTwoThreeQuery = query(sumOneTwoThreeRef, orderBy('timestamp', 'desc'),
            where("month", "==", month))
        getDocs(sumOneTwoThreeQuery).then(x=> {
            x.forEach((doc) => {
                dispatch(getSumOneTwoThree({data: doc.data(), id: doc.id}))
            });
        })

    }, []);


    let quinielasList;
    if(picks){
        quinielasList = picks.map(item => {
            return (
                <Grid item xs={4} sm={4} lg={2}>
                    <Card sx={{ minWidth: 20 }} style={{margin: 4}}>
                        <CardContent>
                            <Typography sx={{ fontSize: 20}} color="text.secondary" gutterBottom>
                                {item.data.fullNum}
                            </Typography>
                            <Button variant="outlined" size="small" onClick={()=>{
                                deleteDoc(doc(db, 'posts', item.id)).then()
                            }}>delete</Button>
                        </CardContent>

                    </Card>
                </Grid>
            )
        })
    }


    const [disableButton, setDisableButton] = useState(false)
    const [historyButton, setHistoryButton] = useState(false)

    const [numbers, setNumbers] = useState([])

    const getHistory = async (e) => {
        setHistoryButton(true)
        await sumOneTwoThree(picks, currentSumOneTwoThree)
        await sum(picks, currentSum)
        await sumPair(picks, currentSumPair)
        setHistoryButton(false)

    }


    const runEngine = async () => {
        setDisableButton(true)
        setNumbers([])
        let runWhile = true
        let finalList = []
        while (runWhile&&finalList.length<11) {
            runWhile = false
            let randomCombination = allCombinations.data.arr[Math.floor(Math.random() * allCombinations.data.arr.length)];
            if(randomCombination.total<5){
                console.log('run again not in range')
                runWhile = true
            }
            if(randomCombination.total>=22){
                console.log('run again not in range')
                runWhile = true
            }

            //first two numbers can not be similar to previous first two numbers [(x,x),x]
            let one = await firstTwoSimilar(randomCombination.full, picks.slice(0, 10))
                if(one>=1){
                    console.log('run firstTwoSimilar')
                    runWhile = true
                }

            //last two numbers can not be similar to previous last two numbers [x,(x,x)]
            let two = await lastTwoSimilar(randomCombination.full, picks.slice(0,10))
                if(two>=1){
                    console.log('run again lastTwoSimilar')
                    runWhile = true

                }

            //the current sum of the 3 numbers can not be similar to previous sums of winning numbers
            //ex 4, 2, 8 (4 + 2 + 8 = 14) | 14 is the current sum
            let three = await allSums(randomCombination.total, picks)
                if(three>=1){
                    console.log('run again allSums')
                    runWhile = true

                }

            //first and last number can not be similar to first and last previous numbers of winning numbers
            let four = await firstLastSimilar(randomCombination.full, picks.slice(0, 20))
                if(four>=1){
                    console.log('run again firstLastSimilar')
                    runWhile = true

                }

            //the random number has to be included in the popularLowHigUp list
            lowHighUp(randomCombination.full, picks[0]).then(x=>{
                let popularLowHighUp = [ 'l l l ', 'l l h ', 'l h h ', 'l h l ', 'h h h ', 'h h l ', 'h l l ', 'h l h ' ]
                if(!popularLowHighUp.includes(x)){
                    console.log('run again popularLowHighUp')
                    runWhile = true
                }
            })

            //the random combination number (evenOdd) can not be similar to the most recent winning number (evenOdd)
            //ex 2, 4, 3 (2 is even, 4 is even and 3 is odd | = even, even, odd
            if(randomCombination.evenOdd===picks[0].data.evenOdd){
                console.log('run again evenOdd')
                runWhile = true

            }

            //ex 4, 7, 2 (4 + 7 = 11 and 7 + 2 = 9 | final result is 11,9 | 11 is odd and 9 is odd | 'odd odd'
            if(randomCombination.sumOneTwoThreeEvenOdd===picks[0].data.sumOneTwoThreeEvenOdd){
                console.log('run again sumOneTwoThreeEvenOdd')
                runWhile = true

            }

            // first numbers sum compare to the two newest winning numbers
            // ex 3, 5, 2 (3 + 5 = 8) | 8 is first two sum
            // ex 3, 5, 2 (5 + 2 = 7) | 7 is last two sum
            // firstTwoSum(submittedNum.num, picks.slice(0,2)).then(x=>x>=1&&similaritiesFunc('similar firstTwoSum'))
            // lastTwoSum(submittedNum.num, picks.slice(0,2)).then(x=>x>=1&&similaritiesFunc('similar lastTwoSum'))

            let five = await firstTwoSumAndLastTwoSum(randomCombination, picks.slice(0, 20))
                if(five>=1){
                    console.log('run again firstTwoSumAndLastTwoSum')
                    runWhile = true

                }

            //ex 3, 5, 7 (8,12 = 20) => 20 is sumOneTwoAndTwoThreeSimilarity
            let six = await sumOneTwoAndTwoThreeSimilarity({sumOneTwo: randomCombination.sumOneTwo, sumTwoThree: randomCombination.sumTwoThree},
                picks.slice(0,10))
                if(six>=1){
                    console.log('run again sumOneTwoAndTwoThreeSimilarity')
                    runWhile = true

                }

            //section for previousComb
            let previousEvenOrOddArr
            if(randomCombination&&randomCombination.full) {
                previousEvenOrOddArr = '';
                if ((picks[0].data.one + randomCombination.num[0]) % 2 === 0) {
                    previousEvenOrOddArr += 'even' + ' '
                } else {
                    previousEvenOrOddArr += 'odd' + ' '
                }
                if ((picks[0].data.two + randomCombination.num[1]) % 2 === 0) {
                    previousEvenOrOddArr += 'even' + ' '
                } else {
                    previousEvenOrOddArr += 'odd' + ' '
                }
                if ((picks[0].data.three + randomCombination.num[2]) % 2 === 0) {
                    previousEvenOrOddArr += 'even' + ' '
                } else {
                    previousEvenOrOddArr += 'odd' + ' '
                }
                let one = randomCombination.num[0]
                let two = randomCombination.num[1]
                let three = randomCombination.num[2]
                randomCombination = {...randomCombination}

                randomCombination['previousComb'] =
                    {
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

                    }


                //ex submitted number   = 3, 2, 5
                //newest winning number = 4, 1, 6
                //[3+4 = 7 | 7 is odd] [2+1 = 3 | 3 is odd] [5+6 = 11 |11 is odd] | final result => odd, odd, odd
                let seven = await previousCombEvenOdd(randomCombination, picks.slice(0, 1))
                    if(seven>=1){
                        console.log('run again previousCombEvenOdd')
                        runWhile = true

                    }

                //ex submitted number   = 3, 2, 5
                //newest winning number = 4, 1, 6
                //[3+4 = 7 ] [2+1 = 3 ] | first two numbers are '73'
                let eight = await previousCombFirstTwo(randomCombination, picks.slice(0, 9))
                    if(eight>=1){
                        console.log('run again previousCombFirstTwo')
                        runWhile = true

                    }

                //ex submitted number   = 3, 2, 5
                //newest winning number = 4, 1, 6
                //[2+1 = 3 ] [5+6 = 11 ] | last two numbers are '311'
                let nine = await previousCombLastTwo(randomCombination, picks.slice(0, 9))
                    if(nine>=1){
                        console.log('run again previousLastTwo')
                        runWhile = true

                    }


                // //ex submitted number   = 3, 2, 5
                // //newest winning number = 4, 1, 6
                // //[3+4 = 7 ] [2+1 = 3 ] [5+6 = 11 ] | 7+3+11 = sumFinal is 21
                let ten = await previousCombSumFinal(randomCombination, picks.slice(0, 9))
                    if(ten>=1){
                        console.log('please run again previousCombFinal')
                        runWhile = true

                    }


                //ex submitted number   = 3, 2, 5
                //newest winning number = 4, 1, 6
                // 3 + 4 = 7 | previousCombOne is 7
                let eleven = await previousCombOneTwoThree(randomCombination, picks.slice(0, 20))
                    if(eleven>=1){
                        console.log('please run again previousCombOneTwoThree')
                        runWhile = true
                    }


                //ex submitted number   = 3, 2, 5
                //newest winning number = 4, 1, 6
                //   (3+4 = 7) (2+1 = 3) (5+6 = 11) | 7 + 3 = 10, 3 + 11 = 14 | previousSumFirstTwoAndLastTwo is 10 14
                let twelve = await previousCombSumFirstTwoAndLastTwo(randomCombination, picks.slice(0,10))
                    if(twelve>=1){
                        console.log('please run again previousCombSumFirstTwoAndLastTwo')
                        runWhile = true
                    }


                //ex submitted number   = 3, 2, 5
                //newest winning number = 4, 1, 6
                //   (3+4 = 7) (2+1 = 3) (5+6 = 11) | 7 + 3 = 10, 3 + 11 = 14 | previousSumFirstTwoAndLastTwoString is '1014'
                let thirteen = await previousCombSumFirstTwoAndLastTwoString(randomCombination, picks.slice(0,15))
                    if(thirteen>=1){
                        console.log('please run again previousCombSumFirstTwoAndLastTwoString')
                        runWhile = true
                    }


                //ex submitted number   = 3, 2, 5
                //newest winning number = 4, 1, 6
                //   (3+4 = 7) (2+1 = 3) (5+6 = 11) | previousCombAll = '7311'
                let fourteen = await previousCombAll(randomCombination, picks)
                    if(fourteen>=1){
                        console.log('please run again previousCombAll')
                        runWhile = true
                    }
            }


            if(!runWhile){
                if(finalList.includes(randomCombination)){
                    runWhile = true
                }else {
                    finalList.push(randomCombination)
                    runWhile = true
                }
            }

        }

        setNumbers(finalList)
        setDisableButton(false)

    }

    let numbersList;
    if(numbers){
        numbersList = numbers.map(item => {
            return (
                <Grid item xs={4} sm={4} lg={4}>
                    <Card sx={{ minWidth: 20 }} style={{margin: 5}}>
                        <CardContent>
                            <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
                                {item.full}
                            </Typography>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                total = {item.total}
                            </Typography>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                evenOdd = {item.evenOdd}
                            </Typography>
                            <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                                sumOneTwoThree = {item.sumOneTwoThree}
                            </Typography>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                previousSumFinal = {item.previousComb.sumFinal}
                            </Typography>
                        </CardContent>

                    </Card>
                </Grid>
            )
        })
    }


    if(picks){

        return (
            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">

                <Grid item xs={11} sm={11} lg={7}>
                    <Item elevation={4}>
                        <Typography variant="h5" gutterBottom style={{color: 'black', marginTop: 10}}>
                            Winning Numbers
                        </Typography>
                        <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                            {quinielasList}
                        </Grid>
                    </Item>
                </Grid>

                <Grid item xs={11} sm={11} lg={7}>
                    <Item elevation={4}>
                        <Typography variant="h5" gutterBottom style={{color: 'black', marginTop: 10}}>
                            11 Numbers
                        </Typography>
                        <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                            {numbersList}
                        </Grid>
                    </Item>
                </Grid>

                <Grid>
                    <Button onClick={runEngine} style={{margin: 10}} type="submit" variant="contained" color="primary" disabled={disableButton}>Run engine and return 11 numbers</Button>
                </Grid>

                <CheckNumbers/>

                {currentSum&&
                    <Grid item xs={11} sm={11} lg={7}>
                        <Item elevation={4}>
                            <Typography variant="h5" gutterBottom style={{color: 'black', marginTop: 10}}>
                                sum
                            </Typography>
                                <BarChart width={320} height={250} data={currentSum.data.arr}>
                                    <XAxis dataKey="num" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                        </Item>

                    </Grid>
                }


                {currentSumPair&&
                    <Grid item xs={11} sm={11} lg={7}>
                        <Item elevation={4}>
                            <Typography variant="h5" gutterBottom style={{color: 'black', marginTop: 10}}>
                                sumPair
                            </Typography>
                            <Typography variant="h6" gutterBottom style={{color: 'black', marginTop: 10}}>
                                ex: 2, 4, 9 (2+4 = 6 is sumOneTwo)| (4+9 = 13 is sumTwoThree)
                            </Typography>
                                <BarChart width={320} height={250} data={currentSumPair.data.arr}>
                                    <XAxis dataKey="num" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="countOneTwo" fill="#8884d8" />
                                    <Bar dataKey="countTwoThree" fill="#ff7300" />

                                </BarChart>
                        </Item>
                    </Grid>
                }


                {currentSumOneTwoThree&&
                    <Grid item xs={11} sm={11} lg={7}>
                        <Item elevation={4}>
                            <Typography variant="h5" gutterBottom style={{color: 'black', marginTop: 10}}>
                                sumOneTwoThree
                            </Typography>
                                <BarChart width={320} height={250} data={currentSumOneTwoThree.data.arr}>
                                    <XAxis dataKey="num" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                        </Item>
                    </Grid>
                }


                <CreatePost/>


                <Grid>
                    <Button onClick={getHistory} style={{margin: 10}} type="submit" variant="contained" color="primary" disabled={historyButton}>History</Button>
                </Grid>

            </Grid>
        );
    }else {
        return (
            <Spinner/>
        )
    }


}

export default Home;
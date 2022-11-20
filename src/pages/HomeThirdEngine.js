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
import CheckNumbersSecondEngine from "../components/checkNumbers/CheckNumbersSecondEngine";
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

function HomeThirdEngine() {
    const dispatch = useDispatch()
    const picks = useSelector(selectPicks)
    const currentSum = useSelector(selectSum)
    const currentSumPair = useSelector(selectSumPair)
    const currentSumOneTwoThree = useSelector(selectSumOneTwoThree)
    const allCombinations = useSelector(selectCombinations)

    const [formData, setFormData] = useState({
        fireball: '',
    });
    const { fireball } = formData;
    let list = [0,1,2,3,4,5,6,7,8,9]
    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(() => {
        let today = new Date();
        let month = today.toLocaleString('default', { month: 'long' });

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


    const runEngine = async (e) => {
        e.preventDefault()
        setDisableButton(true)
        setNumbers([])
        let runWhile = true

        let numberPos = []
        let finalList = []
        let fireballNumbers = [0,1,2,3,4,5,6,7,8,9]
        for( let i = 0; i < fireballNumbers.length; i++){

            if ( fireballNumbers[i] === parseInt(fireball)) {

                fireballNumbers.splice(i, 1);
            }

        }
        console.log(fireballNumbers)

        let numPicked = [
            {
                num: 0,
                first: 0,
                second: 0,
                third: 0,
                total: 0
            },
            {
                num: 1,
                first: 0,
                second: 0,
                third: 0,
                total: 0
            },
            {
                num: 2,
                first: 0,
                second: 0,
                third: 0,
                total: 0
            },
            {
                num: 3,
                first: 0,
                second: 0,
                third: 0,
                total: 0
            },
            {
                num: 4,
                first: 0,
                second: 0,
                third: 0,
                total: 0
            },
            {
                num: 5,
                first: 0,
                second: 0,
                third: 0,
                total: 0
            },
            {
                num: 6,
                first: 0,
                second: 0,
                third: 0,
                total: 0
            },
            {
                num: 7,
                first: 0,
                second: 0,
                third: 0,
                total: 0
            },
            {
                num: 8,
                first: 0,
                second: 0,
                third: 0,
                total: 0
            },
            {
                num: 9,
                first: 0,
                second: 0,
                third: 0,
                total: 0
            }

        ]

        while (runWhile&&finalList.length<5) {
            runWhile = false
            let randomCombination = allCombinations.data.arr[Math.floor(Math.random() * allCombinations.data.arr.length)];
            //3,5,8
            let xx = randomCombination.num
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
            let totalFound = 0
            console.log(sex.length)
            for (const numbers of sex) {
                const found = allCombinations.data.arr.find(element => element.full === numbers);
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

                    //the current sum of the 3 numbers can not be similar to previous sums of winning number
                    //ex 4, 2, 8 (4 + 2 + 8 = 14) | 14 is the current sum
                    let three = await allSums(found.total, picks)
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
            console.log(`${totalBad}---${randomCombination.full}----totalFound=${totalFound}`)
            if(!runWhile){
                if(finalList.includes(randomCombination)||totalBad>8
                    ||numPicked[randomCombination.num[0]].first>=1
                    ||numPicked[randomCombination.num[1]].second>=1
                    ||numPicked[randomCombination.num[2]].third>=1
                    ||numPicked[randomCombination.num[0]].total>=2
                    ||numPicked[randomCombination.num[1]].total>=2
                    ||numPicked[randomCombination.num[2]].total>=2){
                    console.log(`I ran again ${randomCombination.full}--totalBad=${totalBad}`)
                    totalFound = 0
                    totalBad = 0
                    runWhile = true
                }else {
                    totalFound = 0
                    totalBad = 0
                    numPicked.forEach(function (arrayItem) {
                        if(arrayItem.num===randomCombination.num[0]){
                            arrayItem.first += 1
                            arrayItem.total += 1
                        }
                        if(arrayItem.num===randomCombination.num[1]){
                            arrayItem.second += 1
                            arrayItem.total += 1
                        }
                        if(arrayItem.num===randomCombination.num[2]){
                            arrayItem.third += 1
                            arrayItem.total += 1
                        }
                    })
                    finalList.push(randomCombination)
                    runWhile = true
                }
            }

        }

        setNumbers(finalList)
        setDisableButton(false)
        console.log(numPicked)
        // console.log(numPicked)
        // console.log(allSumList)
        // console.log(allSumsSelected)
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
                    <form onSubmit={runEngine} style={{marginTop: 1, textAlign: "center"}}>
                        <FormControl style={{width: 200}}>
                            <InputLabel id="demo-simple-select-label">Fireball</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={fireball}
                                label="One"
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

                        <Button style={{margin: 10}} type="submit" variant="contained" color="primary" disabled={disableButton}>Run engine and return 5 numbers</Button>


                    </form>
                </Grid>

                <CheckNumbersSecondEngine/>

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

export default HomeThirdEngine;
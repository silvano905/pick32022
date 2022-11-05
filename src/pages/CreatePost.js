import React, {useState, Fragment, useEffect} from 'react';
import {db} from '../config-firebase/firebase'
import {addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, limit, getDocs} from "firebase/firestore";
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../redux/user/userSlice";
import {Navigate} from "react-router-dom";
import './Register.css'
// material ui
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {getPicks, selectPicks} from "../redux/picks/picksSlice";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: 8,
    marginTop: 11,
    marginBottom:10
}));

function CreatePost() {

    let today = new Date();
    let month = today.toLocaleString('default', { month: 'long' });

    useEffect(() => {
    }, []);
    const [formData, setFormData] = useState({
        one: '',
        two: '',
        three: ''
    });

    const [disableButton, setDisableButton] = useState(false)

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const { one, two, three } = formData;

    const register = (e) => {
        e.preventDefault()
        setDisableButton(true)
        let picks
        let quinielasRef = collection(db, 'posts')
        let quinielasQuery = query(quinielasRef, limit(1), orderBy('timestamp', 'desc'),
            where("month", "==", month))
        getDocs(quinielasQuery).then(x=>{
            x.forEach((doc) => {
                picks = [{data: doc.data(), id: doc.id}]
            });
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


        let highLowList = '';
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

        let xx
        let previousEvenOrOddArr
        if(picks&&picks[0]) {
            previousEvenOrOddArr = '';
            if((picks[0].data.one + one) % 2 === 0) {
                previousEvenOrOddArr += 'even'+ ' '
            }else {
                previousEvenOrOddArr += 'odd'+ ' '
            }
            if((picks[0].data.two + two) % 2 === 0) {
                previousEvenOrOddArr += 'even'+ ' '
            }else {
                previousEvenOrOddArr += 'odd'+ ' '
            }
            if((picks[0].data.three + three) % 2 === 0) {
                previousEvenOrOddArr += 'even'+ ' '
            }else {
                previousEvenOrOddArr += 'odd'+ ' '
            }

            xx = {
                all: (picks[0].data.one + one) + ''+(picks[0].data.two + two) + ''+ (picks[0].data.three + three),
                firstTwo: (picks[0].data.one + one) + ''+(picks[0].data.two + two),
                lastTwo: (picks[0].data.two + two) + ''+ (picks[0].data.three + three),
                sumFirstTwo: (picks[0].data.one + one)+(picks[0].data.two + two),
                sumLastTwo: (picks[0].data.two + two) + (picks[0].data.three + three),
                evenOdd: previousEvenOrOddArr,
                one: picks[0].data.one + one,
                two: picks[0].data.two + two,
                three: picks[0].data.three + three,
                sumFinal: (picks[0].data.one + one) + (picks[0].data.two + two) + (picks[0].data.three + three)
            }
        }
        addDoc(collection(db, "posts"), {
            month: month,
            one: parseInt(one),
            two: parseInt(two),
            three: parseInt(three),
            fullNum: one+''+two+''+three,
            firstTwo: one+''+two,
            highLow: highLowList,
            lastTwo: two+''+three,
            previousComb: xx?xx:null,
            sum: one+two+three,
            sumOneTwo: one+two,
            sumOneTwoThreeEvenOdd: sumOneTwoEvenOddString,
            sumTwoThree: two+three,
            sumOneTwoThreeNum: (one+two)+(two+three),
            evenOdd: evenOrOddArr,
            timestamp: serverTimestamp()
        }).then(()=>{
            setFormData({one: '', two: '', three: ''})
            setDisableButton(false)
            picks = null
        })
    })



    }

    let list = [0,1,2,3,4,5,6,7,8,9]

    return (

            <Grid item sm={11} lg={7} xs={11}>
                <Item elevation={4}>
                    <Typography variant="h5" gutterBottom style={{color: 'black', marginTop: 10}}>
                        Create Result
                    </Typography>

                    <form onSubmit={register} style={{marginTop: 10}}>
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

                                        {/*<MenuItem value='0'>0</MenuItem>*/}
                                        {/*<MenuItem value='1'>1</MenuItem>*/}
                                        {/*<MenuItem value='2'>2</MenuItem>*/}
                                        {/*<MenuItem value='3'>3</MenuItem>*/}
                                        {/*<MenuItem value='4'>4</MenuItem>*/}
                                        {/*<MenuItem value='5'>5</MenuItem>                                                <MenuItem value='0'>0</MenuItem>*/}
                                        {/*<MenuItem value='6'>6</MenuItem>*/}
                                        {/*<MenuItem value='7'>7</MenuItem>                                                <MenuItem value='0'>0</MenuItem>*/}
                                        {/*<MenuItem value='8'>8</MenuItem>*/}
                                        {/*<MenuItem value='9'>9</MenuItem>*/}
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



                            <Grid item sm={9} lg={8} xs={9}>
                                <Button style={{margin: 10}} type="submit" variant="contained" color="primary">Add result</Button>
                            </Grid>


                        </Grid>
                    </form>
                </Item>
            </Grid>

    );
}

export default CreatePost;
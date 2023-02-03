import React, {useState, useEffect, Fragment} from 'react';
import axios from "axios";
import {auth, db} from '../config-firebase/firebase'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import {Navigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import MonthSelector from "../components/monthSelector/MonthSelector";
import {CurrentThreeSingle, DrawSameDay, GetRandomThreeNumbers} from "../components/funtions/NewFunctions";
import {login, selectUser} from "../redux/user/userSlice";
import {Link} from "react-router-dom";
import ConfirmDelete from "../components/delete/ConfirmDelete";
// material ui imports for styling
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {selectDraws, getDraws} from "../redux/draws/drawsSlice";
import {collection, deleteDoc, doc, getDocs, limit, onSnapshot, orderBy, query, where} from "firebase/firestore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: 5,
    marginTop: 10
}));

const StyledText = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'linear-gradient(45deg, #02CC92 8%, #1283C9 80%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center'
}));

function Testing() {
    const draws = useSelector(selectDraws)
    const dispatch = useDispatch()
    const [selectedMonth, setSelectedMonth] = useState('Jan')
    useEffect(() => {
        const q = query(collection(db, "picks"), orderBy('timestamp', 'desc'), where("drawMonth", "==", selectedMonth));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            dispatch(
                getDraws(
                    querySnapshot.docs.map(doc => ({data: doc.data(), id: doc.id}))
                )
            )
        });

    }, [selectedMonth]);




    let drawsList;
    if(draws){

        const x = async () => {
            let tt = await CurrentThreeSingle(draws.slice(0, 3))
            await GetRandomThreeNumbers(tt)

        }
        //
        // const x1 = async () => {
        //     let nn = await DrawSameDay(draws.slice(0, 1))
        //     console.log(nn)
        // }
        // x1()



        drawsList = draws.map(item => {
            return (
                <Grid item xs={6} sm={6} lg={6}>
                    <Card sx={{ minWidth: 20 }} style={{color: '#03071e', margin: 4}}>
                        <CardContent style={{ textAlign: "center" }}>
                            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                                <Typography variant="h5" gutterBottom>
                                    {item.data.fullNumsString}
                                </Typography>
                                <Avatar sx={{ bgcolor: '#fb8500', width: 24, height: 24}} style={{ marginTop: -9}}>
                                    {item.data.fireball}
                                </Avatar>
                            </Stack>

                            <Typography variant="body1" gutterBottom>
                                {item.data.drawDate}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {item.data.time}
                            </Typography>

                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <MoreHorizIcon/>
                                </AccordionSummary>
                                <AccordionDetails style={{ textAlign: "center" }}>
                                    <Typography variant="h6" color="text.secondary" gutterBottom style={{color: '#023047'}}>
                                        sum
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary" gutterBottom style={{marginTop: -12}}>
                                        {item.data.sumAllThreeNums}
                                    </Typography>

                                    <Typography variant="h6" color="text.secondary" gutterBottom style={{color: '#023047'}}>
                                        evenOdd
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary" gutterBottom style={{marginTop: -12}}>
                                        {item.data.evenOdd}
                                    </Typography>

                                    <Typography variant="h6" color="text.secondary" gutterBottom style={{color: '#023047'}}>
                                        LowHighEqual
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary" gutterBottom style={{marginTop: -12}}>
                                        {item.data.lowHighEqual}
                                    </Typography>

                                    <Typography variant="h6" color="text.secondary" gutterBottom style={{color: '#023047'}}>
                                        winning combs
                                    </Typography>
                                    <div>
                                        {[...item.data.winningCombinationsObj.list].map(i => {
                                            return (
                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                {i}
                                            </Typography>
                                            );
                                        })}
                                    </div>
                                </AccordionDetails>
                            </Accordion>

                            <ConfirmDelete doc={doc} item={item} db={db} deleteDoc={deleteDoc}/>
                        </CardContent>

                    </Card>
                </Grid>
            )
        })
    }

    return (
        <>
            <div style={{textAlign: "center", marginTop: 8}}>
                <Typography variant="h5" gutterBottom style={{color: 'black', margin: "auto"}}>
                    Winning Numbers
                </Typography>
                <MonthSelector selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}/>
            </div>

            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                <Grid item xs={12} sm={12} lg={7}>
                    <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                        {drawsList}
                    </Grid>
                </Grid>
            </Grid>
        </>

    );
}

export default Testing;
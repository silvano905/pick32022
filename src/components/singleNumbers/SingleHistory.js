import React, {useState, useEffect, Fragment} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const SingleHistory = ({ draws }) => {

    const list = [
        {
            number: 0,
            countFirst: 0,
            countSecond: 0,
            countThird: 0
        },
        {
            number: 1,
            countFirst: 0,
            countSecond: 0,
            countThird: 0
        },
        {
            number: 2,
            countFirst: 0,
            countSecond: 0,
            countThird: 0
        },
        {
            number: 3,
            countFirst: 0,
            countSecond: 0,
            countThird: 0
        },
        {
            number: 4,
            countFirst: 0,
            countSecond: 0,
            countThird: 0
        },
        {
            number: 5,
            countFirst: 0,
            countSecond: 0,
            countThird: 0
        },
        {
            number: 6,
            countFirst: 0,
            countSecond: 0,
            countThird: 0
        },
        {
            number: 7,
            countFirst: 0,
            countSecond: 0,
            countThird: 0
        },
        {
            number: 8,
            countFirst: 0,
            countSecond: 0,
            countThird: 0
        },
        {
            number: 9,
            countFirst: 0,
            countSecond: 0,
            countThird: 0
        }

    ]

    for (const [key, value] of Object.entries(draws)) {
        list.forEach(function (arrayItem) {
            if(arrayItem.number===value.data.numbers[0]){
                arrayItem.countFirst += 1
            }
            if(arrayItem.number===value.data.numbers[1]){
                arrayItem.countSecond += 1
            }
            if(arrayItem.number===value.data.numbers[2]){
                arrayItem.countThird += 1
            }
        })
    }

    return (
        <div>
            <p>hi</p>
        </div>
    );
};

export default SingleHistory;
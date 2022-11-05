import React, {useState, Fragment} from 'react';
import {auth} from '../config-firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {useDispatch, useSelector} from "react-redux";
import {login, selectUser} from "../redux/user/userSlice";
import {Link, Navigate} from "react-router-dom";
import './Register.css'
// material ui
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

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: 8,
    marginTop: 11,
    marginBottom:10
}));

function Register() {
    const user = useSelector(selectUser)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        profilePic: null
    });

    const setImage = (e) => {
        e.preventDefault()
        setFormData({...formData, profilePic: e.target.files[0]})
    }

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    //password
    const [values, setValues] = React.useState({
        password: '',
        showPassword: false,
    });

    const { name, email, password, profilePic } = formData;

    const register = (e) => {
        e.preventDefault()
        createUserWithEmailAndPassword(auth, email, password)
            .catch(err => {
                    console.log(err.message)
                })
    }
    const dispatch = useDispatch()

    if(user){
        return <Navigate to='/'/>
    }

    return (
        <Fragment>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1} justifyContent="center">
                    <Grid item sm={11} lg={7} xs={11}>
                        <Item elevation={4}>
                            <Typography variant="h5" gutterBottom style={{color: 'black', marginTop: 10}}>
                                Create an account
                            </Typography>
                            <Typography  variant="h6" gutterBottom style={{marginBottom: 10, color: '#22223b'}}>
                                already registered?
                                <Link to='/login' style={{textDecoration: 'none', color: 'blue'}}> Login here
                                </Link>
                            </Typography>

                            <form onSubmit={register} style={{marginTop: 10}}>
                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item sm={11} lg={7} xs={11}>
                                        <FormControl>
                                            <div className="file-input">
                                                <input onChange={setImage} type="file" id="file" className="file"/>
                                                <label htmlFor="file">
                                                    Select profile image (optional)
                                                    {profilePic&&<p className="file-name">{profilePic.name}</p>}
                                                </label>
                                            </div>
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={11} lg={7} xs={11}>
                                        <FormControl>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="standard-basic"
                                                label="username"
                                                name="name"
                                                inputProps={{ maxLength: 20 }}
                                                value={name}
                                                onChange={onChange}
                                                required
                                                style={{marginTop: 10}}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={7} lg={7} xs={9}>
                                        <FormControl>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="standard-basic3"
                                                label="Email"
                                                name="email"
                                                value={email}
                                                onChange={onChange}
                                                required
                                                style={{marginTop: 10}}
                                            />
                                        </FormControl>
                                    </Grid>


                                    <Grid item sm={7} lg={7} xs={9}>
                                        <FormControl>
                                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password"
                                                label="password"
                                                type={values.showPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                name="password"
                                                value={password}
                                                onChange={onChange}
                                                required
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={9} lg={8} xs={9}>
                                        <Button style={{margin: 10}} type="submit" variant="contained" color="primary">Register</Button>
                                    </Grid>


                                </Grid>
                            </form>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </Fragment>
    );
}

export default Register;
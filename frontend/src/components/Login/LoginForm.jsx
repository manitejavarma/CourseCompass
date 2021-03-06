//Backend Created by Philemon Lee and Front Created by Mueed Qadri
import React, {useState} from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {Link as MaterialLink} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import '../../css/Custom.css';
import AlertDialog from '../Shared/AlertDialog';
import { Link, useHistory} from "react-router-dom";

const authAPI = process.env.REACT_APP_API_END_POINT + '/users/login'
const usersAPI = process.env.REACT_APP_API_END_POINT + '/users/get/'

const useStyles = makeStyles((theme) => ({
      form: {
        width: '100%', 
        marginTop: theme.spacing(5),
      },
      submit: {
        margin: theme.spacing(3, 1, 3),
      },
      signUp:{
        borderRadius: 15,
        padding: theme.spacing(5, 3, 4)
      },
    }));

    
export default function LoginForm()  {
    const [user, setUser] = useState({
        email: "", 
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleClickShowPassword = (event) => {
        if(event && event.currentTarget &&event.currentTarget.ariaLabel && event.currentTarget.ariaLabel.includes("password") ){
            setShowPassword((prevState)=> !prevState);
        }
    }

    const history = useHistory();

    const handleChange = (event) => {
        user[event.target.name] = event.target.value;
        let err = validateChange(event.target.name, event.target.value);
        setUser(user);
        setErrors(err);
    }

    const onSubmit = async () => {
        let err ={};
        debugger
        for (const prop in user) {
            if (Object.hasOwnProperty.call(user, prop)) {
                const element = user[prop];
                err[prop] = validateChange(prop, element)[prop];      
            }
        }
        if(Object.values(err).every(x => x === null || x === '' || x=== undefined)){

            // check response
            const data = {"emailId" : user.email, "password" : user.password};
            await fetch(authAPI, {
                method: 'POST',
                body: JSON.stringify(data) ,
                headers:{          
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  }
            }).then(response =>{
                if(response.status == 200){
                    return response.json();
                }else if(response.status == 201){
                    err.email = "User id does not exist";
                } else if(response.status ==404){
                    err.password = "Invalid Password"
                } else {
                    err.email = "Unknown Error"
                }
                
            }).then((data) => {
                if(data){
                    sessionStorage.setItem('id', data.userId);
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('user', user.email);
                    history.push('/');
                    window.location.reload();
                }
            })
        }
        setErrors(err);
    }

    const validateChange =(fieldName, fieldValue)=> {
        let err = {};
        switch(fieldName) {
            case 'email':
                if (!fieldValue) {
                    err.email = "Enter your Email";
                }
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)) {
                    err.email = "Enter a valid email id";
                }
                break;
            case 'password':
                if (!fieldValue) {
                    err.password = "Password Cannot be empty";
                }
                break;
        }
        if (Object.getOwnPropertyNames(err).length !== 0) {
        }
        return err;
    }
 
    const classes = useStyles();
    return (
        <div>
            <Paper  elevation={10}  className={classes.signUp}>
                <Typography component="h1" variant="h4">
                    Login
                </Typography>
                <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="University Email"
                                name="email"
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email ?errors.email : ""}
                            />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    error={!!errors.password}
                                    onChange={handleChange}
                                    helperText={errors.password ?errors.password : ""}
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    InputProps={{ 
                                        endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleClickShowPassword}
                                            >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container justify="center">
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    href="#"
                                    onClick={onSubmit}
                                    className={classes.submit}
                                >
                                    Login
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link to="/register" style={{ textDecoration: 'none' }}>
                                    <MaterialLink   MaterialLink variant="body2">
                                        Create a new account
                                    </MaterialLink>
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
            </Paper>
            <Box m="9rem" />
        </div>
    );     
}
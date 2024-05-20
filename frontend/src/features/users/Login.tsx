import {Link as RouterLink, useNavigate} from "react-router-dom";
import {useState} from "react";
import {Alert, Avatar, Box, Button, Container, Grid, Link, TextField, Typography} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {selectLoginError} from "./usersSlice.ts";
import {login} from "./usersThunk.ts";
import { LoginMutation } from "../../types";

const Login = () => {
    const dispatch = useAppDispatch();
    const error = useAppSelector(selectLoginError);
    const navigate = useNavigate();

    const [state, setState] = useState<LoginMutation>({
        username: '',
        password: '',
    });

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setState(prevState => {
            return {...prevState, [name]: value};
        });
    };

    const submitFormHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        await dispatch(login(state)).unwrap();
        navigate('/');
    };


    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOpenIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                {error && (
                    <Alert severity="error" sx={{mt: 5, width: '100%'}}>{error.error}</Alert>
                )}
                <Box component="form" onSubmit={submitFormHandler} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Username"
                                name="username"
                                autoComplete="new-username"
                                value={state.username}
                                onChange={inputChangeHandler}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                autoComplete="new-password"
                                value={state.password}
                                onChange={inputChangeHandler}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign In
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/register" variant="body2">
                                Or register?
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
import {AppBar, Grid, styled, Toolbar, Typography} from '@mui/material';
import {Link as NavLink} from 'react-router-dom';
import UserMenu from "./UserMenu.tsx";
import AnonymousMenu from "./AnonymousMenu.tsx";
import { useAppSelector } from '../../app/hooks.ts';
import { selectUser } from '../../features/users/usersSlice.ts';

const LogoLink = styled(NavLink)({
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
        color: 'inherit',
    }
});

const AppToolbar = () => {
    const user = useAppSelector(selectUser);

    return (
        <AppBar position="sticky" sx={{mb: 2}}>
            <Toolbar>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="div">
                        <LogoLink to="/">Flea Market</LogoLink>
                    </Typography>
                    <Grid item>
                        {user ? (
                            <UserMenu user={user} />
                        ) : (
                            <AnonymousMenu/>
                        )}
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
};

export default AppToolbar;
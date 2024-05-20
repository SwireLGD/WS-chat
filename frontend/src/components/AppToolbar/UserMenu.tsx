import React, {useState} from 'react';
import {Button, Menu, MenuItem} from "@mui/material";
import { useAppDispatch } from '../../app/hooks';
import { User } from '../../types';
import { Link } from 'react-router-dom';
import { logout } from '../../features/users/usersThunk';

interface Props {
    user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleLogout = () => {
        dispatch(logout());
    }

    return (
        <>
            <Button
                color="inherit"
                onClick={handleClick}
            >
                Hello {user.username}!
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                keepMounted
            >
                <MenuItem onClick={handleClose} component={Link} to="/add_item">Add new item</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;
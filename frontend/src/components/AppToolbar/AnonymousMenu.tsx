import {Button} from "@mui/material";
import {Link as NavLink} from "react-router-dom";

const AnonymousMenu = () => {
    return (
        <>
            <Button component={NavLink} to="/register" color="inherit">
                Sign Up
            </Button>
            <Button component={NavLink} to="/login" color="inherit">
                Sign In
            </Button>
        </>
    );
};

export default AnonymousMenu;
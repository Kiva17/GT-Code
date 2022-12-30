import React from 'react'
import Toolbar from '@mui/material/Toolbar';
import {
    InputAdornment,
} from "@mui/material";
import TextField from '@mui/material/TextField';
import { Search } from "@mui/icons-material";


// Search Bar Component 

function EnhancedTableToolbar(props) {  //Before Table

    const { searchUser, setSearchUser } = props;

    return (
        <>
            <Toolbar
            >
             {/* TextField component from material UI */}

                <TextField id="outlined-basic" fullWidth variant="outlined" margin="dense" color="primary" size="small"

                    value={searchUser} onChange={(e) => { setSearchUser(e.target.value); }}

                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search color="primary" />
                            </InputAdornment>
                        ),
                    }}

                />
            </Toolbar>
        </>);
}

export default EnhancedTableToolbar;
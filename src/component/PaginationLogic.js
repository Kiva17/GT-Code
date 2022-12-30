import * as React from 'react';
import { useEffect, useState } from 'react';
import { config } from '../App';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import axios from "axios";
import { useSnackbar } from "notistack";
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import EnhancedTableToolbar from './EnhancedToolBar';
import Edit from './Edit';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import EditOffIcon from '@mui/icons-material/EditOff';
import { blueGrey} from '@mui/material/colors';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import "./PaginationLogic.css"

const heading = ["Name", "Email", "Role", "Operation"]


// Table header component

function EnhancedTableHead(props) {
    const { onSelectAllClick, page, users, rowsPerPage, selected } = props;


    const k = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((x) => x.id)
    // it contains all the id of elements present in a single page

    const { enqueueSnackbar } = useSnackbar();

    //CheckedOption function decides if the check box should be checked in table header

    function CheckedOption() {
        let k3 = selected.filter((x) => k.includes(x)) //checking whether the all the values of selected array present in the sliced array or not

        if (users.length <= 0) {
            return false
        }



        return k.length === k3.length   //checking whether all the values of selected array present in the sliced array length is eqaul to the sliced array length
    }


    //IntermediateCheckedOption function decides if the check box should be in intermediate state in table header

    function IntermediateCheckedOption() {
        if (!CheckedOption()) {
            let k3 = selected.filter((x) => k.includes(x)) //checking whether the selected array present in the sliced array or not

            if (k3.length > 0) {    //if the selected array length is >1 then intermediate button should be checked 
                return true
            }
        }

        return false
    }

    // console.log("selected", selected,"users",users)

    return (
        <TableHead>
            <TableRow  className="container1">

                {/* Table header */}

                <TableCell padding="checkbox">
                    {users.length > 0 && <Checkbox
                        color="primary"
                        indeterminate={IntermediateCheckedOption()}
                        checked={CheckedOption()}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />}
                </TableCell>

                {/* Table header field headings*/}

                {heading.map((x, y) => (


                    <TableCell
                        key={y}>
                        {x}
                    </TableCell>
                )

                )


                }
            </TableRow>
        </TableHead >
    );
}






// Table Body and pagination component 


export default function PaginationLogic() {
    const [selected, setSelected] = React.useState([]); //it stores id of checked data from the table 
    const [isEdit, setisEdit] = React.useState([]);    //it stores id of data from the table which are getting edited
    const [page, setPage] = React.useState(0); //it store user clicked page value from pagination button 
    const [rowsPerPage, setRowsPerPage] = React.useState(10);//it contains how much max value user should view in a single page
    const [searchUser, setSearchUser] = useState("");// this string will contain the searched data in the search bar
    const { enqueueSnackbar } = useSnackbar(); //used to display information like error success in app page
    const [users, setUsers] = useState([]); //it store the data of the table that need to showed in UI. 
    const [users1, setUsers1] = useState([]); //it stores fetch data values from api and the value of it will change if user do edit. 

    const [editedValue, setEditedValue] = useState([]);// this array will store the edited value 


    //   fetching data from Api. 

    async function fetchData() {

        try {

            const response = await axios.get(`${config.endpoint}`);
            setUsers(response.data)
            setUsers1(response.data)

        } catch (e) {
            if (e.response && e.response.status === 500) {
                enqueueSnackbar(e.response.data.message, { variant: "error" });
                return null;
            } else {
                enqueueSnackbar(
                    "Could not fetch data. Check that the backend is running, reachable and returns valid JSON.",
                    {
                        variant: "error",
                    }
                );
            }
        }
    }

    //  search function


    function Searching() {
        let k = []
        users1.forEach((eachUser) => {
            // searching will not be case sensitive
            if (eachUser["name"].toUpperCase().includes(searchUser.toUpperCase()) || eachUser["email"].toUpperCase().includes(searchUser.toUpperCase()) || eachUser["role"].toUpperCase().includes(searchUser.toUpperCase())) {
                k.push(eachUser)
            }

        })

        setUsers(k)

        setPage(0) //after user does search the current page will set to 0 
    }

    // handleSelectAllClick is used to select all rows(max 10) in the current page

    const handleSelectAllClick = (event) => {

        // when the checkbox is checked it will select all rows(max 10) in the current page

        if (event.target.checked) {
            const newSelected = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((x) => x.id); //changed
            setSelected([...new Set([...selected, newSelected].flat())]);  //getting the unique value as well as flat the array
            return;
        }

        // when the checkbox is unchecked it will deselect all rows(max 10) in the current page

        else {
            let k = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((x) => x.id); //changed
            let k1 = []

            k1 = selected.filter((x) => {

                if (!k.includes(x)) {
                    return x
                }
            }
            )

            setSelected([...k1]);
        }


    };

    //edit user details in the table function 

    const EditUser = (e, id1, name1, email1, role1) => {
        setisEdit([...isEdit, id1])

        if (editedValue.length == 0)   //storing the id of edited one
        {
            let k = { id: id1, name: name1, email: email1, role: role1 }
            setEditedValue([k])
        }
        else if (editedValue.find((x) => x["id"] === id1)) {
            return
        }

        else {
            let k = { id: id1, name: name1, email: email1, role: role1 }
            setEditedValue([...editedValue, k])
        }
    }

    //once edit is completed this function execute to update the edited details in the orginal state arrays (users and users1) 

    const EditOfUser = (e, id) => {

        let RemoveUserEdit = isEdit.filter((x) => {
            return x !== id   // contains userId
        });

        let k = editedValue.find((x) => x["id"] === id)
        // console.log("k",k)
        let k1 = users.filter((x) => x["id"] !== id)   //removing the edited one 
        let k2 = users1.filter((x) => x["id"] !== id)  //removing the edited one 
        // console.log("k1",k1)   
        k1.push(k)
        k2.push(k)
        k1.sort((x, y) => x["id"] - y["id"])  //sorting in terms of id 
        k2.sort((x, y) => x["id"] - y["id"])  //sorting in terms of id 

        setUsers(k1)

        setUsers1(k2) // storing


        // console.log("users",users)
        setisEdit([...RemoveUserEdit])
    }



    //to delete user from the table

    const DeleteUser = (selectedUser) => {
        // console.log("clicked")
        let userAfterDeletion = users.filter((user) => {
            return user.id !== selectedUser;   // contains userId
        });

        let SelectedUserAfterDeletion = []

        SelectedUserAfterDeletion = selected.filter((id) => { //deleting all the users from selected array
            return id !== selectedUser;
        });

        setSelected([...SelectedUserAfterDeletion])

        //removing these users from the orginal state hook array hooks i.e users1 

        let user1AfterDeletion = users1.filter((user) => {
            return user.id !== selectedUser;
        });

        setUsers1(user1AfterDeletion)


        //after succesful deletion of user it will show a succes promt 

        enqueueSnackbar(
            `successfully deleted`,
            {
                variant: "success",
            }
        )

        setUsers(userAfterDeletion);
    };


    //Delete all the selected user from the table

    const DeleteSelected = (e) => {

        let userAfterDeletion = users.filter((user) => {
            return !selected.includes(user["id"]);
        });


        setSelected([]);//after deletion there will be no value present in selected array

        //removing these users from the orginal state hook array hooks i.e users1 

        let user1AfterDeletion = users1.filter((user) => {
            return !selected.includes(user["id"]);
        });


        enqueueSnackbar(
            `${selected.length} successfully deleted`,
            {
                variant: "success",
            }
        )

        setUsers(userAfterDeletion);
        setUsers1(user1AfterDeletion)
        setPage(0);  //after user clicked on deleted selected button the current page will set to 0 
    }
    console.log(selected)


    //this function will execute when each cell checkbox is clicked and will store the id of the checked cell values in the selected state hook and remove the ids from there when unchecked. 

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };





    // when user moves on different page this function executes to update the page state hook value with the value that user clicked.   

    const handleChangePage = (event, newPage) => {
        setPage(newPage - 1);

    };


    //calling fetchData to fetching data 

    useEffect(() => {
        fetchData()
    }, [])

    // this  will run if isEdit array(which contains id of the array which are edited) and search user (searched string) string state gets changed 

    useEffect(() => {

        //debounce search logic 

        if (searchUser.length > 0) {
            let t = setTimeout(() => Searching(), 400);
            return () => clearTimeout(t);
        }
        else {
            setUsers([...users1])
        }

    }, [searchUser, isEdit])



    // console.log(editedValue)

    // to check if id is there in selected state hook array(it contains all the id's of the checked items in the table) 

    const isSelected = (name) => selected.indexOf(name) !== -1;

    return (

        <Box sx={{ width: '100%', maxHeight: '20%', minHeight: '10%' }} className="container1">

            <Grid container sx={{ width: '100%', mb: 2, maxHeight: '50%', minHeight: '50%' }} direction="row"
                justifyContent="center"
                alignItems="center">

                <Grid item>
                    <EnhancedTableToolbar numSelected={selected.length} searchUser={searchUser} setSearchUser={setSearchUser} page={page} users={users} rowsPerPage={rowsPerPage} />



                    <TableContainer>

                        <Table

                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                        >
                            <EnhancedTableHead
                                selected={selected}
                                users={users}
                                numSelected={selected.length}
                                onSelectAllClick={handleSelectAllClick}
                                rowsPerPage={rowsPerPage}
                                page={page}

                            />

                            {/* Table body */}


                            {users && users.length > 0 && <TableBody>
                                {users
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((x, index) => {

                                        // checking if this id is there in selected state hook array(it contains all the id's of the checked items in the table). 

                                        const isItemSelected = isSelected(x.id);
                                        return (
                                            <>
                                                <TableRow

                                                    key={x["id"]}


                                                    sx={{

                                                        ...(isItemSelected && {
                                                            bgcolor: blueGrey[50]
                                                        })
                                                    }}

                                                >

                                                    {/* checkbox for each cell */}

                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            onClick={(event) => handleClick(event, x.id)}

                                                            checked={isItemSelected}

                                                        />
                                                    </TableCell>


                                                    {/* Edit component is created, if edit button is clicked  then it will show that component */}

                                                    {isEdit.includes(x["id"]) ? <Edit value={x.name} flag={"name"} id={x.id} editedValue={editedValue} setEditedValue={setEditedValue} /> : <TableCell > {x.name}</TableCell>}

                                                    {isEdit.includes(x["id"]) ? <Edit value={x.email} flag={"email"} id={x.id} editedValue={editedValue} setEditedValue={setEditedValue} /> : <TableCell >{x.email}</TableCell>}

                                                    {isEdit.includes(x["id"]) ? <Edit value={x.role} flag={"role"} id={x.id} editedValue={editedValue} setEditedValue={setEditedValue} /> : <TableCell >{x.role}</TableCell>}


                                                    {/* Edit of on icons and delete button*/}

                                                    <TableCell >

                                                        {/* Edit of on button */}

                                                        {isEdit.includes(x["id"]) ?

                                                            <IconButton aria-label="edit" onClick={(e) => { EditOfUser(e, x["id"]) }} >
                                                                <EditOffIcon />
                                                            </IconButton>
                                                            :
                                                            <IconButton aria-label="edit" onClick={(e) => { EditUser(e, x["id"], x["name"], x["email"], x["role"]) }} >
                                                                <EditIcon />
                                                            </IconButton>
                                                        }

                                                        {/* delete button */}

                                                        <IconButton aria-label="delete" onClick={(e) => { DeleteUser(x["id"]) }}>
                                                            <DeleteIcon />
                                                        </IconButton>

                                                    </TableCell>

                                                </TableRow>



                                            </>
                                        );
                                    })}
                            </TableBody>}


                        </Table>

                        {/* No data found code  */}

                        {users.length <= 0 && <Box sx={{ maxWidth: '100%', p: 3 }}>
                            <Grid container direction="column"
                                justifyContent="center"
                                alignItems="center">
                                <Grid item>
                                    <SentimentVeryDissatisfiedIcon fontSize="large" />
                                </Grid>
                                <Grid item>
                                    <h3 style={{ padding: 0 }}>No data found</h3>
                                </Grid>
                            </Grid>
                        </Box>}


                    </TableContainer>

                </Grid>
            </Grid>


            <Grid container sx={{ width: '100%' }} direction="row"
                justifyContent="center"
                alignItems="center">

                {/* Delete selected button */}

                <Grid item>
                    {selected.length > 0 ? (<Button variant="contained" size="large" shape="rounded" sx={{
                        bgcolor: blueGrey[900], color: blueGrey[100]

                    }} onClick={(e) => DeleteSelected(e)}>Delete selected</Button>) : <></>}
                </Grid>

                {/* Pagination Buttons*/}

                <Grid item>

                    {users.length > 0 && <Pagination count={Math.ceil((users.length) / (rowsPerPage))} variant="outlined" size="large" shape="rounded" showFirstButton showLastButton onChange={handleChangePage} />}
                </Grid>

            </Grid>

        </Box>

    );
}







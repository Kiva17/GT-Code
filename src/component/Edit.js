
import TableCell from '@mui/material/TableCell';
import { useState } from 'react';

// created this component ..if edit button is clicked  then it will show this component

function Edit({ value, flag, id, editedValue, setEditedValue }) {  
    const [value1, setValue1] = useState(value);


    // This function will store the edited values

    function Edit1(e) {
        let value2 = e.target.value
        setValue1(value2)

        let k = editedValue.find((x) => x["id"] === id)
        k[flag] = value2

        let k1 = editedValue.filter((x) => x["id"] !== id)
        k1.push(k)
        setEditedValue([...k1])

    }

    return (


        <TableCell><input type="text" name="name" value={value1}
            onChange={(e) => Edit1(e)} /></TableCell>

    )
}

export default Edit

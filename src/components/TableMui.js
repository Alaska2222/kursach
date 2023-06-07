import React, { useCallback, useMemo, useState, useEffect } from 'react';
import MaterialReactTable from 'material-react-table';
import Swal from "sweetalert2"
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { RiDeleteBin4Fill } from "react-icons/ri";
import {AiFillEdit} from "react-icons/ai"


const TableMui = () => {
    const token = window.localStorage.getItem('token')
    const decodedToken = atob(token);
    const [username] = decodedToken.split(':');
    let [marks, setMarks] = useState([])

    useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch(`http://127.0.0.1:5000/marks/${username}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          const data = await response.json();
          setMarks(data);
          
        } catch (error) {
          console.log(error);
        }
      }
      fetchData();
    }, []);
    
    
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
 
  const handleCreateNewRow = (values) => {
    marks.push(values);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      const data_sbmt = {
        MarkId: values.MarkId,
        StudentId: values.StudentId,
        SubjectId: values.SubjectId,
        TeacherId: username,
        DateId: values.DateId,
        Value: Number(values.Value),
      };
      const token = window.localStorage.getItem('token')
      const headers = new Headers();
      headers.set('Authorization', `Basic ${token}`)
      headers.set('content-type', 'application/json');
      const response = await fetch(
        `http://127.0.0.1:5000/teacher/${values.StudentId}/${values.MarkId}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(data_sbmt),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedMarks = [...marks];
      updatedMarks[row.index] = values;
      setMarks(updatedMarks);
      exitEditingMode();
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  
  const handleDeleteRow = useCallback(
    (row) => {
      const std = row._valuesCache.StudentId
      const id = row._valuesCache.MarkId
      Swal.fire({
        title: 'Are you sure you want to delete this mark?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#32CD32',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Mark was deleted!',
            'success'
          )
          .then(() => {
            const token = window.localStorage.getItem('token')
            const decodedToken = atob(token);
            const [username] = decodedToken.split(':');
            const headers = new Headers();
            headers.set('Authorization', `Basic ${token}`)
            headers.set('content-type', 'application/json');
            const options = {
              method: 'DELETE',
              headers,
            };
            fetch(`http://127.0.0.1:5000/teacher/${std}/${id}/${username}`, options)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                marks.splice(row.index, 1);
                setMarks([...marks]);
                
              });
          });
        }
      });
    },
    [marks]
  );
  

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
              cell.column.id === 'Value'
              ? validateValue(event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is not valid`,
            });
          } else {
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'MarkId',
        header: 'ID',
        enableColumnOrdering: false,
        enableEditing: false, 
        size: 50,
      },
      {
        accessorKey: 'StudentId',
        header: 'Student ID',
        enableEditing: false,
        
      },
      
      {
        accessorKey: 'SubjectId',
        header: 'Subject',
        enableEditing: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'Value',
        header: 'Mark',
        size: 50,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'DateId',
        header: 'Date',
        size: 50,
        
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'date',
        }),
      },
    ],
    [getCommonEditTextFieldProps],
  );


  
  
  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 50,
          },
        }}
        columns={columns}
        data={marks}
        editingMode="modal" 
        muiTablePaginationProps={{
          rowsPerPageOptions: [5, 10, 15],
          showFirstButton: false,
          showLastButton: false,
        }}
        enableDensityToggle={false}
        enableFullScreenToggle={false}
        enableColumnOrdering
        enableEditing
        enableStickyHeader
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        muiTableHeadCellProps={{
        sx: {
          background:"rgba(41, 124, 219, 0.575)"
        },
      }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <span>
                <AiFillEdit size={25} onMouseOver={({target})=>target.style.color="grey"}
                                          onMouseOut={({target})=>target.style.color="black"}
                                          onClick={() => table.setEditingRow(row)}>
                  <Edit />
                </AiFillEdit>
              </span>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <span>
                <RiDeleteBin4Fill color="rgba(239, 64, 64, 0.875)" size={22} 
                onMouseOver={({target})=>target.style.color="rgba(124, 3, 3, 0.875)"}
                onMouseOut={({target})=>target.style.color="rgba(239, 64, 64, 0.875)"}
                onClick={() => handleDeleteRow(row)}>
                  <Delete />
                </RiDeleteBin4Fill>
              </span>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          
          <Button
            onMouseOver={({target})=>target.style.background="#555"}
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
            sx={
          {
            background: '#555',
            borderRadius: "10rem", 
           }
        }
          >
          Add Grade
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
/>
    </>
  );
};

export const CreateNewAccountModal = ({ open, columns, onClose }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      if (column.accessorKey === "Value" || column.accessorKey === "DateId" || column.accessorKey === "StudentId") {
        acc[column.accessorKey] = '';
      }
      return acc;
    }, {}),
  );

  let [marks, setMarks] = useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const token = window.localStorage.getItem('token')
        const decodedToken = atob(token);
        const [username] = decodedToken.split(':');
        const response = await fetch(`http://127.0.0.1:5000/marks/`+ username , {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        setMarks(data);
        
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
const subject = marks.length > 0 ? marks[0].SubjectId : null;

const handleSubmit = async () => {
  const token = window.localStorage.getItem('token')
  const decodedToken = atob(token);
  const [username] = decodedToken.split(':');

  const data_sbmt = {
    StudentId: values.StudentId,
    SubjectId: subject,
    TeacherId: username,
    DateId: values.DateId,
    Value: Number(values.Value),
  };

  try {
    const token = window.localStorage.getItem('token')
    const headers = new Headers();
    headers.set('Authorization', `Basic ${token}`)
    headers.set('content-type', 'application/json');
    const response = await fetch('http://127.0.0.1:5000/teacher', {
      method: 'POST',
      headers,
      body: JSON.stringify(data_sbmt),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    if (response.ok) {
      onClose();
      Swal.fire(
      'Success!',
      'Mark was added!',
      'success'
    );
    }
    
  } catch (error) {
    console.error('Error:', error);
    
  }

};

let [result, setResult] = useState([])
    useEffect(() => {
      const token = window.localStorage.getItem('token')
      const headers = new Headers();
      headers.set('Authorization', `Basic ${token}`)
      headers.set('content-type', 'application/json')
      fetch('http://127.0.0.1:5000/students', {
        method: 'GET',
        headers,
      })
    .then((response)=>{
         return response.json(); 
     })
    .then((data)=>{
      setResult(data.map(item => item.StudentId))
     })
    .catch(err => console.log(err))
     }, [])
  return (
    <Dialog open={open}>
    <DialogContent>
      <form onSubmit={(e) => e.preventDefault()}>
        <Stack
          sx={{
            width: '50%',
            minWidth: { xs: '300px', sm: '360px', md: '400px' },
            gap: '1.5rem',
          }}
        >
          {columns
            .filter((column) => ['Value', 'DateId', 'StudentId'].includes(column.accessorKey))
            .map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                type={column.accessorKey === 'DateId' ? 'date' : 'text'}
                InputLabelProps={
                  column.accessorKey === 'DateId' ? { shrink: true } : {}
                }
                select={column.accessorKey === 'StudentId'}
              >
                {column.accessorKey === 'StudentId' &&
                result.map((user) => (
                    <MenuItem key={user} value={user}>
                      {user}
                    </MenuItem>
                  ))}
              </TextField>
            ))}
        </Stack>
      </form>
    </DialogContent>
    <DialogActions sx={{ p: '1.25rem' }}>
      <Button
        onClick={onClose}
        variant='outlined'
        sx={{ borderRadius: '10rem' }}
      >
        Cancel
      </Button>
      <Button
        color='success'
        onClick={handleSubmit}
        variant='contained'
        sx={{ borderRadius: '10rem' }}
      >
        Submit
      </Button>
    </DialogActions>
  </Dialog>
  
  );
};

const validateRequired = (value) => !!value.length;
const validateValue = (value) => value >= 0

export default TableMui;

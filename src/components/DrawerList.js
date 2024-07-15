import { AppBar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Select, Toolbar, Typography } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import { Input } from '@mui/material'
import axios from 'axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function DrawerList() {
    const [input, setInput] = useState({})
    const [countryList, setCountryList] = useState([])
    const [open, setOpen] = useState(false)
    const [registerOpen, setRegisterOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const [navOpen, setNavOpen] = useState(false)

    const toggleDrawer = (newOpen) => () => {
        setNavOpen(newOpen)
    }

    const inputChange = (event) => {
        const { name, value } = event.target

        setInput({
            ...input,
            [name]: value
        })
    }

    const authClick = (event) => {
        event.preventDefault()
        axios.post('http://localhost:8000/users/login', {
            username: input.username,
            password: input.password
        }).then(result => {
            window.localStorage.setItem('token', result.data.token)
            setOpen(false)
        })
    }

    const regisClick = (event) => {
        event.preventDefault()
        axios.post('http://localhost:8000/users/newuser', {
            username: input.reg_username,
            password: input.reg_password,
            age: input.reg_age,
            country: input.reg_country
        }).then(result => {
            setRegisterOpen(false)
        })
    }

    const sideBar = (
        <Box sx={{ width: 250 }} role="presentation">
            <List>
                {!window.localStorage.getItem('token') ?
                    <>
                        <ListItem key={1} disablePadding onClick={() => setOpen(true)}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <LoginIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Login'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={1} disablePadding onClick={() => setRegisterOpen(true)}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PersonAddIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Register'} />
                            </ListItemButton>
                        </ListItem>
                    </>
                    :
                    <ListItem key={1} disablePadding onClick={() => {
                        window.localStorage.removeItem('token')
                        window.location.reload()
                    }}>
                        <ListItemButton>
                            <ListItemIcon>
                                <LoginIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Logout'} />
                        </ListItemButton>
                    </ListItem>
                }
            </List>
            <Divider />
            <List>
                <ListItem key={'version'} disablePadding>
                    <ListItemButton>
                        <ListItemText primary={'v. dev-0.1'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    )

    useEffect(() => {
        axios.get('http://localhost:8000/setting/getallcountries')
            .then(result => {
                setCountryList(result.data)
            })
    }, [])
    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Chat with Ants
                        </Typography>
                        {!window.localStorage.getItem('token') ?
                            <Button color='inherit' onClick={handleOpen}>Login</Button>
                            :
                            <Button color='inherit' onClick={() => {
                                window.localStorage.removeItem('token')
                                window.location.reload()
                            }}
                            >Logout</Button>
                        }
                    </Toolbar>
                </AppBar>
            </Box>

            {/* sideBard */}
            <Drawer open={navOpen} onClose={toggleDrawer(false)}>
                {sideBar}
            </Drawer>
            {/* login */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form onSubmit={authClick}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Login
                        </Typography>

                        <div>
                            username
                        </div>
                        <Input className='w-100' name="username" onChange={inputChange} />
                        <div>password</div>
                        <Input className='w-100' name='password' type='password' onChange={inputChange} />
                        <hr />
                        <Button type='submit'>Login</Button>
                    </form>
                </Box>
            </Modal>
            {/* register */}
            <Modal
                open={registerOpen}
                onClose={() => setRegisterOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form onSubmit={regisClick}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Register
                        </Typography>

                        <div>
                            username
                        </div>
                        <Input className='w-100' name="reg_username" onChange={inputChange} />
                        <div>password</div>
                        <Input className='w-100' name='reg_password' type='password' onChange={inputChange} />
                        <div>age</div>
                        <Input className='w-100' type='number' name='reg_age' onChange={inputChange} />
                        <div>country</div>
                        <Select className='w-100' type='select' name='reg_country' onChange={inputChange}>
                            {countryList?.map(x => (
                                <option value={x.id}>{x.country_name}</option>
                            ))}
                        </Select>
                        <hr />
                        <Button type='submit'>Register</Button>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

export default DrawerList
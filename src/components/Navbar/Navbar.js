/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { AppBar, Avatar, Button, Typography, Box, Toolbar, Container } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import decode from "jwt-decode";
import { useLocation, Link, useNavigate } from "react-router-dom";
import * as style from "./styles.js";
import * as api from "../../api/index.js";

const Navbar = () => {
	let user = JSON.parse(localStorage.getItem("user"));
	const navigate = useNavigate();
	const location = useLocation();
	const [useravatar, setUserAvatar] = useState(null);
	const [anchorElNav, setAnchorElNav] = useState(null);

	/* Initialize user avatar */
	useEffect(() => {
		user = JSON.parse(localStorage.getItem("user"));
		if (!user) setUserAvatar("");
		if (location.pathname === "/home") {
			const func = async () => {
				try {
					if (user) {
						const result = await api.getUser("1");
						setUserAvatar(`${result.data.result.avatar}`);
					} else {
						setUserAvatar("");
					}
				} catch (error) {
					console.log(error);
				}
			};
			func();
		}
	}, [location]);

	/* Log the user out when token expired */
	useEffect(() => {
		const token = user?.token;
		if (token) {
			const decodedToken = decode(token);
			if (decodedToken.exp * 1000 < new Date().getTime()) {
				localStorage.clear();
				window.alert("Session expired\nPlease login again");
				navigate("/home");
			}
		}
	}, [location]);

	const handleOpenNavMenu = (e) => {
		setAnchorElNav(e.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleLogout = () => {
		localStorage.removeItem("user");
		sessionStorage.clear();
		navigate("/home");
	};

	const handleToUserpage = () => {
		if (location.pathname !== "/userpage") navigate("/userpage");
	};

	const handleToHomepage = () => {
		if (location.pathname !== "/") navigate(`/`);
	};

	const handleToAuth = () => {
		if (location.pathname !== "/auth") navigate("/auth");
	};

	return (
		<AppBar elevation={0}>
			<Container maxWidth='lg'>
				<Toolbar disableGutters>
					{/* 
						Navbar for md breakpoint
					 */}

					<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
						<Box
							sx={[style.titleContainer, { display: { xs: "none", md: "flex" }, width: "49%" }]}
							onClick={handleToHomepage}
						>
							<Typography
								sx={[
									style.title,
									{
										display: { xs: "none", md: "flex" },
									},
								]}
								variant='h4'
							>
								ExpenseTracker
							</Typography>
						</Box>
					</Box>

					<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "space-around" }}>
						{user ? (
							<>
								<Box sx={style.userInfo}>
									<Avatar alt={user?.username} src={useravatar}>
										{user?.username.charAt(0)}
									</Avatar>
								</Box>
								<Box sx={style.userInfo}>
									<Typography variant='h6' sx={style.userName}>
										{user?.username}
									</Typography>
								</Box>
								<Box sx={style.buttonContainer}>
									<Button sx={style.button} variant='contained' color='secondary' onClick={handleLogout}>
										Logout
									</Button>
									<Button sx={style.button} variant='contained' color='secondary' onClick={handleToUserpage}>
										User page
									</Button>
								</Box>
							</>
						) : (
							<Box sx={style.buttonContainer}>
								<Button sx={style.button} variant='contained' color='secondary' onClick={handleToAuth}>
									Sign in
								</Button>
							</Box>
						)}
					</Box>

					{/* 
						Navbar for xs breakpoint
					 */}

					<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
						<IconButton
							size='large'
							aria-label='account of current user'
							aria-controls='menu-appbar'
							aria-haspopup='true'
							onClick={handleOpenNavMenu}
							color='inherit'
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id='menu-appbar'
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: "block", md: "none" },
							}}
						>
							<MenuItem
								key='userpage'
								onClick={() => {
									handleCloseNavMenu();
									handleToUserpage();
								}}
							>
								<Typography textAlign='center'>User Page</Typography>
							</MenuItem>
							<MenuItem
								key='logout'
								onClick={() => {
									handleCloseNavMenu();
									handleLogout();
								}}
							>
								<Typography textAlign='center'>Logout</Typography>
							</MenuItem>
						</Menu>
					</Box>
					<Box
						component={Link}
						to='/'
						sx={[{ flexGrow: 1, display: { xs: "flex", md: "none" } }, style.titleContainer]}
					>
						<Typography
							variant='h5'
							sx={[
								style.title,
								{
									display: { xs: "flex", md: "none" },
								},
							]}
						>
							ExpenseTracker
						</Typography>
					</Box>
					<Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" }, justifyContent: "space-around" }}>
						{user ? (
							<Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
								<Avatar alt={user?.username} src={useravatar}>
									{user?.username.charAt(0)}
								</Avatar>
							</Box>
						) : (
							<Button
								sx={style.button}
								variant='contained'
								color='secondary'
								onClick={() => {
									navigate("/auth");
								}}
							>
								Sign in
							</Button>
						)}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Navbar;

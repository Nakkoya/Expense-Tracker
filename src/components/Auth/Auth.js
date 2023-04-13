import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Paper, Grid, Typography, Container, TextField, Box, CircularProgress } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import * as api from "../../api/index";
import * as style from "./styles.js";
import {
	EMPTY_USERNAME,
	EMPTY_PASSWORD,
	USERNAME_ALREADY_TAKEN,
	USERNAME_TOO_LONG,
	PASSWORD_NOT_MATCHED,
	PASSWORD_TOO_SHORT,
	BOTH_EMPTY,
	INCORRECT_PASSWORD,
	USERNAME_NOT_FOUND,
} from "../../Constants";

const Auth = () => {
	const navigate = useNavigate();
	const [isSignup, setIsSignup] = useState(false);
	const [errorType, setErrorType] = useState(0);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		confirmPassword: "",
	});
	const [waiting, setWaiting] = useState(false);
	const user = JSON.parse(localStorage.getItem("user"));

	const handleSubmit = async (e) => {
		if (!waiting) {
			setWaiting((prev) => !prev);
			e.preventDefault();
			if (isSignup) {
				const { data } = await api.signUp(formData);
				switch (data.result) {
					case BOTH_EMPTY:
						setErrorType(BOTH_EMPTY);
						break;
					case EMPTY_USERNAME:
						setErrorType(EMPTY_USERNAME);
						break;
					case EMPTY_PASSWORD:
						setErrorType(EMPTY_PASSWORD);
						break;
					case USERNAME_TOO_LONG:
						setErrorType(USERNAME_TOO_LONG);
						break;
					case PASSWORD_TOO_SHORT:
						setErrorType(PASSWORD_TOO_SHORT);
						break;
					case PASSWORD_NOT_MATCHED:
						setErrorType(PASSWORD_NOT_MATCHED);
						break;
					case USERNAME_ALREADY_TAKEN:
						setErrorType(USERNAME_ALREADY_TAKEN);
						break;
					default:
						localStorage.setItem("user", JSON.stringify({ ...data.result }));
						sessionStorage.clear();
						sessionStorage.setItem("signup", JSON.stringify({ signup: true }));
						navigate("/auth/initavatar");
						break;
				}
			} else {
				const { data } = await api.signIn(formData);
				switch (data.result) {
					case BOTH_EMPTY:
						setErrorType(BOTH_EMPTY);
						break;
					case EMPTY_USERNAME:
						setErrorType(EMPTY_USERNAME);
						break;
					case EMPTY_PASSWORD:
						setErrorType(EMPTY_PASSWORD);
						break;
					case USERNAME_NOT_FOUND:
						setErrorType(USERNAME_NOT_FOUND);
						break;
					case INCORRECT_PASSWORD:
						setErrorType(INCORRECT_PASSWORD);
						break;
					default:
						sessionStorage.clear();
						localStorage.setItem("user", JSON.stringify({ ...data.result }));
						navigate("/home");
						break;
				}
			}
			setWaiting((prev) => !prev);
		}
	};

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleSwitch = () => {
		setFormData({
			username: "",
			password: "",
			confirmPassword: "",
		});
		setIsSignup((prev) => !prev);
		setErrorType(0);
	};

	const handleText = (errorType, inputType) => {
		if (inputType === "password") {
			switch (errorType) {
				case BOTH_EMPTY:
				case EMPTY_PASSWORD:
					return "Please input a password";
				case PASSWORD_TOO_SHORT:
					return "Password must contains at least 8 characters";
				case PASSWORD_NOT_MATCHED:
					return "Passwords are not matched";
				case INCORRECT_PASSWORD:
					return "Incorrect password";
				default:
					break;
			}
		} else if (inputType === "username") {
			switch (errorType) {
				case BOTH_EMPTY:
				case EMPTY_USERNAME:
					return "Please input a username";
				case USERNAME_TOO_LONG:
					return "Username cannot exceed 16 characters";
				case USERNAME_ALREADY_TAKEN:
					return "Username already exists";
				case USERNAME_NOT_FOUND:
					return "Username not found";
				default:
					break;
			}
		}
	};

	return (
		<>
			{user && <Navigate to='/home' replace={true} />}
			{/* prevent user from entering this page when logged in */}

			<Container maxWidth={"sm"} sx={style.authContainer}>
				<Paper elevation={3}>
					<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
						<Grid container justifyContent='center' flexDirection='column' alignItems='center'>
							<Typography variant='h5'>{isSignup ? "Sign Up" : "Sign In"}</Typography>
							<form onSubmit={handleSubmit}>
								<Box
									sx={{
										display: "flex",
										justifyContent: "center",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<TextField
										error={
											errorType === BOTH_EMPTY ||
											errorType === EMPTY_USERNAME ||
											errorType === USERNAME_ALREADY_TAKEN ||
											errorType === USERNAME_NOT_FOUND ||
											errorType === USERNAME_TOO_LONG
										}
										helperText={handleText(errorType, "username")}
										id='username'
										label='Username'
										variant='outlined'
										value={formData.username}
										onChange={(e) => {
											setFormData({
												...formData,
												username: e.target.value,
											});
										}}
										sx={style.textField}
									/>
									<TextField
										error={
											errorType === BOTH_EMPTY ||
											errorType === EMPTY_PASSWORD ||
											errorType === PASSWORD_NOT_MATCHED ||
											errorType === PASSWORD_TOO_SHORT ||
											errorType === INCORRECT_PASSWORD
										}
										helperText={handleText(errorType, "password")}
										id='password'
										label='Password'
										variant='outlined'
										type={showPassword ? "text" : "password"}
										value={formData.password}
										onChange={(e) => {
											setFormData({
												...formData,
												password: e.target.value,
											});
										}}
										InputProps={{
											endAdornment: (
												<InputAdornment position='end'>
													<IconButton
														aria-label='toggle password visibility'
														onClick={handleClickShowPassword}
														onMouseDown={handleMouseDownPassword}
														edge='end'
													>
														{showPassword ? <VisibilityOff /> : <Visibility />}
													</IconButton>
												</InputAdornment>
											),
										}}
										sx={style.textField}
									/>
									{isSignup && (
										<TextField
											id='confirmPassword'
											label='Confirm Password'
											variant='outlined'
											value={formData.confirmPassword}
											type={showPassword ? "text" : "password"}
											onChange={(e) => {
												setFormData({
													...formData,
													confirmPassword: e.target.value,
												});
											}}
											sx={style.textField}
										/>
									)}
									{!waiting ? (
										<Button variant='contained' type='submit'>
											Submit
										</Button>
									) : (
										<CircularProgress />
									)}
								</Box>
								<Grid container justifyContent='flex-end' alignItems='center'>
									<Grid>
										<Typography>
											{isSignup ? "Already have an account?" : "Don't have an account?"}
										</Typography>
									</Grid>
									<Grid>
										<Button onClick={handleSwitch} color='primary'>
											{isSignup ? "Sign In" : "Sign Up"}
										</Button>
									</Grid>
								</Grid>
							</form>
						</Grid>
					</Box>
				</Paper>
			</Container>
		</>
	);
};

export default Auth;

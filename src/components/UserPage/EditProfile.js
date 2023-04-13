/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
	Button,
	Paper,
	Typography,
	TextField,
	Container,
	Card,
	CardMedia,
	Box,
	CardContent,
	IconButton,
	Tooltip,
} from "@mui/material";
import * as api from "../../api/index.js";
import Resizer from "react-image-file-resizer";
import defaultAvatar from "../../assets/default.jpg";
import { USERNAME_ALREADY_TAKEN, USERNAME_TOO_LONG, NO_ERROR, EMPTY_USERNAME, FILE_TOO_LARGE } from "../../Constants.js";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import * as style from "./styles.js";

const EditProfile = () => {
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem("user"));
	const [file, setFile] = useState({
		base64: null,
		base64Full: null,
		preview: "",
	});
	const [editName, setEditName] = useState(false);
	const [newName, setNewName] = useState(user?.username);
	const [errorType, setErrorType] = useState(NO_ERROR);

	//Init file/avatarFull state
	useEffect(() => {
		const func = async () => {
			try {
				let result = await api.getUser("2");
				setFile((prev) => ({
					...prev,
					base64Full: `${result.data.result.avatarFull}`,
					preview: `${result.data.result.avatarFull}`,
				}));
				result = await api.getUser("1");
				setFile((prev) => ({
					...prev,
					base64: `${result.data.result.avatar}`,
				}));
			} catch (error) {
				console.log(error);
			}
		};
		func();
	}, []);

	const resizeFile = (file) =>
		new Promise((resolve) => {
			Resizer.imageFileResizer(
				file,
				60,
				60,
				"JPEG",
				100,
				0,
				(uri) => {
					resolve(uri);
				},
				"base64",
				60,
				60
			);
		});

	const resizeFullFile = (file) =>
		new Promise((resolve) => {
			Resizer.imageFileResizer(
				file,
				256,
				256,
				"JPEG",
				100,
				0,
				(uri) => {
					resolve(uri);
				},
				"base64",
				256,
				256
			);
		});

	//Setup for dropzone
	const { getRootProps, getInputProps } = useDropzone({
		multiple: false,
		accept: {
			"image/jpeg": [".jpeg", ".png"],
		},
		maxSize: 20 * 1024 * 1024, //20MB
		onDrop: (acceptedFile) => {
			acceptedFile.forEach(async (file) => {
				try {
					const resizedFull = await resizeFullFile(file);
					const resized = await resizeFile(file);
					const f = {
						base64: resized,
						base64Full: resizedFull,
						preview: URL.createObjectURL(file),
					};
					setFile(f);
				} catch (error) {
					console.log(error);
				}
				URL.revokeObjectURL(file.preview);
			});
		},
	});

	const handleText = (errorType) => {
		switch (errorType) {
			case EMPTY_USERNAME:
				return "Please input a username";
			case USERNAME_TOO_LONG:
				return "Username cannot exceed 16 characters";
			case USERNAME_ALREADY_TAKEN:
				return "This username has already been taken";
			default:
				break;
		}
	};

	const handleSubmit = async () => {
		if (window.confirm("Confirm update?")) {
			const { data } = await api.editUser({
				newUsername: newName,
				newAvatar: { normal: file.base64, full: file.base64Full },
			});
			switch (data.result) {
				case FILE_TOO_LARGE:
					window.alert("File size is too large");
					break;
				case EMPTY_USERNAME:
					setErrorType(EMPTY_USERNAME);
					break;
				case USERNAME_TOO_LONG:
					setErrorType(USERNAME_TOO_LONG);
					break;
				case USERNAME_ALREADY_TAKEN:
					setErrorType(USERNAME_ALREADY_TAKEN);
					break;
				default:
					setErrorType(NO_ERROR);
					localStorage.setItem(
						"user",
						JSON.stringify({
							...user,
							username: newName,
						})
					);
					navigate("/home");
					break;
			}
		}
	};

	const handlePreview = () => {
		return file.preview ? file.preview : defaultAvatar;
	};

	return (
		<>
			{!user && <Navigate to='/auth' replace={true} />}
			{/* Redirect to signin page if not logged in */}

			{user && (
				<Container maxWidth='lg'>
					<Card sx={style.card}>
						<CardMedia
							component='img'
							sx={style.cardMedia}
							src={file.preview !== "" ? handlePreview() : defaultAvatar}
							alt='avatar'
						/>
						<Box sx={{ display: "flex", flexDirection: "column" }}>
							<CardContent sx={{ flex: "1" }}>
								{editName ? (
									<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
										<TextField
											error={
												errorType === EMPTY_USERNAME ||
												errorType === USERNAME_TOO_LONG ||
												errorType === USERNAME_ALREADY_TAKEN
											}
											helperText={handleText(errorType)}
											id='username'
											label='New Username'
											variant='outlined'
											value={newName}
											onChange={(e) => {
												setNewName(e.target.value);
											}}
										/>
										<IconButton
											aria-label='cancel'
											size='medium'
											onClick={() => {
												setEditName(false);
												setNewName(`${user?.username}`);
											}}
										>
											<CloseIcon />
										</IconButton>
									</Box>
								) : (
									<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
										<Typography component='div' sx={{ fontSize: { xs: 16, md: 30 } }}>
											{user?.username}
										</Typography>
										<Tooltip title='Edit username' placement='right'>
											<IconButton
												aria-label='edit username'
												size='medium'
												onClick={() => setEditName(true)}
											>
												<EditIcon />
											</IconButton>
										</Tooltip>
									</Box>
								)}
							</CardContent>
							<Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
								<Button
									variant='contained'
									onClick={() => {
										setFile({
											base64: "",
											base64Full: "",
											preview: "",
										});
									}}
									sx={{ mr: 2 }}
								>
									Remove avatar
								</Button>
								<Button variant='contained' onClick={handleSubmit}>
									Update
								</Button>
							</Box>
						</Box>
					</Card>
					<Paper elevation={0} sx={style.dropzoneContainer}>
						<div {...getRootProps()}>
							<input {...getInputProps()} />
							<Typography sx={style.dropzone}>
								Drag and drop file here, or click to select file(max size: 20MB)
							</Typography>
						</div>
					</Paper>
				</Container>
			)}
		</>
	);
};

export default EditProfile;

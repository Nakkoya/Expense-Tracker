import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Box, Button, Card, CardContent, CardMedia, Container, Paper, Typography } from "@mui/material";
import * as api from "../../api/index.js";
import * as style from "./styles.js";
import Resizer from "react-image-file-resizer";
import defaultAvatar from "../../assets/default.jpg";

const FirstSetAvatar = () => {
	const isPermitted = JSON.parse(sessionStorage.getItem("signup"))?.signup;
	const navigate = useNavigate();
	const [file, setFile] = useState({
		base64: null,
		base64Full: null,
		preview: "",
	});
	const user = JSON.parse(localStorage.getItem("user"));

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

	const handleSubmit = async () => {
		const { data } = await api.editUser({
			newUsername: user?.username,
			newAvatar: { normal: file.base64, full: file.base64Full },
		});
		switch (data.result) {
			case "0":
				window.alert("File size is too large");
				break;
			default:
				sessionStorage.removeItem("signup");
				navigate("/home");
				break;
		}
	};

	const handleSkip = () => {
		sessionStorage.removeItem("signup");
		navigate("/");
	};

	const handlePreview = () => {
		return file.preview ? file.preview : defaultAvatar;
	};

	return (
		<>
			{!isPermitted && <Navigate to='/error' replace={true} />}
			{/* prevent user from entering this page when not signing up the first time */}

			{isPermitted && (
				<Container maxWidth='md'>
					<Card sx={style.card}>
						<CardMedia
							component='img'
							sx={style.cardMedia}
							src={file.preview !== "" ? handlePreview() : defaultAvatar}
							alt='avatar'
						/>
						<Box sx={{ display: "flex", flexDirection: "column" }}>
							<CardContent sx={{ flex: "1" }}>
								<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
									<Typography component='div' sx={{ fontSize: { xs: 16, md: 30 } }}>
										Upload an avatar now!
									</Typography>
								</Box>
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
							</Box>
						</Box>
					</Card>
					<Paper elevation={0} sx={style.dropzoneContainer}>
						<div {...getRootProps()}>
							<input {...getInputProps()} />
							<Typography sx={style.dropzone}>
								Drag and drop file here, or click to select file(max size: 10MB)
							</Typography>
						</div>
					</Paper>
					<Button variant='contained' onClick={handleSubmit}>
						Submit
					</Button>
					<Button variant='outlined' onClick={handleSkip}>
						Skip
					</Button>
				</Container>
			)}
		</>
	);
};

export default FirstSetAvatar;

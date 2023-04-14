import React, { useState, useEffect } from "react";
import {
	TableCell,
	TableRow,
	IconButton,
	Collapse,
	Table,
	TableBody,
	Avatar,
	CircularProgress,
	Box,
	Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import * as api from "../../api/index.js";

const ExpenseTableRow = ({ data }) => {
	const [open, setOpen] = useState(false);
	const [useravatar, setUserAvatar] = useState(null);

	useEffect(() => {
		const func = async () => {
			try {
				if (data._id !== "") {
					const result = await api.getUser("1", data._id);
					setUserAvatar(`${result.data.result.avatar}`);
				} else {
					setUserAvatar("");
				}
			} catch (error) {
				console.log(error);
			}
		};
		func();
	}, []);

	return (
		<>
			{useravatar === null ? (
				<TableRow>
					<TableCell>
						<CircularProgress />
					</TableCell>
				</TableRow>
			) : (
				<>
					<TableRow
						sx={{
							"&:last-child td, &:last-child th": {
								border: 0,
							},
						}}
					>
						<TableCell sx={{ border: "solid 0px", maxWidth: "0px" }}>
							{data.description !== "" && (
								<IconButton aria-label='expand row' size='small' onClick={() => setOpen((prev) => !prev)}>
									{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
								</IconButton>
							)}
						</TableCell>
						<TableCell align='justify' sx={{ border: "solid 0px" }}>
							<Box sx={{ display: "flex", alignItems: "center" }}>
								{data._id !== "" && (
									<Avatar alt={data.user} src={useravatar}>
										{data.user.charAt(0)}
									</Avatar>
								)}
								<Typography ml={2}>{data.user}</Typography>
							</Box>
						</TableCell>
						<TableCell align='justify' sx={{ border: "solid 0px" }}>{`$${data.amount}`}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell colSpan={6} sx={{ border: "solid 0px", paddingBottom: 0, paddingTop: 0 }}>
							<Collapse in={open} timeout='auto' unmountOnExit>
								<Table size='small' aria-label='description'>
									<TableBody>
										<TableRow>
											<TableCell align='justify' sx={{ border: "solid 0px" }}>
												{`Description: ${data.description}`}
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</Collapse>
						</TableCell>
					</TableRow>
				</>
			)}
		</>
	);
};

export default ExpenseTableRow;

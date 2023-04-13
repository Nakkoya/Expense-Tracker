import React, { useState, useContext, useEffect } from "react";
import { TableCell, TableRow, IconButton, Collapse, Table, TableBody, Tooltip, Avatar, Box, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ExpenseContext } from "./EditPage";
import { NO_PERMISSION } from "../../Constants";
import { useNavigate } from "react-router-dom";
import * as api from "../../api/index.js";

const EditExpenseTableRow = ({ data }) => {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const expenseContext = useContext(ExpenseContext);
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

	const handleDelete = async () => {
		const param = data;
		if (window.confirm("Are you sure to remove this user?")) {
			await api.deleteExpenseUser(expenseContext.expenseid, {
				data: param,
			});
			const { data } = await api.getExpense(expenseContext.expenseid);
			if (data.result === NO_PERMISSION) navigate("/error"); // If deleted self
			expenseContext.setExpenseData(data.result);
		}
	};

	return (
		<>
			<TableRow
				sx={{
					"&:last-child td, &:last-child th": {
						border: 0,
					},
				}}
			>
				<TableCell sx={{ border: "solid 0px" }}>
					{data.description !== "" && (
						<IconButton aria-label='expand row' size='small' onClick={() => setOpen((prev) => !prev)}>
							{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					)}
				</TableCell>
				<TableCell component='th' scope='row' sx={{ border: "solid 0px" }}>
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
				<TableCell sx={{ border: "solid 0px" }}>
					<Tooltip title='Edit' placement='top'>
						<IconButton
							aria-label='edit'
							size='medium'
							onClick={() => {
								expenseContext.setEditType(1);
								expenseContext.setSelectedData(data);
							}}
						>
							<EditIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title='Delete user' placement='top'>
						<IconButton aria-label='delete-user' size='medium' onClick={handleDelete}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell sx={{ border: "solid 0px", paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
	);
};

export default EditExpenseTableRow;

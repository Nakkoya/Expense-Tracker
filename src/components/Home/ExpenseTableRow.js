import React, { useState } from "react";
import { TableCell, TableRow, IconButton, Collapse, Table, TableBody, Typography, Tooltip, Avatar, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ExpenseTableRow = ({ data, func }) => {
	const [open, setOpen] = useState(false);

	return (
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
							<Avatar alt={data.user} src={data.avatar}>
								{data.user.charAt(0)}
							</Avatar>
						)}
						<Typography ml={2}>{data.user}</Typography>
					</Box>
				</TableCell>
				<TableCell align='justify' sx={{ border: "solid 0px" }}>
					{`$${data.amount}`}
				</TableCell>
				<TableCell align='justify' sx={{ border: "solid 0px" }}>
					<Tooltip title='Delete user' placement='right'>
						<IconButton
							aria-label='delete user'
							size='medium'
							onClick={() =>
								func({
									username: data.user,
									_id: data._id,
									avatar: data.avatar,
								})
							}
						>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					{data.description !== "" && (
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
					)}
				</TableCell>
			</TableRow>
		</>
	);
};

export default ExpenseTableRow;

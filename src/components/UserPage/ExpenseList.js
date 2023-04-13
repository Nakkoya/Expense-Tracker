import React, { useState, useContext } from "react";
import { TableCell, TableRow, IconButton, Collapse, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ExpenseSubTable from "./ExpenseSubTable";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { UserPageContext } from "../UserPage/UserPage";
import parseDate from "../../utils/parseDate.js";

const ExpenseList = ({ data }) => {
	const userPageContext = useContext(UserPageContext);
	const navigate = useNavigate();
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
				<TableCell sx={{ border: "solid 0px" }}>
					<IconButton aria-label='expand row' size='small' onClick={() => setOpen((prev) => !prev)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component='th' scope='row' sx={{ border: "solid 0px" }}>
					{`${parseDate(data.createdAt)}`}
				</TableCell>
				<TableCell align='justify' sx={{ border: "solid 0px" }}>
					{data.event === "" ? "" : data.event}
				</TableCell>
				<TableCell align='justify' sx={{ border: "solid 0px" }}>
					<>
						<Tooltip title='Edit' placement='top'>
							<IconButton
								aria-label='edit'
								size='medium'
								onClick={() => {
									navigate(`/edit/expense?expenseid=${data._id}`);
								}}
							>
								<EditIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title='View Changelog' placement='top'>
							<IconButton
								aria-label='view changelog'
								size='medium'
								onClick={() => {
									userPageContext.setChangelogID(data._id);
									userPageContext.setOpenChangelog(true);
								}}
							>
								<AssignmentIcon />
							</IconButton>
						</Tooltip>
					</>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell sx={{ border: "solid 0px", paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout='auto' unmountOnExit>
						<ExpenseSubTable data={data} />
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

export default ExpenseList;

import React, { useContext, useState } from "react";
import {
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Table,
	Tooltip,
	IconButton,
	Button,
	Typography,
	TextField,
	Box,
	TableContainer,
	Paper,
} from "@mui/material";
import EditExpenseTableRow from "./EditExpenseTableRow";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { ExpenseContext } from "./EditPage";
import * as api from "../../api/index.js";
import { useLocation, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import * as style from "./styles.js";

const useQuery = () => {
	return new URLSearchParams(useLocation().search);
};

const EditExpenseTable = () => {
	const [editEvent, setEditEvent] = useState(false);
	const expenseContext = useContext(ExpenseContext);
	const query = useQuery();
	const expenseid = query.get("expenseid") || 0;
	const navigate = useNavigate();

	const handleDelete = async () => {
		if (window.confirm("Are you sure to delete this expense record?")) {
			await api.deleteExpense(expenseid);
			navigate("/userpage");
		}
	};

	const handleEditEvent = async () => {
		if (expenseContext.expenseData.event !== expenseContext.newEvent) {
			await api.editExpenseEvent(expenseContext.expenseid, {
				data: { newEvent: expenseContext.newEvent },
			});
			const { data } = await api.getExpense(expenseContext.expenseid);
			expenseContext.setExpenseData(data.result);
		}
	};

	const getTotal = () => {
		let total = 0;
		expenseContext.expenseData.userList.forEach((item) => {
			total += Number(item.amount);
		});
		return String(total);
	};

	return (
		<Box sx={style.leftBox}>
			{editEvent ? (
				<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
					<TextField
						id='event'
						label='Event'
						variant='filled'
						type='text'
						value={expenseContext.newEvent}
						onChange={(e) => {
							expenseContext.setNewEvent(e.target.value);
						}}
					/>
					<IconButton
						aria-label='update-event'
						size='medium'
						onClick={() => {
							handleEditEvent();
							setEditEvent(false);
						}}
					>
						<DoneIcon />
					</IconButton>
					<IconButton
						aria-label='cancel'
						size='medium'
						onClick={() => {
							setEditEvent(false);
							expenseContext.setNewEvent(expenseContext.expenseData.event);
						}}
					>
						<CloseIcon />
					</IconButton>
				</Box>
			) : (
				<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
					<Typography variant='h4' sx={style.typography}>
						{expenseContext.expenseData.event}
					</Typography>
					<Tooltip title='Edit expense event' placement='right'>
						<IconButton
							aria-label='edit expense event'
							size='medium'
							onClick={() => {
								setEditEvent(true);
							}}
						>
							<EditIcon />
						</IconButton>
					</Tooltip>
				</Box>
			)}
			<TableContainer component={Paper}>
				<Table aria-label='expense'>
					<TableHead>
						<TableRow>
							<TableCell align='justify'>
								<Tooltip title='Add user' placement='right'>
									<IconButton
										aria-label='add user'
										size='medium'
										onClick={() => {
											expenseContext.setEditType(2);
										}}
									>
										<PersonAddAlt1Icon />
									</IconButton>
								</Tooltip>
							</TableCell>
							<TableCell align='justify'>Name</TableCell>
							<TableCell align='justify'>Amount</TableCell>
							<TableCell>
								<Button variant='contained' onClick={handleDelete}>
									<>
										<Typography>Delete</Typography>
										<DeleteIcon />
									</>
								</Button>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{expenseContext.expenseData.userList.map((data) => (
							<EditExpenseTableRow data={data} key={data.user} />
						))}
						{expenseContext.expenseData.userList.length > 0 && (
							<TableRow>
								<TableCell colSpan={2} />
								<TableCell colSpan={2}>{`Total: $${getTotal()}`}</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default EditExpenseTable;

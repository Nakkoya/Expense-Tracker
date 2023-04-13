import React from "react";
import { TableHead, TableRow, TableCell, TableContainer, Paper, TableBody, Table } from "@mui/material";
import ExpenseTableRow from "./ExpenseTableRow";

const ExpenseTable = ({ data, func }) => {
	const getTotal = () => {
		let total = 0;
		data.userList.forEach((item) => {
			total += Number(item.amount);
		});
		return String(total);
	};
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 150 }} aria-label='expense'>
				<TableHead>
					<TableRow>
						<TableCell />
						<TableCell>User</TableCell>
						<TableCell align='justify' colSpan={2}>
							Amount
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.userList.map((data) => (
						<ExpenseTableRow data={data} key={data.user} func={func} />
					))}
					{data.userList.length > 0 && (
						<TableRow>
							<TableCell colSpan={2} />
							<TableCell>{`Total: $${getTotal()}`}</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default ExpenseTable;

import React from "react";
import { TableHead, TableRow, TableCell, TableContainer, Paper, TableBody, Table } from "@mui/material";
import ExpenseSubTableRow from "./ExpenseSubTableRow.js";

const ExpenseSubTable = ({ data }) => {
	const getTotal = () => {
		let total = 0;
		data.userList.forEach((item) => {
			total += Number(item.amount);
		});
		return String(total);
	};
	return (
		<TableContainer component={Paper} elevation={1}>
			<Table aria-label='expense'>
				<TableHead>
					<TableRow>
						<TableCell />
						<TableCell>Name</TableCell>
						<TableCell align='justify'>Amount</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.userList.map((data) => (
						<ExpenseSubTableRow data={data} key={data.user} />
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

export default ExpenseSubTable;

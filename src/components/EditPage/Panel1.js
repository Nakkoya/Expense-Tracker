import React, { useContext, useState } from "react";
import { ExpenseContext } from "./EditPage";
import { TextField, Button, Box, Typography } from "@mui/material";
import * as api from "../../api/index";
import * as style from "./styles.js";

const Panel1 = () => {
	const expenseContext = useContext(ExpenseContext);
	const [empty, setEmpty] = useState(false);

	const handleEdit = async () => {
		if (expenseContext.selectedData.amount === "") {
			setEmpty(true);
		} else {
			setEmpty(false);
			await api.editExpenseAmount(expenseContext.expenseid, {
				data: { expenseData: expenseContext.selectedData },
			});

			await api.editExpenseDesc(expenseContext.expenseid, {
				data: { expenseData: expenseContext.selectedData },
			});
			const { data } = await api.getExpense(expenseContext.expenseid);
			expenseContext.setExpenseData(data.result);
		}
	};

	return (
		<>
			<Typography variant='h5' sx={style.typography}>{`Editing ${expenseContext.selectedData.user}`}</Typography>
			<TextField
				error={empty}
				helperText={empty && "Please input an amount"}
				id='new-amount'
				label='New Amount'
				variant='filled'
				type='Number'
				value={expenseContext.selectedData.amount}
				onChange={(e) => {
					expenseContext.setSelectedData({
						...expenseContext.selectedData,
						amount: e.target.value,
					});
				}}
			/>
			<TextField
				id='new-description'
				label='New Description'
				variant='filled'
				type='Text'
				value={expenseContext.selectedData.description}
				onChange={(e) => {
					expenseContext.setSelectedData({
						...expenseContext.selectedData,
						description: e.target.value,
					});
				}}
			/>
			<Box sx={{ display: " flex", flexDirection: "row", justifyContent: "space-around", mt: 2 }}>
				<Button variant='contained' onClick={handleEdit}>
					confirm
				</Button>
				<Button
					variant='contained'
					onClick={() => {
						expenseContext.setEditType(0);
						expenseContext.setSelectedData(null);
					}}
				>
					Cancel
				</Button>
			</Box>
		</>
	);
};

export default Panel1;

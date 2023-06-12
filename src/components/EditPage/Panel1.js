import React, { useContext, useEffect, useState } from "react";
import { ExpenseContext } from "./EditPage";
import { TextField, Button, Box, Typography } from "@mui/material";
import * as api from "../../api/index";
import * as style from "./styles.js";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Panel1 = () => {
	const expenseContext = useContext(ExpenseContext);
	const [empty, setEmpty] = useState(false);
	const [oldAmount, setOldAmount] = useState(null);
	const [oldDesc, setOldDesc] = useState(null);
	const [openAlert, setOpenAlert] = useState(false);

	useEffect(() => {
		setOldAmount(expenseContext.selectedData.amount);
		setOldDesc(expenseContext.selectedData.description);
	}, []);

	const handleEdit = async () => {
		if (expenseContext.selectedData.amount === "") {
			setEmpty(true);
		} else {
			setEmpty(false);
			if (expenseContext.selectedData.amount !== oldAmount) {
				await api.editExpenseAmount(expenseContext.expenseid, {
					data: { expenseData: expenseContext.selectedData },
				});
			}
			if (expenseContext.selectedData.description !== oldDesc) {
				await api.editExpenseDesc(expenseContext.expenseid, {
					data: { expenseData: expenseContext.selectedData },
				});
			}
			if (expenseContext.selectedData.amount !== oldAmount || expenseContext.selectedData.description !== oldDesc) {
				try {
					const { data } = await api.getExpense(expenseContext.expenseid);
					expenseContext.setExpenseData(data.result);
					setOpenAlert(true);
				} catch (error) {
					console.log(error);
				}
			}
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
			<Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
				<Alert
					elevation={3}
					variant='filled'
					onClose={() => setOpenAlert(false)}
					severity='success'
					sx={{ width: "100%" }}
				>
					Updated!
				</Alert>
			</Snackbar>
		</>
	);
};

export default Panel1;

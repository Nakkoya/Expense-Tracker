import React, { useState, useEffect, createContext } from "react";
import EditExpenseTable from "./EditExpenseTable";
import * as api from "../../api/index.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Container } from "@mui/material";
import EditPanel from "./EditPanel";
import { NO_PERMISSION } from "../../Constants";

const useQuery = () => {
	return new URLSearchParams(useLocation().search);
};

export const ExpenseContext = createContext();

const EditPage = () => {
	const query = useQuery();
	const expenseid = query.get("expenseid") || 0;
	const navigate = useNavigate();
	const [expenseData, setExpenseData] = useState(null);
	const [selectedData, setSelectedData] = useState(null);
	const [newEvent, setNewEvent] = useState("");
	const [editType, setEditType] = useState(0); //0: Nothing, 1: amount, 2:add

	useEffect(() => {
		const func = async () => {
			const { data } = await api.getExpense(expenseid);
			if (data.result === NO_PERMISSION) navigate("/error"); //Only allow users that are participated in the event
			setExpenseData(data.result);
			setNewEvent(data.result.event);
		};
		func();
	}, []);

	return (
		<Container maxWidth='lg'>
			<Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
				{!expenseData && <CircularProgress />}
				{expenseData && (
					<ExpenseContext.Provider
						value={{
							expenseData: expenseData,
							setExpenseData: setExpenseData,
							editType: editType,
							setEditType: setEditType,
							selectedData: selectedData,
							setSelectedData: setSelectedData,
							expenseid: expenseid,
							newEvent: newEvent,
							setNewEvent: setNewEvent,
						}}
					>
						<EditExpenseTable />
						<EditPanel />
					</ExpenseContext.Provider>
				)}
			</Box>
		</Container>
	);
};

export default EditPage;

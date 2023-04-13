import React, { useContext } from "react";
import { ExpenseContext } from "./EditPage";
import { Box } from "@mui/material";
import Panel1 from "./Panel1";
import Panel2 from "./Panel2";
import * as style from "./styles.js";

const EditPanel = () => {
	const expenseContext = useContext(ExpenseContext);

	const panel = () => {
		switch (expenseContext.editType) {
			case 1:
				return <Panel1 />;
			case 2:
				return <Panel2 />;
			default:
				return <></>;
		}
	};

	return <Box sx={style.rightBox}>{panel()}</Box>;
};

export default EditPanel;

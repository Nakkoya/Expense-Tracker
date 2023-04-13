import React from "react";
import { CircularProgress, List, Paper, Box } from "@mui/material";
import ChangelogItem from "./ChangelogItem";
import * as style from "./styles.js";

const Changelog = ({ data, func }) => {
	return (
		<Box sx={{ padding: 0 }}>
			<Paper sx={{ borderRadius: 0 }} elevation={1}>
				<List sx={style.list}>
					{!data && <CircularProgress />}
					{data && data.map((item) => <ChangelogItem history={item} key={item.date} />)}
				</List>
			</Paper>
		</Box>
	);
};

export default Changelog;

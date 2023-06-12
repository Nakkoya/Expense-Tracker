import React, { useEffect, useRef, useState } from "react";
import { CircularProgress, List, Paper, Box } from "@mui/material";
import ChangelogItem from "./ChangelogItem";
import * as style from "./styles.js";
import * as api from "../../api/index.js";

const Changelog = ({ data }) => {
	let avatarList = useRef([]);
	let targetList = useRef([]);
	const [ready, setReady] = useState(false);
	useEffect(() => {
		const func = async () => {
			for (let i = 0; i < data.length; i++) {
				let item = data[i];
				if (!avatarList.current.some((item2) => item2.id === item.user)) {
					const { data } = await api.getUser("1", item.user);
					avatarList.current.push({
						user: `${data.result.username}`,
						avatar: `${data.result.avatar}`,
						id: item.user,
					});
				}
				if (!targetList.current.some((item2) => item2.id === item.target)) {
					if (item.target !== null && item.target?.substring(0, 12) !== "UNREGISTERED") {
						const { data } = await api.getUser("0", item.target);
						targetList.current.push({
							user: `${data.result.username}`,
							id: item.target,
						});
					}
				}
			}
			setReady(true);
		};
		func();
	}, []);

	return (
		<Box sx={{ padding: 0 }}>
			<Paper sx={{ borderRadius: 0 }} elevation={1}>
				<List sx={style.list}>
					{!ready && <CircularProgress />}
					{ready &&
						data.map((item) => {
							let historyData = {
								action: item.action,
								amount: item.amount,
								date: item.date,
								username: avatarList.current.find((item2) => item.user === item2.id)?.user,
								useravatar: avatarList.current.find((item2) => item.user === item2.id)?.avatar,
								targetname: item.target === null ? null : item.target.substring(0, 12) === "UNREGISTERED" ? item.target.substring(12, 16) : targetList.current.find((item2) => item.target === item2.id)?.user,
								reg: item.target === null ? null : item.target.substring(0, 12) === "UNREGISTERED" ? false : true,
							};
							return <ChangelogItem data={historyData} key={item.date} />;
						})}
				</List>
			</Paper>
		</Box>
	);
};

export default Changelog;

import React, { useEffect, useState } from "react";
import { ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import parseDate from "../../utils/parseDate.js";
import * as api from "../../api/index.js";

const ChangelogItem = ({ history }) => {
	const [historyData, setHistoryData] = useState({
		username: "",
		useravatar: "",
		targetname: "",
	});
	const [reg, setReg] = useState(true);

	useEffect(() => {
		const func = async () => {
			try {
				const { data } = await api.getUser("1");
				setHistoryData((prev) => ({
					...prev,
					username: `${data.result.username}`,
					useravatar: `${data.result.avatar}`,
				}));
				if (history.target && history.target.substring(0, 12) !== "UNREGISTERED") {
					const { data } = await api.getUser("0", history.target);
					setHistoryData((prev) => ({
						...prev,
						targetname: `${data.result.username}`,
					}));
				} else if (history.target && history.target.substring(0, 12) === "UNREGISTERED") {
					setHistoryData((prev) => ({
						...prev,
						targetname: history.target.substring(12, 16),
					}));
					setReg(false);
				}
			} catch (error) {
				console.log(error);
			}
		};
		func();
	}, []);

	switch (history.action) {
		// 0: create, 1: adduser, 2: deluser, 3: edit amount, 4: edit desc, 5: edit main desc
		case "0":
			return (
				<ListItem>
					<ListItemAvatar>
						<Avatar alt={historyData.username} src={historyData.useravatar}>
							{historyData.username.charAt(0)}
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={`${historyData.username} created this expense record`}
						secondary={parseDate(history.date)}
					/>
				</ListItem>
			);
		case "1":
			return (
				<ListItem>
					<ListItemAvatar>
						<Avatar alt={historyData.username} src={historyData.useravatar}>
							{historyData.username.charAt(0)}
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={`${historyData.username} added ${
							reg ? historyData.targetname : historyData.targetname + "(unregistered)"
						} with $${history.amount}`}
						secondary={parseDate(history.date)}
					/>
				</ListItem>
			);
		case "2":
			return (
				<ListItem>
					<ListItemAvatar>
						<Avatar alt={historyData.username} src={historyData.useravatar}>
							{historyData.username.charAt(0)}
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={`${historyData.username} removed ${
							reg ? historyData.targetname : historyData.targetname + "(unregistered)"
						} with $${history.amount}`}
						secondary={parseDate(history.date)}
					/>
				</ListItem>
			);
		case "3":
			return (
				<ListItem>
					<ListItemAvatar>
						<Avatar alt={historyData.username} src={historyData.useravatar}>
							{historyData.username.charAt(0)}
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={`${historyData.username} edited the amount of ${
							reg ? historyData.targetname : historyData.targetname + "(unregistered)"
						} to $${history.amount}`}
						secondary={parseDate(history.date)}
					/>
				</ListItem>
			);
		case "4":
			return (
				<ListItem>
					<ListItemAvatar>
						<Avatar alt={historyData.username} src={historyData.useravatar}>
							{historyData.username.charAt(0)}
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={
							history.amount === ""
								? `${historyData.username} removed the description of ${
										reg ? historyData.targetname : historyData.targetname + "(unregistered)"
								  }`
								: `${historyData.username} edited the description of ${
										reg ? historyData.targetname : historyData.targetname + "(unregistered)"
								  } to ${history.amount}`
						}
						secondary={parseDate(history.date)}
					/>
				</ListItem>
			);
		case "5":
			return (
				<ListItem>
					<ListItemAvatar>
						<Avatar alt={historyData.username} src={historyData.useravatar}>
							{historyData.username.charAt(0)}
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={`${historyData.username} edited the expense event to ${history.amount}`}
						secondary={parseDate(history.date)}
					/>
				</ListItem>
			);
		default:
			return <></>;
	}
};

export default ChangelogItem;

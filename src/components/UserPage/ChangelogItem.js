import React from "react";
import { ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import parseDate from "../../utils/parseDate.js";

const ChangelogItem = ({ data }) => {
	const historyData = data;
	const reg = data.reg;

	switch (historyData.action) {
		// 0: create, 1: adduser, 2: deluser, 3: edit amount, 4: edit desc, 5: edit main desc
		case "0":
			return (
				<ListItem>
					<ListItemAvatar>
						<Avatar alt={historyData.username} src={historyData.useravatar}>
							{historyData.username.charAt(0)}
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary={`${historyData.username} created this expense record`} secondary={parseDate(historyData.date)} />
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
					<ListItemText primary={`${historyData.username} added ${reg ? historyData.targetname : historyData.targetname + "(unregistered)"} with $${historyData.amount}`} secondary={parseDate(historyData.date)} />
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
					<ListItemText primary={`${historyData.username} removed ${reg ? historyData.targetname : historyData.targetname + "(unregistered)"} with $${historyData.amount}`} secondary={parseDate(historyData.date)} />
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
					<ListItemText primary={`${historyData.username} edited the amount of ${reg ? historyData.targetname : historyData.targetname + "(unregistered)"} to $${historyData.amount}`} secondary={parseDate(historyData.date)} />
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
					<ListItemText primary={historyData.amount === "" ? `${historyData.username} removed the description of ${reg ? historyData.targetname : historyData.targetname + "(unregistered)"}` : `${historyData.username} edited the description of ${reg ? historyData.targetname : historyData.targetname + "(unregistered)"} to ${historyData.amount}`} secondary={parseDate(historyData.date)} />
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
					<ListItemText primary={`${historyData.username} edited the expense event to ${historyData.amount}`} secondary={parseDate(historyData.date)} />
				</ListItem>
			);
		default:
			return <></>;
	}
};

export default ChangelogItem;

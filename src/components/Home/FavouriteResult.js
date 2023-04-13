import React from "react";
import { ListItemText, IconButton, Tooltip, ListItemButton, Avatar, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import * as api from "../../api/index";

const FavouriteResult = ({ target, userfunc, favfunc }) => {
	const handleMouseDown = (event) => {
		event.preventDefault();
	};

	const handleFavourite = async () => {
		await api.favouriteUser({
			target: target.username,
			targetID: target._id,
			avatar: target.avatar,
		});
		favfunc(true);
	};
	return (
		<>
			<ListItemButton key='item' onClick={() => userfunc(target)} sx={{ py: "15px", borderRadius: "20px" }}>
				<Box sx={{ px: "10px" }}>
					<Avatar alt={target.username} src={target.avatar}>
						{target.username.charAt(0)}
					</Avatar>
				</Box>
				<ListItemText primary={`${target.username}`} sx={{ px: "20px" }} />
			</ListItemButton>
			<Box sx={{ pl: "10px", pr: "20px" }}>
				<Tooltip title='Remove from favourite' placement='right'>
					<IconButton aria-label='favourite button' onClick={handleFavourite} onMouseDown={handleMouseDown} edge='end'>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			</Box>
		</>
	);
};

export default FavouriteResult;

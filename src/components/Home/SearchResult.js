import React, { useState } from "react";
import { ListItemText, IconButton, Tooltip, ListItemButton, Avatar, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { yellow } from "@mui/material/colors";
import * as api from "../../api/index";

const SearchResult = ({ target, isFav, userfunc, favfunc }) => {
	const [favourite, setFavourite] = useState(isFav ? true : false);
	const handleMouseDown = (event) => {
		event.preventDefault();
	};

	const handleFavourite = async () => {
		setFavourite((prev) => !prev);
		await api.favouriteUser({
			target: target.username,
			targetID: target._id,
			avatar: target.avatar,
		});
		favfunc(false);
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
				<Tooltip title={favourite ? "Unfavourite" : "Add to favourite"} placement='right'>
					<IconButton aria-label='favourite button' onClick={handleFavourite} onMouseDown={handleMouseDown} edge='end'>
						{favourite ? <StarIcon sx={{ color: yellow[500] }} /> : <StarBorderIcon />}
					</IconButton>
				</Tooltip>
			</Box>
		</>
	);
};

export default SearchResult;

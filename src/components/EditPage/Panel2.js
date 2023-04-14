import React, { useState, useEffect, useContext } from "react";
import {
	TextField,
	Button,
	List,
	ListItem,
	ListItemText,
	CircularProgress,
	Box,
	Typography,
	Tooltip,
	IconButton,
} from "@mui/material";
import * as api from "../../api/index";
import { ExpenseContext } from "./EditPage";
import SearchResult from "../Home/SearchResult";
import FavouriteResult from "../Home/FavouriteResult";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import * as style from "./styles.js";
import { BOTH_EMPTY, EMPTY_AMOUNT, EMPTY_USERNAME, NO_ERROR, ALREADY_ADDED } from "../../Constants";

const Panel2 = () => {
	const expenseContext = useContext(ExpenseContext);
	const [errorType, setErrorType] = useState(NO_ERROR);
	const [currentData, setCurrentData] = useState({
		user: "",
		amount: "",
		_id: "",
		avatar: "",
		description: "",
	});
	const [favouriteList, setFavouriteList] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [selectMode, setSelectMode] = useState(true);
	const user = JSON.parse(localStorage.getItem("user"));

	const handleSearch = async () => {
		if (searchQuery.trim()) {
			try {
				const { data } = await api.getUsers(searchQuery);
				setSearchResult(data.result);
			} catch (error) {
				console.log(error);
			}
		} else setSearchResult([]);
	};

	useEffect(() => {
		handleSearch();
	}, [searchQuery]);

	const selectUser = (value) => {
		setCurrentData({
			...currentData,
			user: value.username,
			_id: value._id,
			avatar: value.avatar,
		});
	};

	const updateFav = (isDel) => {
		if (user) {
			const getFavouriteList = async () => {
				try {
					const { data } = await api.getFavouriteList();
					setFavouriteList(data.result);
				} catch (error) {
					console.log(error);
				}
			};
			if (isDel) setSearchQuery("");
			getFavouriteList();
		}
	};

	useEffect(() => {
		if (user) updateFav(false);
	}, []);

	const checkIsFav = (target) => {
		let returnResult = false;
		favouriteList.every((item) => {
			if (item.username === target.username && item._id === target._id) {
				returnResult = true;
				return false;
			} else {
				return true;
			}
		});
		return returnResult;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (currentData.user === "" && currentData.amount === "") setErrorType(BOTH_EMPTY);
		else if (currentData.user === "") setErrorType(EMPTY_USERNAME);
		else if (currentData.amount === "") setErrorType(EMPTY_AMOUNT);
		else {
			let skip = false;
			expenseContext.expenseData.userList.forEach((item) => {
				if (item.user === currentData.user) {
					setErrorType(ALREADY_ADDED);
					skip = true;
				}
			});
			if (!skip) {
				await api.addExpenseUser(expenseContext.expenseid, {
					data: {
						_id: currentData._id,
						amount: currentData.amount,
						description: currentData.description,
						user: currentData.user,
					},
				});
				const { data } = await api.getExpense(expenseContext.expenseid);
				expenseContext.setExpenseData(data.result);
				setCurrentData({
					user: "",
					amount: "",
					_id: "",
					avatar: "",
					description: "",
				});
			}
		}
	};

	const handleText = (code, type) => {
		if (type === "user") {
			switch (code) {
				case BOTH_EMPTY:
				case EMPTY_USERNAME:
					return "Please input a user";
				case ALREADY_ADDED:
					return "This user has already been added";
				default:
					break;
			}
		} else if (type === "amount") {
			switch (code) {
				case BOTH_EMPTY:
				case EMPTY_AMOUNT:
					return "Please input an amount";
				default:
					break;
			}
		}
	};

	return (
		<>
			<Box sx={{ height: "65%" }}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						minheight: "17%",
						maxheight: "17%",
					}}
				>
					<Box
						sx={{
							width: "60%",
							height: "100%",
							alignItems: "center",
							display: "flex",
							justifyContent: "center",
						}}
					>
						{selectMode ? (
							<TextField
								sx={{ mt: "5px" }}
								label='Search users'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						) : (
							<Typography
								variant='h6'
								sx={{
									my: "14px",
									fontFamily: "monospace",
									letterSpacing: ".1rem",
									color: "inherit",
									textDecoration: "none",
								}}
							>
								Favourite List
							</Typography>
						)}
					</Box>
					<Tooltip title={selectMode ? "Select from favourite" : "Search users"} placement='right'>
						<IconButton aria-label='switch mode' size='medium' onClick={() => setSelectMode((prev) => !prev)}>
							{selectMode ? <FavoriteIcon /> : <SearchIcon />}
						</IconButton>
					</Tooltip>
				</Box>
				<Box>
					{selectMode ? (
						<Box>
							{searchResult?.length > 0 && (
								<List sx={style.list} subheader={<li />}>
									{searchResult?.map((user) => (
										<ListItem key={`${user.username}`} sx={{ padding: 0 }}>
											<SearchResult
												target={user}
												isFav={checkIsFav(user)}
												userfunc={selectUser}
												favfunc={updateFav}
											/>
										</ListItem>
									))}
								</List>
							)}
						</Box>
					) : (
						<Box>
							{favouriteList === null ? (
								<CircularProgress />
							) : (
								<List sx={style.list} subheader={<li />}>
									{favouriteList?.length <= 0 ? (
										<ListItem sx={{ padding: 0 }}>
											<Box
												sx={{
													margin: "5px",
													width: "100%",
												}}
											>
												<ListItemText
													primary="You don't have any favourite user yet"
													sx={{
														textAlign: "center",
													}}
												/>
											</Box>
										</ListItem>
									) : (
										<>
											{favouriteList.map((user) => (
												<ListItem key={`${user._id}`} sx={{ padding: 0 }}>
													<FavouriteResult target={user} userfunc={selectUser} favfunc={updateFav} />
												</ListItem>
											))}
										</>
									)}
								</List>
							)}
						</Box>
					)}
				</Box>
			</Box>
			<Box>
				<form autoComplete='off' onSubmit={handleSubmit}>
					<Box sx={{ display: "flex", flexDirection: "column" }}>
						<TextField
							error={errorType === EMPTY_USERNAME || errorType === BOTH_EMPTY || errorType === ALREADY_ADDED}
							helperText={handleText(errorType, "user")}
							id='user'
							label='User'
							variant='filled'
							type='text'
							value={currentData.user}
							onChange={(e) => {
								setCurrentData({
									...currentData,
									user: e.target.value,
									_id: "",
									avatar: "",
								});
							}}
						/>
						<TextField
							error={errorType === EMPTY_AMOUNT || errorType === BOTH_EMPTY}
							helperText={handleText(errorType, "amount")}
							id='amount'
							label='Amount'
							variant='filled'
							type='number'
							value={currentData.amount}
							onChange={(e) => {
								setCurrentData({
									...currentData,
									amount: e.target.value,
								});
							}}
						/>
						<TextField
							id='description'
							label='Description(optional)'
							variant='filled'
							type='text'
							value={currentData.description}
							onChange={(e) => {
								setCurrentData({
									...currentData,
									description: e.target.value,
								});
							}}
						/>
						<Box sx={{ display: "flex", flexDirection: "row" }}>
							<Box>
								<Button variant='contained' type='submit'>
									Add user
								</Button>
							</Box>
						</Box>
					</Box>
				</form>
			</Box>
		</>
	);
};

export default Panel2;

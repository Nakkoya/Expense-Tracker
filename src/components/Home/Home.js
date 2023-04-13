/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import {
	TextField,
	Button,
	List,
	ListItem,
	ListItemText,
	CircularProgress,
	Container,
	Box,
	Tooltip,
	IconButton,
	Typography,
} from "@mui/material";
import { Navigate } from "react-router-dom";
import { useRef } from "react";
import * as api from "../../api/index";
import SearchResult from "./SearchResult";
import FavouriteResult from "./FavouriteResult";
import ExpenseTable from "./ExpenseTable";
import * as style from "./styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import _ from "lodash";
import { NO_ERROR, EMPTY_AMOUNT, EMPTY_USERNAME, BOTH_EMPTY, ALREADY_ADDED } from "../../Constants";

const Home = () => {
	const [expenseData, setExpenseData] = useState({
		userList: [],
		event: "",
	});
	const [currentData, setCurrentData] = useState({
		user: "",
		amount: "",
		_id: "",
		avatar: "",
		description: "",
	});
	const [errorType, setErrorType] = useState(NO_ERROR);
	const [favouriteList, setFavouriteList] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [selectMode, setSelectMode] = useState(true);
	const user = JSON.parse(localStorage.getItem("user"));

	//Init table if exists in session storage
	useEffect(() => {
		const data = JSON.parse(sessionStorage.getItem("draft"));
		if (data !== null) setExpenseData(data);
	}, []);

	const handleAddUser = () => {
		if (currentData.user === "" && currentData.amount === "") setErrorType(BOTH_EMPTY);
		else if (currentData.user === "") setErrorType(EMPTY_USERNAME);
		else if (currentData.amount === "") setErrorType(EMPTY_AMOUNT);
		else {
			let skip = false;
			expenseData.userList.forEach((item) => {
				if (item.user === currentData.user) {
					setErrorType(ALREADY_ADDED);
					skip = true;
				}
			});
			if (!skip) {
				setErrorType(NO_ERROR);
				let newList = expenseData.userList;
				newList.push(currentData);
				setExpenseData({
					...expenseData,
					userList: newList,
				});
				setCurrentData({
					user: "",
					amount: "",
					_id: "",
					description: "",
				});
			}
			sessionStorage.setItem("draft", JSON.stringify(expenseData));
		}
	};

	// Debounced to reduce the amount of search request
	const handleSearchRef = useRef();
	handleSearchRef.current = async () => {
		if (searchQuery.trim()) {
			try {
				const { data } = await api.getUsers(searchQuery.trim());
				setSearchResult(data.result);
			} catch (error) {
				console.log(error);
			}
		} else setSearchResult([]);
	};
	const handleSearch = useCallback(
		_.debounce((...args) => handleSearchRef.current(...args), 300),
		[]
	);

	//Send a search request when the search field is updated
	useEffect(() => {
		if (searchQuery === "") setSearchResult([]);
		else if (searchQuery.trim() === searchQuery) handleSearch();
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

	const deleteRow = (target) => {
		let index = -1;
		let newList = expenseData.userList;
		expenseData.userList.every((item, i) => {
			if (item.user === target.username && item._id === target._id) {
				index = i;
				return false;
			} else {
				return true;
			}
		});
		newList.splice(index, 1);
		setExpenseData({
			...expenseData,
			userList: newList,
		});
		sessionStorage.setItem("draft", JSON.stringify(expenseData));
	};

	const checkIsFav = (target) => {
		let returnResult = false;
		favouriteList?.every((item) => {
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
		if (expenseData.userList.length > 0) {
			let includeSelf = false;
			expenseData.userList.every((item) => {
				if (item.user === user?.username) {
					includeSelf = true;
					return false;
				} else {
					return true;
				}
			});
			let notRegistedList = [];
			expenseData.userList.forEach((item) => {
				if (item._id === "") {
					notRegistedList.push(item.user);
				}
			});

			let confirm1 = true;
			let confirm2 = true;
			if (!includeSelf && notRegistedList.length > 0) {
				confirm1 = false;
				confirm1 = window.confirm(
					"You cannot access this record after submitting if you do not include yourself. \n\nDo you want to continue?"
				);
				if (confirm1) {
					confirm2 = false;
					confirm2 = window.confirm(
						`${notRegistedList.map((item) => item)} ${notRegistedList.length > 1 ? "are" : "is"} not${
							notRegistedList.length > 1 ? "" : " a"
						} registered ${notRegistedList.length > 1 ? "users" : "user"}. \n\nDo you want to continue?`
					);
				}
			} else if (!includeSelf) {
				confirm1 = false;
				confirm1 = window.confirm(
					"You will not be able to access this record after submitting if you do not include yourself. \n\nDo you want to continue?"
				);
			} else if (notRegistedList.length > 0) {
				confirm2 = false;
				confirm2 = window.confirm(
					`${notRegistedList.map((item) => item)} ${notRegistedList.length > 1 ? "are" : "is"} not${
						notRegistedList.length > 1 ? "" : " a"
					} registered ${notRegistedList.length > 1 ? "users" : "user"}. \n\nDo you want to continue?`
				);
			}

			if (confirm1 && confirm2) {
				try {
					let newList = expenseData.userList.map((item) => {
						return { _id: item._id, amount: item.amount, description: item.description, user: item.user };
					});
					await api.createExpense({ userList: newList, event: expenseData.event });
				} catch (error) {
					console.log(error);
				}
			}
		} else {
			window.alert("Cannot submit empty record");
		}
	};

	const handleText = (errorType, inputType) => {
		if (inputType === "user") {
			switch (errorType) {
				case EMPTY_USERNAME:
				case BOTH_EMPTY:
					return "Please input a user";
				case ALREADY_ADDED:
					return "This user has already been added";
				default:
					break;
			}
		} else if (inputType === "amount") {
			switch (errorType) {
				case EMPTY_AMOUNT:
				case BOTH_EMPTY:
					return "Please input an amount";
				default:
					break;
			}
		}
	};

	const handleGetDraft = async () => {
		const confirm = window.confirm("Load draft?");
		if (confirm) {
			try {
				const { data } = await api.getDraft();
				setExpenseData(data.result);
				sessionStorage.setItem("draft", JSON.stringify(data.result));
			} catch (error) {
				console.log(error);
			}
		}
	};

	const handleSetDraft = async () => {
		try {
			const result = await api.setDraft(expenseData);
			if (result.status === 200) window.alert("Saved as draft");
		} catch (error) {
			console.log(error);
		}
	};

	const loadMoreItems = (e) => {
		if (Math.abs(e.target.scrollTop + e.target.clientHeight - e.target.scrollHeight) < 2) {
		}
	};

	return (
		<>
			{user ? (
				<>
					<Container maxWidth='lg'>
						<Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
							<Box sx={style.leftBox}>
								<TextField
									id='expenseEvent'
									label='Event'
									variant='filled'
									type='text'
									value={expenseData.event}
									onChange={(e) => {
										setExpenseData({ ...expenseData, event: e.target.value });
									}}
								/>
								<ExpenseTable data={expenseData} func={deleteRow} />
								<Box
									sx={{
										display: " flex",
										flexDirection: "row",
										justifyContent: "space-around",
										mt: 1,
									}}
								>
									<Button variant='contained' onClick={handleSetDraft}>
										Save as draft
									</Button>
									<Button variant='contained' onClick={handleGetDraft}>
										Load draft
									</Button>
								</Box>
							</Box>
							<Box sx={style.rightBox}>
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
											<IconButton
												aria-label='switch mode'
												size='medium'
												onClick={() => setSelectMode((prev) => !prev)}
											>
												{selectMode ? <FavoriteIcon /> : <SearchIcon />}
											</IconButton>
										</Tooltip>
									</Box>
									<Box>
										{selectMode ? (
											<Box>
												{searchResult?.length > 0 && (
													<List sx={style.list} subheader={<li />} disableGutters>
														{searchResult?.map((user) => (
															<ListItem key={`${user.username}`} sx={{ padding: 0 }} disableGutters>
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
													<List
														sx={style.list}
														subheader={<li />}
														disableGutters
														onScroll={loadMoreItems}
													>
														{favouriteList?.length <= 0 ? (
															<ListItem sx={{ padding: 0 }} disableGutters>
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
																	<ListItem
																		key={`${user._id}`}
																		sx={{ padding: 0 }}
																		disableGutters
																	>
																		<FavouriteResult
																			target={user}
																			userfunc={selectUser}
																			favfunc={updateFav}
																		/>
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
												error={
													errorType === EMPTY_USERNAME ||
													errorType === BOTH_EMPTY ||
													errorType === ALREADY_ADDED
												}
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
											<Box
												sx={{
													display: " flex",
													flexDirection: "row",
													justifyContent: "space-around",
													mt: 1,
												}}
											>
												<Box>
													<Button variant='contained' onClick={handleAddUser}>
														Add user
													</Button>
												</Box>
												<Box>
													<Button variant='contained' type='submit'>
														Submit
													</Button>
												</Box>
											</Box>
										</Box>
									</form>
								</Box>
							</Box>
						</Box>
					</Container>
				</>
			) : (
				<Navigate to='/auth' replace={true} />
			)}
		</>
	);
};

export default Home;

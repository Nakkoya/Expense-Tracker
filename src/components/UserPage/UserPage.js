import { Pagination, PaginationItem, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress, Card, Box, CardContent, Typography, CardMedia, Container, Modal } from "@mui/material";
import React, { useState, useEffect, createContext } from "react";
import { useLocation, Link, Navigate, useNavigate } from "react-router-dom";
import * as api from "../../api/index";
import Changelog from "./Changelog";
import ExpenseList from "./ExpenseList";
import defaultAvatar from "../../assets/default.jpg";
import * as style from "./styles.js";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

export const UserPageContext = createContext();

const Paginate = ({ page, totalPage }) => {
	return <Pagination count={totalPage} page={Number(page) || 1} variant="outlined" color="primary" renderItem={(item) => <PaginationItem {...item} component={Link} to={`/userpage?page=${item.page}`} />} />;
};

const UserPage = () => {
	const query = useQuery();
	const page = query.get("page") || 1;
	const [totalPage, setTotalPage] = useState(1);
	const [changelogID, setChangelogID] = useState("");
	const [openChangelog, setOpenChangelog] = useState(false);
	const [changelog, setChangelog] = useState(null);
	const [expenseList, setExpenseList] = useState(null);
	const [useravatarFull, setUseravatarFull] = useState(null);
	const [ready, setReady] = useState(false);
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem("user"));

	useEffect(() => {
		const func = async () => {
			try {
				if (user) {
					const result = await api.getUser("2");
					setUseravatarFull(`${result.data.result.avatarFull}`);
				} else {
					setUseravatarFull("");
				}
			} catch (error) {
				console.log(error);
			}
		};
		func();
	}, []);

	useEffect(() => {
		setOpenChangelog(false);
		const func = async () => {
			const { data } = await api.getExpenseList({
				page: page,
			});
			setExpenseList(data.result.expenseList);
			setTotalPage(data.result.totalPage);
		};
		func();
	}, [page]);

	useEffect(() => {
		const func = async () => {
			if (changelogID !== "") {
				setOpenChangelog(true);
				const { data } = await api.getExpenseHistory(changelogID);
				setChangelog(data.result);
				setReady(true);
			}
		};
		setChangelog(null);
		func();
	}, [changelogID]);

	return (
		<>
			{!user && <Navigate to="/auth" replace={true} />}
			{/* Redirect to signin page if not logged in */}

			{user && (
				<Container maxWidth="lg">
					<Box>
						<Card sx={style.card}>
							<CardMedia component="img" sx={style.cardMedia} src={useravatarFull !== "" ? `${useravatarFull}` : defaultAvatar} alt="avatar" />
							<Box sx={{ display: "flex", flexDirection: "column" }}>
								<CardContent sx={{ flex: "1" }}>
									<Typography component="div" sx={{ fontSize: { xs: 16, md: 30 } }}>
										{user?.username}
									</Typography>
								</CardContent>
								<Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
									<Button variant="contained" onClick={() => navigate(`/edit/profile`)}>
										Edit profile
									</Button>
								</Box>
							</Box>
						</Card>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								width: "100%",
							}}
						>
							{expenseList === null && <CircularProgress />}
							{expenseList?.length > 0 && (
								<>
									<UserPageContext.Provider value={{ setChangelogID: setChangelogID, setOpenChangelog: setOpenChangelog }}>
										<TableContainer
											component={Paper}
											sx={{
												borderRadius: 0,
												borderBottomLeftRadius: 2,
												borderBottomRightRadius: 2,
												maxWidth: "100%",
												mb: "10px",
											}}
										>
											<Table aria-label="expense">
												<TableHead>
													<TableRow>
														<TableCell />
														<TableCell>Date</TableCell>
														<TableCell align="justify">Event</TableCell>
														<TableCell />
													</TableRow>
												</TableHead>
												<TableBody>{expenseList && expenseList.length > 0 ? expenseList.map((item) => <ExpenseList key={item._id} data={item} />) : <CircularProgress />}</TableBody>
											</Table>
										</TableContainer>
										<Paginate page={page} totalPage={totalPage} />
									</UserPageContext.Provider>
								</>
							)}
							{expenseList?.length === 0 && <h1>You don't have any records yet</h1>}
						</Box>
					</Box>
					<Modal
						open={openChangelog}
						onClose={() => {
							setOpenChangelog(false);
							setReady(false);
						}}
					>
						<Box sx={style.modal}>{ready && <Changelog data={changelog} />}</Box>
					</Modal>
				</Container>
			)}
		</>
	);
};

export default UserPage;

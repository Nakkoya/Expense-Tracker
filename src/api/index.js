import axios from "axios";

const API = axios.create({ baseURL: "https://expensetracker-jc.herokuapp.com/" });

API.interceptors.request.use((req) => {
	if (localStorage.getItem("user")) {
		req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("user")).token}`;
	}
	return req;
});

export const signIn = (formData) => API.post("/auth/signin", formData);

export const signUp = (formData) => API.post("/auth/signup", formData);

export const getFavouriteList = () => API.get("/user/favouritelist");

export const getExpenseList = (searchQuery) => API.get(`/user/getlist?page=${searchQuery.page}`);

export const getUsers = (searchQuery) => API.get(`/user/searchusers?searchQuery=${searchQuery}`);

export const getUser = (returnavatar, id = null) => API.get(`/user/getuser?returnavatar=${returnavatar}&userid=${id}`);

export const editUser = (data) => API.put("/user/edituser", data);

export const favouriteUser = (data) => API.patch("/user/favourite", data);

export const setDraft = (data) => API.post("/draft/set", { data: data });

export const getDraft = () => API.get("/draft/get");

export const createExpense = (data) => API.post("/expense/create", { data: data });

export const deleteExpense = (expenseID) => API.delete(`/expense/delete/${expenseID}`);

export const getExpense = (expenseID) => API.get(`/expense/get/${expenseID}`);

export const getExpenseHistory = (expenseID) => API.get(`/expense/gethistory/${expenseID}`);

export const editExpenseAmount = (expenseID, data) => API.patch(`/expense/edit/amount/${expenseID}`, data);

export const editExpenseDesc = (expenseID, data) => API.patch(`/expense/edit/desc/${expenseID}`, data);

export const addExpenseUser = (expenseID, data) => API.patch(`/expense/edit/adduser/${expenseID}`, data);

export const deleteExpenseUser = (expenseID, data) => API.patch(`/expense/edit/deluser/${expenseID}`, data);

export const editExpenseEvent = (expenseID, data) => API.patch(`/expense/edit/event/${expenseID}`, data);

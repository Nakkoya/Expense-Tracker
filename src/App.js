import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home/Home.js";
import Navbar from "./components/Navbar/Navbar.js";
import Auth from "./components/Auth/Auth.js";
import UserPage from "./components/UserPage/UserPage.js";
import Error from "./components/Error/Error.js";
import EditPage from "./components/EditPage/EditPage.js";
import FirstSetAvatar from "./components/Auth/FirstSetAvatar.js";
import NotFound from "./components/Error/NotFound.js";
import EditProfile from "./components/UserPage/EditProfile.js";
import Padder from "./Padder.js";

function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<Padder />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/home' element={<Navigate to='/' replace={true} />} />
				<Route path='/error' element={<Error />} />
				<Route path='/auth' element={<Auth />} />
				<Route path='/auth/initavatar' element={<FirstSetAvatar />} />
				<Route path='/userpage' element={<UserPage />} />
				<Route path='/edit/expense' element={<EditPage />} />
				<Route path='/edit/profile' element={<EditProfile />} />
				<Route path='/*' element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

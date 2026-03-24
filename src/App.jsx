import { useEffect } from "react";
import { useDispatch } from "react-redux";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import Header from "./componants/Header/Header";
import Footer from "./componants/Footer/Footer"
import { Outlet } from "react-router-dom";
function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        authService.getCurrentUser().then((user) => {
            if (user) {
                dispatch(login(user));
            } else {
                dispatch(logout());
            }
        });
    }, [dispatch]);

    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
}

export default App
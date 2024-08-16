import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Home, Register, ResetPassword, Login, Profile,ChangePassword ,VerifyUser} from "./pages";
import { useSelector } from "react-redux";
import { getUser } from "./Redux/features/userSlice";
import { getTheme } from "./Redux/features/themeSlice";

function App() {
  function Layout() {
    const {user }= useSelector(getUser);
    const location = useLocation();

    return user?.token ? (
      <Outlet />
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  const theme = useSelector(getTheme);
  return (
    <>
      <div data-theme={theme} className="min-h-[100vh] w-full">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/profile/:id?" element={<Profile />}></Route>
          </Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/reset-password" element={<ResetPassword />}></Route>
          <Route path="/change-password/:id/:token" element={<ChangePassword />}></Route>
          <Route path="/verify-user/:id/:token" element={<VerifyUser />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;

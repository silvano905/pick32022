import {Routes, Route, Link, Navigate, Outlet} from "react-router-dom";
import Home from "./pages/Home";
import HomeSecondEngine from "./pages/HomeSecondEngine";
import HomeThirdEngine from "./pages/HomeThirdEngine";
import Navbar from "./navbar/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import {useSelector} from "react-redux";
import {selectUser} from "./redux/user/userSlice";
import Testing from "./pages/Testing";
function App() {
  const userAuth = useSelector(selectUser)

  const ProtectedRoute = ({
                            user,
                            redirectPath = '/login',
                            children,
                          }) => {
    if (!user) {
      return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
  };

  return (
      <div>
        <Navbar/>
        <Routes>
          <Route element={<ProtectedRoute user={userAuth} />}>
            {/*<Route path="account" element={<Account />} />*/}
          </Route>
          {/*<Route path='/' element={<HomeThirdEngine />} />*/}
            <Route path='/' element={<Testing />} />

            <Route path='/create' element={<CreatePost />} />
            <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </div>
  );
}

export default App;

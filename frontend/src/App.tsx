import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MobileLayout from "./layouts/MobileLayout";
import LoginPage from "./Pages/LoginPage"; // 아까 만든 로그인 페이지
import HomePage from "./Pages/HomePage"; 
import SignupPage from "./Pages/SignupPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MobileLayout />, // 공통 레이아웃을 부모로 설정
    children: [
      {
        path: "/",
        element: <HomePage/>
      },
      {
        path: "/home",
        element: <HomePage /> // LoginPage 내부에서 MobileLayout을 중복 사용하지 않도록 수정 필요
      },
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/signup",
        element: <SignupPage /> 
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
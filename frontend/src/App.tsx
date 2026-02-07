import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './index.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


import MobileLayout from "./layouts/MobileLayout";
import LoginPage from "./Pages/LoginPage"; 
import HomePage from "./Pages/HomePage"; 
import SignupPage from "./Pages/SignupPage";
import CoursePage from "./Pages/CoursePage";
import LoadingPage from "./Pages/LoadingPage";
import MyPage from "./Pages/MyPage";


const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <MobileLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/home", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/my", element: <MyPage /> },
      { path: "/course/:courseId", element: <CoursePage /> },
      { path: "/loading", element: <LoadingPage /> },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App;
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main/Main";
import Login from "./pages/Login/Login";
import Join from "./pages/Join/Join";
import Success from "./pages/Success/Success";
import Upload from "./pages/Upload/Upload";
import Calendar from "./pages/Upload/Calendar";
import Stats from "./pages/Stats/Stats";
import MyPage from "./pages/MyPage/MyPage";
import Daily from "./pages/Daily/Daily";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/success" element={<Success />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/calendar/:formattedDate" element={<Upload />}></Route>
        <Route path="/stats" element={<Stats />}></Route>
        <Route path="/mypage" element={<MyPage />}></Route>
        <Route path="/daily" element={<Daily />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;

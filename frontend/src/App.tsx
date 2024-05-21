import { Container, Typography } from "@mui/material";
import AppToolbar from "./components/AppToolbar/AppToolbar";
import { Route, Routes } from "react-router-dom";
import Register from "./features/users/Register";
import Login from "./features/users/Login";
import Chat from "./features/chat/Chat";

const App = () => {
  return (
      <>
          <header>
              <AppToolbar />
          </header>
          <main>
                  <Routes>
                      <Route path='/register' element={<Register />} />
                      <Route path='/login' element={<Login />} />
                      <Route path='/' element={<Chat />} />
                      <Route path="*" element={<Typography variant="h2">Not Found</Typography>} />
                  </Routes>
          </main>
      </>
  );
};

export default App;
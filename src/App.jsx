import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import RGBLogViewer from "./RGBLogViewer";
import InputForm from "./InputForm";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <InputForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/prediction-logs"
        element={
          <PrivateRoute>
            <RGBLogViewer />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;

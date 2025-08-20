import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import RGBLogViewer from "./RGBLogViewer";
import InputForm from "./InputForm";
import PrivateRoute from "./PrivateRoute";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        let res = await fetch("https://api.smartlatherbot.bytecraftre.com/api/dispense/status");
        let data = await res.json();

        if (data.dispensed) {
          toast.success("Color dispensed successfully!");
          // reset after showing
          await fetch("https://api.smartlatherbot.bytecraftre.com/api/dispense/reset/", { method: "POST" });
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000); // check every 3 sec

    return () => clearInterval(interval);
  }, []);

  
  return (
    <>
    <ToastContainer position="top-center" autoClose={3000} />
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
    </>
  );
}

export default App;

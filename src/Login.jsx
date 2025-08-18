import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../src/assets/logo.png'; // Adjust path

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error("⚠️ Please enter both fields");
            return;
        }

        try {
            const toastId = toast.loading("Logging in...");

            const response = await fetch("https://api.smartlatherbot.bytecraftre.com/login/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                toast.update(toastId, {
                    render: "✅ Login successful!",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
                setTimeout(() => window.location.href = "/", 1500);
            } else {
                toast.update(toastId, {
                    render: data.message || "❌ Invalid credentials",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            }
        } catch (err) {
            toast.error("🚨 Server error. Try again later.");
        }
    };

    return (
        <>
            <ToastContainer />
            <div style={styles.pageWrapper}>
                <div style={styles.card}>
                    <img src={logo} alt="Logo" style={styles.logo} />
                    <h2 style={styles.title}>Smart LeatherDyeBot</h2>
                    <p style={styles.subtitle}>Sign in to continue</p>

                    <form onSubmit={handleLogin} style={styles.form}>
                        <input
                            type="text"
                            placeholder="👤 Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="🔑 Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                        />
                        <button type="submit" style={styles.button}>Login</button>
                    </form>
                </div>
            </div>
        </>
    );
}

const styles = {
    pageWrapper: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: '90vw'
        // background: "linear-gradient(135deg, #2563eb, #9333ea)", // gradient bg
        // padding: "20px",
    },
    card: {
        width: "100%",
        maxWidth: "400px",
        background: "#fff",
        padding: "40px 30px",
        borderRadius: "16px",
        boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
        textAlign: "center",
        animation: "fadeIn 0.6s ease-in-out",
    },
    logo: {
        height: "200px",
        marginBottom: "-50px",
    },
    title: {
        fontSize: "24px",
        fontWeight: "700",
        marginBottom: "6px",
        color: "#111827",
    },
    subtitle: {
        fontSize: "14px",
        color: "#6b7280",
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    input: {
        padding: "12px 14px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "15px",
        outline: "none",
        transition: "border 0.3s",
        backgroundColor: "#ffffffff",
        color: "#000000"
    },
    button: {
        padding: "12px",
        fontSize: "15px",
        backgroundColor: "#2563eb",
        color: "#fff",
        fontWeight: "600",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.3s",
    },
};

// Add hover effect via inline JS
styles.button[":hover"] = {
    backgroundColor: "#1d4ed8",
};

export default LoginForm;

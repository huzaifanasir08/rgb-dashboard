import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RGBLogDashboard = () => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    const toastId = toast.loading("Loading logs...");
    fetch('/api/rgb-logs')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched logs:', data);
        toast.update(toastId, {
          render: "Loading successful!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setLogs(data.logs || []); // Access the logs array from response
      })
      .catch((error) => console.error('Error fetching RGB logs:', error));
  }, []);

  const styles = {
    container: {
      backgroundColor: '#11193a',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      width: '90%',
      maxWidth: '900px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    header: {
      fontSize: '32px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#11193a',
    },
    emoji: {
      fontSize: '28px',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#021668ff',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      alignSelf: 'flex-start',
      transition: 'background-color 0.3s ease',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#eee',
      padding: '12px',
      border: '1px solid #ccc',
      fontWeight: '600',
      color: '#333',
    },
    td: {
      padding: '12px',
      border: '1px solid #ddd',
      textAlign: 'center',
      color: '#555',
    },
    swatch: {
      width: '40px',
      height: '20px',
      borderRadius: '4px',
      border: '1px solid #aaa',
      display: 'inline-block',
    },
  };

  return (
    <>
    <ToastContainer />
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>
          Prediction Logs Dashboard
        </h2>

        <button onClick={() => navigate('/')} style={styles.button}>
          Go to Input Form
        </button>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Predicted</th>
              <th style={styles.th}>Red</th>
              <th style={styles.th}>Green</th>
              <th style={styles.th}>Blue</th>
              <th style={styles.th}>Swatch</th>
              <th style={styles.th}>Difference</th>
              <th style={styles.th}>Validated</th>
              <th style={styles.th}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td style={styles.td}>{log.id}</td>
                <td style={styles.td}>{log.predicted.join(', ')}</td>
                <td style={styles.td}>{log.red}</td>
                <td style={styles.td}>{log.green}</td>
                <td style={styles.td}>{log.blue}</td>
                <td style={styles.td}>
                  <div
                    style={{
                      ...styles.swatch,
                      backgroundColor: `rgb(${log.red}, ${log.green}, ${log.blue})`,
                    }}
                  />
                </td>
                <td style={styles.td}>{log.difference.join(', ')}</td>
                <td style={styles.td}>{log.is_validated ? '✅' : '❌'}</td>
                <td style={styles.td}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
    
  );
};

export default RGBLogDashboard;

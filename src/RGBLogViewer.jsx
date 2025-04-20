import React, { useEffect, useState } from 'react';

const RGBLogDashboard = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('https://arslanars.pythonanywhere.com/rgb-logs/')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched logs:', data);
        setLogs(data);
      })
      .catch((error) => console.error('Error fetching RGB logs:', error));
  }, []);

  const styles = {
    container: {
      backgroundColor: '#f5f6f7',
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
    },
    header: {
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
        color: '#0b7e57',
    },
    emoji: {
      fontSize: '28px',
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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>
          <span style={styles.emoji}>🎨</span> RGB Log Dashboard
        </h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Red</th>
              <th style={styles.th}>Green</th>
              <th style={styles.th}>Blue</th>
              <th style={styles.th}>Swatch</th>
              <th style={styles.th}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td style={styles.td}>{log.id}</td>
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
                <td style={styles.td}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RGBLogDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../src/assets/logo.png'; // Adjust path as needed

function InputForm() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [sampleType, setSampleType] = useState('input');
    const [validationValue, setValidationValue] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');
    const [previewURL, setPreviewURL] = useState('');
    const [isError, setIsError] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const styles = getResponsiveStyles(isMobile);

    const resetForm = () => {
        setSelectedFile(null);
        setSampleType('input');
        setValidationValue(0);
        setStatusMessage('');
        setPreviewURL('');
        setIsError(false);
        document.getElementById('file-input').value = null;
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setStatusMessage('');
        setIsError(false);

        if (file && file.type.startsWith('image/')) {
            setPreviewURL(URL.createObjectURL(file));
        } else {
            setPreviewURL('');
        }
    };

    const handleSampleTypeChange = (event) => {
        setSampleType(event.target.value);
        if (event.target.value === 'input') {
            setValidationValue(0);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setStatusMessage('⚠️ Please select a file to upload.');
            setIsError(true);
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('type', sampleType);
        formData.append('id', sampleType === 'validation' ? validationValue : 0);
        console.log(validationValue);

        try {
            const toastId = toast.loading("Processing...");
            const response = await fetch('/api/getprediction/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Response data:', data);
                setStatusMessage('✅ Sample uploaded successfully!');
                setIsError(false);
                resetForm();
                toast.update(toastId, {
                    render: "Processing Completed",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setStatusMessage('❌ An error occurred. Check your connection.');
            setIsError(true);
            toast.update(toastId, {
                render: `Something went wrong. ${error}`,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    return (
        <>
            <ToastContainer />
            <div style={styles.container}>
                <img src={logo} alt="Logo" style={{ height: '10em', marginBottom: '-50px' }} />
                <h2 style={styles.title}>Smart LeatherDyeBot</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Upload Photo</label>
                        <input
                            id="file-input"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={styles.fileInput}
                        />
                    </div>

                    {previewURL && (
                        <div style={styles.previewContainer}>
                            <img src={previewURL} alt="Preview" style={styles.previewImage} />
                        </div>
                    )}

                    <div style={styles.radioGroup}>
                        <label>
                            <input
                                type="radio"
                                value="input"
                                checked={sampleType === 'input'}
                                onChange={handleSampleTypeChange}
                            />
                            <span style={styles.radioLabel}>Input Sample</span>
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="validation"
                                checked={sampleType === 'validation'}
                                onChange={handleSampleTypeChange}
                            />
                            <span style={styles.radioLabel}>Validation Sample</span>
                        </label>
                    </div>

                    {sampleType === 'validation' && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Validation Sample ID</label>
                            <input
                                type="number"
                                min="0"
                                value={validationValue}
                                onChange={(e) => setValidationValue(parseInt(e.target.value) || 0)}
                                style={styles.fileInput}
                            />
                        </div>
                    )}

                    <div style={styles.buttons}>
                        <button type="submit" style={styles.button}>Submit Sample</button>
                        <button type="button" onClick={() => navigate('/prediction-logs')} style={styles.button}>Go to Dashboard</button>
                    </div>

                    {statusMessage && (
                        <p style={{ ...styles.status, color: isError ? '#ef4444' : '#10b981' }}>
                            {statusMessage}
                        </p>
                    )}
                </form>
                <footer style={styles.footer}>© 2025 AttarProjects. All rights reserved.</footer>
            </div>
        </>
    );
}

// 🔥 Responsive Style Generator
function getResponsiveStyles(isMobile) {
    return {
        buttons: {
            display: 'flex',
            justifyContent: isMobile ? 'center' : 'space-between',
            marginTop: '20px',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            gap: '10px'
        },
        container: {
            width: isMobile ? '90vw' : '50vw',
            margin: '50px auto',
            padding: isMobile ? '20px 16px' : '32px 24px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            textAlign: 'center'
        },
        title: {
            fontSize: isMobile ? '22px' : '26px',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#1f2937'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        },
        inputGroup: {
            textAlign: 'left'
        },
        label: {
            display: 'block',
            marginBottom: '6px',
            fontWeight: '600',
            color: '#4b5563'
        },
        fileInput: {
            padding: '10px',
            width: isMobile ? '95%' : '97%',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            backgroundColor: '#f9fafb',
            color: '#374151',
        },
        previewContainer: {
            margin: '0 auto',
            padding: '10px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            backgroundColor: '#f3f4f6',
            maxWidth: '220px'
        },
        previewImage: {
            width: '100%',
            height: 'auto',
            borderRadius: '6px'
        },
        radioGroup: {
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'row',
            justifyContent: 'space-evenly',
            fontSize: '15px',
            color: '#374151'
        },
        radioLabel: {
            marginLeft: '6px'
        },
        button: {
            padding: '1rem 0.5rem',
            fontSize: '.9rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'background 0.3s',
            width: isMobile ? '100%' : '60%',
        },
        status: {
            marginTop: '12px',
            fontSize: '15px',
            fontWeight: '500'
        },
        footer: {
            marginTop: '36px',
            fontSize: '13px',
            color: '#9ca3af'
        }
    };
}

export default InputForm;

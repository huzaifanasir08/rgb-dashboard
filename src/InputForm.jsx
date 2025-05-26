import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function InputForm() {
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [sampleType, setSampleType] = useState('input');
    const [validationValue, setValidationValue] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');
    const [previewURL, setPreviewURL] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

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

        try {
            const toastId = toast.loading("Processing...");
            const response = await fetch('https://fightschool-scrapper.datafunction.ca/getprediction/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Response data:', data);
                setStatusMessage('✅ Sample uploaded successfully!');
                setIsError(false);
                resetForm(); // Clear form on success
                    toast.update(toastId, {
                    render: "Processing Completed",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            } else {
                setStatusMessage('❌ Upload failed. Please try again.');
                setIsError(true);
                toast.update(toastId, {
                    render: "Something went wrong.",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
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
            <h2 style={styles.title}>🎨 AttarProjects - Color Prediction</h2>
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

                <button type="submit" style={styles.button}>🚀 Submit Sample</button>
                <button onClick={() => navigate('/rgblog')} style={styles.button}>Go to Dashboard</button>

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

const styles = {
    container: {
        maxWidth: '440px',
        margin: '50px auto',
        padding: '32px 24px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
        fontFamily: 'Segoe UI, Tahoma, sans-serif',
        textAlign: 'center'
    },
    title: {
        fontSize: '26px',
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
        width: '93%',
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
        justifyContent: 'space-evenly',
        fontSize: '15px',
        color: '#374151'
    },
    radioLabel: {
        marginLeft: '6px'
    },
    button: {
        padding: '12px 24px',
        fontSize: '16px',
        backgroundColor: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'background 0.3s'
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

export default InputForm;

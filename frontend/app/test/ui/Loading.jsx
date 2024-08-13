import React from 'react';
import '../chatbot.css';
const LoadingIndicator = () => {
    return (
        <div style={styles.loadingContainer}>
            <div style={styles.loadingDot}></div>
            <div style={styles.loadingDot}></div>
            <div style={styles.loadingDot}></div>
        </div>
    );
};

const styles = {
    loadingContainer: {
        display: 'inline flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '10px',
    },
    loadingDot: {
        width: '4px',
        height: '4px',
        margin: '0 2px',
        borderRadius: '50%',
        backgroundColor: '#888',
        animation: 'loading 1.2s infinite',
    },
};

export default LoadingIndicator;

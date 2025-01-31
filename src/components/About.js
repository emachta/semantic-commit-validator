import React from 'react';
import * as amplitude from '@amplitude/analytics-browser';

function About({ onClose }) {
  const handleClose = () => {
    amplitude.track('Close About Modal', {
      method: 'button'
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '2rem',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ color: '#2d3748', marginBottom: '1.5rem' }}>About This Tool</h2>
        
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#4a5568', marginBottom: '1rem' }}>The Story</h3>
          <p style={{ lineHeight: '1.6', color: '#4a5568' }}>
            As a developer, I frequently found myself needing to validate commit messages against the Conventional Commits specification. 
            While there are many tools available as git hooks or CLI utilities, I wanted something simpler - a quick, online tool 
            that could instantly validate commit messages without any setup or installation.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#4a5568', marginBottom: '1rem' }}>Built with AI</h3>
          <p style={{ lineHeight: '1.6', color: '#4a5568' }}>
            This entire tool was created through a collaboration between human and artificial intelligence. Using GitHub Copilot and 
            ChatGPT, we were able to rapidly prototype, develop, and refine the validator. The AI helped with everything from the 
            initial code structure to the validation rules, styling, and even this about page.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#4a5568', marginBottom: '1rem' }}>Technology Stack</h3>
          <ul style={{ lineHeight: '1.6', color: '#4a5568', listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>• React for the frontend interface</li>
            <li style={{ marginBottom: '0.5rem' }}>• conventional-commits-parser for message parsing</li>
            <li style={{ marginBottom: '0.5rem' }}>• Pure CSS for styling (no external dependencies)</li>
            <li>• Hosted on GitHub Pages</li>
          </ul>
        </section>

        <section>
          <h3 style={{ color: '#4a5568', marginBottom: '1rem' }}>Open Source</h3>
          <p style={{ lineHeight: '1.6', color: '#4a5568' }}>
            This tool is open source and available on GitHub. Feel free to contribute, report issues, or suggest improvements.
          </p>
        </section>

        <button 
          onClick={handleClose}
          style={{
            marginTop: '2rem',
            backgroundColor: '#4299e1',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default About;
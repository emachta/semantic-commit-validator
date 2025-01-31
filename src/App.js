import React, { useState, useEffect } from 'react';
import { CommitParser } from 'conventional-commits-parser';
import { Helmet } from 'react-helmet';
import About from './components/About';
import * as amplitude from '@amplitude/analytics-browser';

function App() {
  useEffect(() => {
    amplitude.init('6a24f3b4967eaf973034c20f8b6280eb');
  }, []);

  const [commitMessage, setCommitMessage] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  
  
  const firstLineLength = commitMessage.split('\n')[0].length;

  // Types that MUST be used in specific scenarios
  const REQUIRED_TYPES = {
    feat: 'A new feature (MINOR in SemVer)',
    fix: 'A bug fix (PATCH in SemVer)'
  };

  // Other allowed types
  const OPTIONAL_TYPES = {
    docs: 'Documentation changes',
    style: 'Code style changes',
    refactor: 'Code refactoring',
    perf: 'Performance improvements',
    test: 'Test updates',
    build: 'Build system changes',
    ci: 'CI configuration changes',
    chore: 'Maintenance tasks',
    revert: 'Revert previous changes'
  };

  const validateCommit = (e) => {
    e.preventDefault();
    try {
      const parser = new CommitParser();
      const messageToValidate = commitMessage.trim();
      const parsed = parser.parse(messageToValidate);
      const errors = [];

      // Track initial validation attempt with parsed details
      amplitude.track('Validate Commit', {
        messageLength: commitMessage.length,
        firstLineLength: firstLineLength,
        hasType: !!parsed.type,
        type: parsed.type || 'none',
        hasScope: !!parsed.scope,
        scope: parsed.scope || 'none',
        hasBody: !!parsed.body,
        hasFooter: !!parsed.footer,
        hasBreakingChange: parsed.type?.includes('!') || false
      });

      // Basic structure validation
      if (!parsed.type || !parsed.subject) {
        const typePattern = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-zA-Z0-9-_]+\))?(!)?:/i;
        if (!typePattern.test(messageToValidate)) {
          errors.push('Commit MUST be prefixed with a type, followed by a colon and space, then a description');
        }
      }

      // Character limit validation
      const firstLine = messageToValidate.split('\n')[0];
      if (firstLine.length > 100) {
        errors.push('First line (type, scope, and description) MUST not exceed 100 characters');
      } else if (firstLine.length > 72) {
        console.warn('First line should preferably not exceed 72 characters');
      }

      if (parsed.type) {
        const type = parsed.type.toLowerCase().replace('!', '');
        if (!REQUIRED_TYPES[type] && !OPTIONAL_TYPES[type]) {
          errors.push(`Invalid type "${parsed.type}". Valid types are: ${Object.keys({...REQUIRED_TYPES, ...OPTIONAL_TYPES}).join(', ')}`);
        }
      }

      // Scope validation
      if (parsed.scope) {
        if (!/^[a-zA-Z0-9-_]+$/.test(parsed.scope)) {
          errors.push('Scope MUST consist of a noun describing a section of the codebase');
        }
      }

      // Breaking change validation
      const hasBreakingChangeFooter = parsed.notes?.some(note => 
        note.title === 'BREAKING CHANGE' || note.title === 'BREAKING-CHANGE'
      );
      const hasBreakingChangeMarker = parsed.type?.includes('!');

      if (hasBreakingChangeMarker && !parsed.subject) {
        errors.push('Breaking changes with ! MUST include a description');
      }

      // Footer validation
      if (parsed.footer) {
        const footerLines = parsed.footer.split('\n');
        footerLines.forEach(line => {
          if (line.trim()) {
            const isBreakingChange = /^BREAKING[ -]CHANGE: .+/.test(line);
            const isRegularFooter = /^[A-Za-z-]+: .+/.test(line) || 
                                  /^[A-Za-z-]+ #.+/.test(line);
            
            if (!isBreakingChange && !isRegularFooter) {
              errors.push('Footer MUST consist of a token, followed by ": " or " #", followed by a string value');
            }
          }
        });
      }

      // Body validation
      if (parsed.body) {
        const bodyLines = parsed.body.split('\n');
        if (bodyLines[0] && !messageToValidate.includes('\n\n')) {
          errors.push('Commit body MUST begin one blank line after the description');
        }
      }

      // Set validation result
      setValidationResult({
        isValid: errors.length === 0,
        parsed,
        error: errors.length > 0 ? errors.join('\n') : null,
        semverImpact: getSemverImpact(parsed)
      });

      // Track validation result with more details
      amplitude.track('Validation Result', {
        isValid: errors.length === 0,
        errorCount: errors.length,
        errors: errors,
        type: parsed.type?.toLowerCase(),
        scope: parsed.scope,
        hasBody: !!parsed.body,
        hasFooter: !!parsed.footer,
        hasBreakingChange: hasBreakingChangeMarker || hasBreakingChangeFooter,
        semverImpact: getSemverImpact(parsed),
        messageLength: messageToValidate.length,
        firstLineLength: firstLine.length
      });

    } catch (error) {
      amplitude.track('Validation Error', {
        errorMessage: error.message,
        commitMessage: commitMessage,
        messageLength: commitMessage.length
      });
      setValidationResult({
        isValid: false,
        parsed: null,
        error: error.message
      });
    }
  };

  const getSemverImpact = (parsed) => {
    if (!parsed) return null;
    
    const hasBreakingChange = 
      parsed.notes?.some(note => note.title === 'BREAKING CHANGE' || note.title === 'BREAKING-CHANGE') ||
      parsed.type?.includes('!');

    if (hasBreakingChange) return 'MAJOR';
    if (parsed.type?.toLowerCase() === 'feat') return 'MINOR';
    if (parsed.type?.toLowerCase() === 'fix') return 'PATCH';
    return 'NONE';
  };

  // Add tracking to About modal
  const toggleAbout = (e) => {
    e.preventDefault();
    const newState = !showAbout;
    setShowAbout(newState);
    amplitude.track('Toggle About Modal', {
      action: newState ? 'open' : 'close'
    });
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <Helmet>
        <title>Semantic Commit Validator | Conventional Commits Linter</title>
        <meta name="description" content="Free online tool to validate and lint git commit messages according to conventional commits specification. Check your commit messages for proper formatting and conventions." />
        <meta name="keywords" content="git commit validator, conventional commits, semantic versioning, commit message linter, git tools" />
        <meta property="og:title" content="Semantic Commit Validator" />
        <meta property="og:description" content="Validate your git commit messages against conventional commits specification" />
        <meta property="og:type" content="website" />
      </Helmet>

      <h1 style={{
        color: '#2d3748',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>Semantic Commit Validator</h1>

      <p style={{
        textAlign: 'center',
        color: '#4a5568',
        marginBottom: '2rem',
        fontSize: '1.1rem'
      }}>
        Free online tool to validate and lint your git commit messages according to conventional commits specification
      </p>

      <div style={{
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#f7fafc',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#4a5568'
      }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#2d3748' }}>
          Supported Commit Types:
        </h2>
        <ul style={{ columns: 2, listStyle: 'none', padding: 0 }}>
          {Object.entries({...REQUIRED_TYPES, ...OPTIONAL_TYPES}).map(([type, desc]) => (
            <li key={type} style={{ marginBottom: '0.5rem' }}>
              <strong>{type}</strong>: {desc}
            </li>
          ))}
        </ul>
      </div>

      <div style={{
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#f7fafc',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#4a5568'
      }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#2d3748' }}>
          Example Messages:
        </h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '0.5rem', fontFamily: 'monospace' }}>feat(auth): add OAuth2 login support</li>
          <li style={{ marginBottom: '0.5rem', fontFamily: 'monospace' }}>fix(api): resolve rate limiting issue</li>
          <li style={{ marginBottom: '0.5rem', fontFamily: 'monospace' }}>feat!: redesign user interface</li>
          <li style={{ marginBottom: '0.5rem', fontFamily: 'monospace' }}>docs(readme): update installation steps</li>
        </ul>
      </div>
      <form onSubmit={validateCommit}>
        <div>
          <textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Enter your commit message (e.g., feat: add new feature)"
            rows={4}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              fontSize: '16px',
              marginBottom: '0.5rem',
              fontFamily: 'monospace'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '1rem',
            fontSize: '14px',
            color: firstLineLength > 100 ? '#e53e3e' : 
                   firstLineLength > 72 ? '#d69e2e' : '#718096'
          }}>
            {firstLineLength} characters 
            <span style={{ marginLeft: '4px', color: '#718096' }}>
              (recommended: 72 | max: 100)
            </span>
          </div>
        </div>
        <button 
          type="submit"
          style={{
            backgroundColor: '#4299e1',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          Validate
        </button>
      </form>

      {validationResult && (
        <div style={{ 
          marginTop: '2rem',
          padding: '1.5rem',
          borderRadius: '8px',
          backgroundColor: validationResult.isValid ? '#f0fff4' : '#fff5f5',
          border: `2px solid ${validationResult.isValid ? '#48bb78' : '#f56565'}`
        }}>
          <h2 style={{ 
            color: validationResult.isValid ? '#2f855a' : '#c53030',
            marginBottom: '1rem'
          }}>
            Validation Result:
          </h2>
          
          {validationResult.isValid ? (
            <div>
              <p style={{ 
                color: '#2f855a',
                fontSize: '18px',
                marginBottom: '1rem'
              }}>✅ Valid semantic commit message</p>
              <pre style={{
                backgroundColor: '#fff',
                padding: '1rem',
                borderRadius: '6px',
                overflowX: 'auto',
                fontSize: '14px'
              }}>
                {JSON.stringify(validationResult.parsed, null, 2)}
              </pre>
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: '#ebf8ff',
                borderRadius: '6px',
                color: '#2b6cb0'
              }}>
                <p>SemVer Impact: {validationResult.semverImpact}</p>
              </div>
            </div>
          ) : (
            <div style={{ color: '#c53030' }}>
              <p style={{ fontSize: '18px' }}>❌ Invalid semantic commit message</p>
              {validationResult.error && (
                <p style={{
                  marginTop: '0.5rem',
                  whiteSpace: 'pre-line'
                }}>{validationResult.error}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add this at the bottom */}
      <footer style={{
        marginTop: '3rem',
        padding: '1rem',
        borderTop: '1px solid #e2e8f0',
        color: '#718096',
        fontSize: '0.9rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <p>
            Related searches: commit linter, git commit validator, conventional commits checker, 
            semantic version validator, commit message format checker
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="https://github.com/emachta/semantic-commit-validator"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                amplitude.track('GitHub Link Click', { location: 'footer' });
              }}
              style={{
                color: '#4299e1',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              GitHub
            </a>
            <a
              href="https://ko-fi.com/ennismachta"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                amplitude.track('Ko-fi Click');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#29abe0',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'transform 0.2s',
                border: 'none'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ marginRight: '0.5rem' }}>☕</span>
              Support on Ko-fi
            </a>
            <a 
              href="#about"
              onClick={toggleAbout}
              style={{
                color: '#4299e1',
                textDecoration: 'none'
              }}
            >
              About
            </a>
          </div>
        </div>
        <div style={{
          backgroundColor: '#EBF8FF',
          borderRadius: '6px',
          padding: '0.75rem',
          color: '#2B6CB0',
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>
          <p>
            💡 Have feedback or found a bug? Please 
            <a
              href="https://github.com/emachta/semantic-commit-validator/issues"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => amplitude.track('GitHub Issues Click')}
              style={{
                color: '#4299E1',
                textDecoration: 'none',
                marginLeft: '0.25rem'
              }}
            >
              open an issue
            </a>
            {' '}or{' '}
            <a
              href="https://github.com/emachta/semantic-commit-validator/pulls"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => amplitude.track('GitHub PRs Click')}
              style={{
                color: '#4299E1',
                textDecoration: 'none'
              }}
            >
              submit a pull request
            </a>
            {' '}on GitHub.
          </p>
        </div>
      </footer>
      
      {showAbout && <About onClose={() => setShowAbout(false)} />}
    </div>
  );
}

export default App;

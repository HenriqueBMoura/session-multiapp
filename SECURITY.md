## Security Policy

### Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please report it responsibly:

1. **Do not** create a public issue
2. Email the maintainer directly with details
3. Include steps to reproduce the vulnerability
4. Allow reasonable time for a fix before disclosure

### Security Considerations

This project is designed for demonstration and educational purposes. For production use, consider:

#### Authentication & Session Management
- Use secure session storage (Redis/database) instead of in-memory
- Implement proper session timeout and cleanup
- Use secure cookie settings (`Secure`, `HttpOnly`, `SameSite`)
- Consider implementing CSRF protection

#### CORS Configuration
- Restrict CORS to specific domains in production
- Avoid wildcard (`*`) origins in production environments
- Validate origin headers properly

#### Data Protection
- Implement input validation and sanitization
- Use HTTPS in all production environments
- Protect sensitive configuration with environment variables
- Implement proper error handling without information disclosure

#### Dependencies
- Regularly update dependencies to latest secure versions
- Use dependency scanning tools
- Monitor for security advisories

### Supported Versions

This is a demonstration project. Security updates will be applied to the main branch only.

### Known Limitations

- Simplified authentication for demo purposes
- In-memory session storage (not suitable for production)
- Basic CORS configuration
- No rate limiting implemented
- No CSRF protection

For production deployments, implement additional security measures appropriate for your environment.
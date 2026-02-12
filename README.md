# Airtel Data Bundles Purchase Platform

A modern web application for purchasing Airtel monthly data bundles using M-Pesa STK push integration.

## Features

- **Modern UI**: Clean, responsive design with Bootstrap 5
- **M-Pesa Integration**: Secure STK push payments
- **Real-time Validation**: Phone number and form validation
- **Multiple Data Plans**: Various monthly bundles to choose from
- **Security**: Rate limiting, input validation, and secure headers
- **Mobile Responsive**: Works perfectly on all devices

## Data Plans Available

| Plan | Data | Price | Validity |
|------|------|-------|----------|
| Starter | 1GB | Ksh 99 | 30 days |
| Value | 2.5GB | Ksh 199 | 30 days |
| Premium | 5GB | Ksh 349 | 30 days |
| Ultra | 10GB | Ksh 599 | 30 days |
| Mega | 20GB | Ksh 999 | 30 days |

## Installation

1. **Clone or download** the project files to your local directory

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your M-Pesa API credentials:
   ```
   MPESA_CONSUMER_KEY=your_consumer_key_here
   MPESA_CONSUMER_SECRET=your_consumer_secret_here
   MPESA_SHORTCODE=your_shortcode_here
   MPESA_PASSKEY=your_passkey_here
   MPESA_CALLBACK_URL=https://your-domain.com/callback
   ```

4. **Start the server**:
   ```bash
   # For development
   npm run dev
   
   # For production
   npm start
   ```

5. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## M-Pesa Integration Setup

To enable real M-Pesa payments, you need to:

1. **Get M-Pesa API credentials** from Safaricom Developer Portal:
   - Create an account at [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
   - Create a new app and get Consumer Key & Secret
   - Set up your PayBill/Till Number as Short Code
   - Generate a Pass Key for STK push

2. **Configure callback URL**:
   - Your callback URL must be publicly accessible
   - Use services like ngrok for testing: `ngrok http 3000`
   - Update the callback URL in your M-Pesa app configuration

3. **Test with sandbox**:
   - Use Safaricom sandbox for testing before going live
   - Sandbox credentials are different from production

## Project Structure

```
airtel/
├── index.html          # Main HTML file
├── styles.css          # Custom CSS styles
├── script.js           # Frontend JavaScript
├── server.js           # Backend Express server
├── package.json        # Node.js dependencies
├── .env.example        # Environment variables template
└── README.md           # This file
```

## Security Features

- **Rate Limiting**: Prevents abuse with request limits
- **Input Validation**: Server-side validation for all inputs
- **Helmet.js**: Security headers for Express
- **CORS**: Cross-origin resource sharing protection
- **Phone Number Validation**: Kenyan phone number format checking

## API Endpoints

- `POST /api/stkpush` - Initiate M-Pesa STK push
- `POST /callback` - M-Pesa callback handler
- `GET /api/transaction/:id` - Check transaction status
- `GET /health` - Health check endpoint

## Deployment

For production deployment:

1. **Use HTTPS** (required for M-Pesa callbacks)
2. **Set NODE_ENV=production**
3. **Use a process manager** like PM2
4. **Configure proper logging**
5. **Set up monitoring** for the application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the package.json file for details.

## Support

For issues and questions:
- Check the M-Pesa API documentation
- Review the server logs for errors
- Ensure all environment variables are correctly set

## Disclaimer

This is a demonstration application. For production use:
- Implement proper database integration
- Add comprehensive error handling
- Set up proper logging and monitoring
- Ensure compliance with all relevant regulations
- Test thoroughly with real M-Pesa integration

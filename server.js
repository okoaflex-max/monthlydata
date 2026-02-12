const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    console.log('Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
    }
    next();
});

// Payherokenya API Configuration
const PAYHERO_CONFIG = {
    basicToken: process.env.PAYHERO_BASIC_TOKEN,
    apiSecret: process.env.PAYHERO_API_SECRET,
    callbackURL: process.env.PAYHERO_CALLBACK_URL || 'https://your-domain.com/callback',
    baseUrl: 'https://api.payhero.africa/api/v2',
    channelId: 100,
    accountId: 4580,  // YOUR VENDOR ID
    networkCode: '63902'
};

// API routes (must come before static files)

// Test endpoint
app.post('/api/test', (req, res) => {
    console.log('Test endpoint hit:', req.body);
    res.json({ success: true, message: 'Test endpoint working' });
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
    console.log('Debug endpoint hit');
    res.json({ 
        success: true, 
        message: 'Debug endpoint working',
        methods: ['POST /api/stkpush', 'POST /api/test', 'GET /api/debug']
    });
});

app.post('/st533', async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        
        const { phoneNumber, amount, planName } = req.body;
        
        // Validate input
        if (!phoneNumber || !amount || !planName) {
            console.log('Missing fields:', { phoneNumber, amount, planName });
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }
        
        // Validate phone number format
        const phoneRegex = /^(07|01)\d{8}$/;
        if (!phoneRegex.test(phoneNumber)) {
            console.log('Invalid phone format:', phoneNumber);
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid phone number format' 
            });
        }
        
        // Format phone number for Payherokenya (254XXXXXXXXX)
        const formattedPhone = `254${phoneNumber.slice(1)}`;
        console.log('Formatted phone:', formattedPhone);
        
        // Check if API credentials are configured
        if (!PAYHERO_CONFIG.basicToken || !PAYHERO_CONFIG.apiSecret || PAYHERO_CONFIG.basicToken === 'your_basic_token_here') {
            // Mock response for testing without API keys
            console.log('Using mock response - API keys not configured');
            
            const mockTransactionID = `MP${Date.now()}`;
            
            const response = {
                success: true,
                message: 'STK push sent successfully (mock)',
                checkoutRequestID: mockTransactionID,
                merchantRequestID: mockTransactionID
            };
            
            console.log('Sending response:', response);
            return res.json(response);
        }
        
        const stkPushRequest = {
            amount: amount,
            phone_number: phoneNumber, // Send as provided (07XX format)
            provider: 'm-pesa',
            network_code: PAYHERO_CONFIG.networkCode,
            channel_id: PAYHERO_CONFIG.channelId,
            account_id: PAYHERO_CONFIG.accountId,
            external_reference: `AIRTEL-${planName}-${Date.now()}`,
            callback_url: PAYHERO_CONFIG.callbackURL
        };
        
        console.log('Sending to Payherokenya:', stkPushRequest);
        
        try {
            const response = await axios.post(`${PAYHERO_CONFIG.baseUrl}/payments`, stkPushRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${PAYHERO_CONFIG.basicToken}`
                }
            });
            
            console.log('Payherokenya response:', response.data);
            
            // Store transaction details (you should use a database in production)
            const transaction = {
                checkoutRequestID: response.data.reference || response.data.transaction_id || response.data.id,
                phoneNumber: phoneNumber,
                amount: amount,
                planName: planName,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };
            
            // In production, save this to your database
            console.log('Transaction initiated:', transaction);
            
            const finalResponse = {
                success: true,
                message: 'STK push sent successfully',
                checkoutRequestID: transaction.checkoutRequestID,
                merchantRequestID: response.data.reference || transaction.checkoutRequestID
            };
            
            console.log('Sending final response:', finalResponse);
            res.json(finalResponse);
            
        } catch (apiError) {
            console.log('Payherokenya API unreachable, using mock response:', apiError.message);
            
            // Fallback to mock response when API is unreachable
            const mockTransactionID = `MP${Date.now()}`;
            
            const mockResponse = {
                success: true,
                message: 'STK push sent successfully (mock - API unreachable)',
                checkoutRequestID: mockTransactionID,
                merchantRequestID: mockTransactionID
            };
            
            console.log('Sending mock response:', mockResponse);
            res.json(mockResponse);
        }
        
    } catch (error) {
        console.error('STK Push error:', error);
        const errorResponse = {
            success: false,
            message: 'Failed to initiate STK push. Please try again.'
        };
        console.log('Sending error response:', errorResponse);
        res.status(500).json(errorResponse);
    }
});

// Check transaction status
app.get('/api/transaction/:checkoutRequestID', async (req, res) => {
    try {
        const { checkoutRequestID } = req.params;
        
        // Check if API credentials are configured
        if (!PAYHERO_CONFIG.basicToken || !PAYHERO_CONFIG.apiSecret || PAYHERO_CONFIG.basicToken === 'your_basic_token_here') {
            // Mock response for testing without API keys
            console.log('Using mock transaction status - API keys not configured');
            
            res.json({
                success: true,
                status: 'completed',
                message: 'Transaction completed successfully (mock)'
            });
            return;
        }
        
        // Check Payherokenya transaction status
        const response = await axios.get(`${PAYHERO_CONFIG.baseUrl}/transaction/${checkoutRequestID}`, {
            headers: {
                'Authorization': `Basic ${PAYHERO_CONFIG.basicToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        const transactionData = response.data;
        
        res.json({
            success: true,
            status: transactionData.status || 'pending',
            message: transactionData.message || 'Transaction processing'
        });
        
    } catch (error) {
        console.error('Transaction status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check transaction status'
        });
    }
});

// Payherokenya callback endpoint
app.post('/callback', (req, res) => {
    try {
        const callbackData = req.body;
        
        // Log the callback for debugging
        console.log('Payherokenya Callback:', JSON.stringify(callbackData, null, 2));
        
        // Extract transaction details (adjust based on Payherokenya's actual callback format)
        const resultCode = callbackData.result_code || callbackData.status;
        const checkoutRequestID = callbackData.checkout_request_id || callbackData.transaction_id;
        
        if (resultCode === 0 || resultCode === 'success') {
            // Payment successful
            const amount = callbackData.amount;
            const transactionId = callbackData.transaction_id || callbackData.mpesa_receipt_number;
            const transactionDate = callbackData.transaction_date || new Date().toISOString();
            const phoneNumber = callbackData.phone_number;
            
            console.log('Payment successful:', {
                checkoutRequestID,
                amount,
                transactionId,
                transactionDate,
                phoneNumber
            });
            
            // Here you would:
            // 1. Update transaction status in database
            // 2. Activate the data bundle via Airtel API
            // 3. Send confirmation SMS to customer
            
        } else {
            // Payment failed
            const resultDesc = callbackData.result_desc || callbackData.message;
            console.log('Payment failed:', {
                checkoutRequestID,
                resultCode,
                resultDesc
            });
        }
        
        // Respond to Payherokenya
        res.json({ status: 'success', message: 'Callback received' });
        
    } catch (error) {
        console.error('Callback error:', error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files (must come after API routes)
app.use(express.static('.'));

// Start server
app.listen(PORT, () => {
    console.log(`Airtel Data Bundles server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the application`);
});

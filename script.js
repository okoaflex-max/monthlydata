// Airtel Data Bundles JavaScript

// Data plans configuration
const dataPlans = [
    {
        id: 'basic',
        name: "Basic",
        data: "5GB",
        price: 300,
        validity: "30 days",
        popular: false,
        features: ["WhatsApp", "Facebook", "Basic browsing"]
    },
    {
        id: 'standard',
        name: "Standard",
        data: "12GB",
        price: 500,
        validity: "30 days",
        popular: true,
        features: ["Social media", "Video streaming", "Unlimited WhatsApp"]
    },
    {
        id: 'premium',
        name: "Premium",
        data: "35GB",
        price: 1000,
        validity: "30 days",
        popular: false,
        features: ["HD streaming", "Gaming", "All social apps"]
    },
    {
        id: 'ultra',
        name: "Ultra",
        data: "40GB",
        price: 1500,
        validity: "30 days",
        popular: true,
        features: ["4K streaming", "Online gaming", "Hotspot enabled"]
    },
    {
        id: 'mega',
        name: "Mega",
        data: "50GB",
        price: 2000,
        validity: "30 days",
        popular: false,
        features: ["Unlimited everything", "5G ready", "Priority support"]
    },
    {
        id: 'ultimate',
        name: "Ultimate",
        data: "65GB",
        price: 3000,
        validity: "30 days",
        popular: true,
        features: ["Unlimited everything", "5G ready", "VIP support", "Free roaming"]
    }
];

let selectedPlan = null;
let airtelNumber = '';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

function initializeEventListeners() {
    // Phone form submission
    document.getElementById('phoneForm').addEventListener('submit', handlePhoneSubmit);
    
    // Pay button
    document.getElementById('payButton').addEventListener('click', initiatePayment);
    
    // Phone number input formatting
    document.getElementById('phoneNumber').addEventListener('input', formatPhoneNumber);
    document.getElementById('mpesaNumber').addEventListener('input', formatPhoneNumber);
}

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    e.target.value = value;
}

function validatePhoneNumber(number) {
    const phoneRegex = /^(07|01)\d{8}$/;
    return phoneRegex.test(number);
}

function handlePhoneSubmit(e) {
    e.preventDefault();
    
    const phoneNumber = document.getElementById('phoneNumber').value;
    const phoneError = document.getElementById('phoneError');
    const phoneSuccess = document.getElementById('phoneSuccess');
    
    // Reset messages
    phoneError.classList.add('d-none');
    phoneSuccess.classList.add('d-none');
    
    if (!validatePhoneNumber(phoneNumber)) {
        phoneError.textContent = 'Invalid Airtel number format. Please enter a valid number (e.g., 712345678)';
        phoneError.classList.remove('d-none');
        return;
    }
    
    // Validate phone number and proceed
    airtelNumber = phoneNumber;
    phoneSuccess.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        Valid Airtel number: +254 ${phoneNumber}
    `;
    phoneSuccess.classList.remove('d-none');
    
    // Show data plans after 1 second
    setTimeout(() => {
        showDataPlans();
    }, 1000);
}

function showDataPlans() {
    const plansContainer = document.getElementById('plansContainer');
    const dataPlansSection = document.getElementById('dataPlans');
    
    // Clear existing plans
    plansContainer.innerHTML = '';
    
    // Generate plan cards
    dataPlans.forEach(plan => {
        const planCard = createPlanCard(plan);
        plansContainer.appendChild(planCard);
    });
    
    // Show section
    dataPlansSection.classList.remove('d-none');
    
    // Scroll to plans
    dataPlansSection.scrollIntoView({ behavior: 'smooth' });
}

function createPlanCard(plan) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    
    col.innerHTML = `
        <div class="card plan-card h-100" data-plan-id="${plan.id}" onclick="selectPlan('${plan.id}')">
            ${plan.popular ? '<div class="popular-badge">POPULAR</div>' : ''}
            <div class="card-body text-center">
                <h5 class="card-title">${plan.name}</h5>
                <div class="plan-data mb-2">${plan.data}</div>
                <div class="plan-price mb-2">Ksh ${plan.price}</div>
                <div class="plan-validity mb-3">
                    <i class="fas fa-calendar-alt me-1"></i>
                    ${plan.validity}
                </div>
                <ul class="features-list text-start">
                    ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            <button class="btn btn-danger btn-sm mt-3" onclick="selectPlan('${plan.id}')">
                Select Plan
            </button>
        </div>
    `;
    
    return col;
}

function selectPlan(planId) {
    console.log('selectPlan called with planId:', planId);
    
    selectedPlan = dataPlans.find(plan => plan.id === planId);
    console.log('selectedPlan found:', selectedPlan);
    console.log('airtelNumber:', airtelNumber);
    
    // Update UI to show selected plan
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-plan-id="${planId}"]`);
    console.log('selectedCard element:', selectedCard);
    
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Show payment section
    showPaymentSection();
}

function showPaymentSection() {
    console.log('showPaymentSection called');
    console.log('selectedPlan:', selectedPlan);
    console.log('airtelNumber:', airtelNumber);
    
    const paymentSection = document.getElementById('paymentSection');
    const selectedPlanInfo = document.getElementById('selectedPlanInfo');
    const confirmPhoneNumber = document.getElementById('confirmPhoneNumber');
    
    console.log('Elements found:', {
        paymentSection: !!paymentSection,
        selectedPlanInfo: !!selectedPlanInfo,
        confirmPhoneNumber: !!confirmPhoneNumber
    });
    
    if (!paymentSection || !selectedPlanInfo || !confirmPhoneNumber) {
        console.error('Missing elements!');
        return;
    }
    
    // Update payment info
    selectedPlanInfo.innerHTML = `
        <strong>${selectedPlan.name} Plan</strong><br>
        ${selectedPlan.data} for Ksh ${selectedPlan.price}<br>
        Valid for ${selectedPlan.validity}
    `;
    
    // Use globally set airtelNumber variable
    confirmPhoneNumber.textContent = `+254 ${airtelNumber}`;
    
    // Show payment section
    paymentSection.classList.remove('d-none');
    
    // Scroll to payment
    paymentSection.scrollIntoView({ behavior: 'smooth' });
    
    console.log('Payment section should now be visible');
}

function initiatePayment() {
    const mpesaNumber = document.getElementById('mpesaNumber').value;
    const payButton = document.getElementById('payButton');
    const paymentStatus = document.getElementById('paymentStatus');
    
    if (!validatePhoneNumber(mpesaNumber)) {
        paymentStatus.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Please enter a valid M-Pesa number
            </div>
        `;
        return;
    }
    
    // Disable button and show loading
    payButton.disabled = true;
    payButton.innerHTML = '<span class="loading-spinner"></span> Processing...';
    paymentStatus.innerHTML = '';
    
    // Make real API call to backend for STK push
    console.log('Sending payment request:', {
        phoneNumber: mpesaNumber,
        amount: selectedPlan.price,
        planName: selectedPlan.name
    });
    
    fetch('/api/stkpush', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            phoneNumber: mpesaNumber,
            amount: selectedPlan.price,
            planName: selectedPlan.name
        })
    })
    .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.text().then(text => {
            console.log('Raw response text:', text);
            if (!text) {
                throw new Error('Empty response from server');
            }
            return JSON.parse(text);
        });
    })
    .then(data => {
        console.log('Parsed response data:', data);
        
        if (data.success) {
            // STK push sent successfully
            paymentStatus.innerHTML = `
                <div class="stk-push-animation">
                    <i class="fas fa-mobile-alt"></i>
                    <h5>STK Push Sent!</h5>
                    <p>Check your phone (+254 ${mpesaNumber}) for the M-Pesa prompt</p>
                    <p>Enter your PIN to complete the purchase</p>
                    <div class="spinner-border text-danger" role="status">
                        <span class="visually-hidden">Waiting for payment...</span>
                    </div>
                </div>
            `;
            
            // Store checkout request ID for status checking
            const checkoutRequestID = data.checkoutRequestID;
            console.log('Checkout Request ID:', checkoutRequestID);
            
            // Poll for transaction status
            checkTransactionStatus(checkoutRequestID);
        } else {
            throw new Error(data.message || 'Failed to initiate payment');
        }
    })
    .catch(error => {
        console.error('Payment error:', error);
        console.error('Error details:', error.message, error.stack);
        
        paymentStatus.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${error.message || 'Payment failed. Please try again.'}
            </div>
        `;
        payButton.disabled = false;
        payButton.innerHTML = '<i class="fas fa-lock me-2"></i> Pay with M-Pesa STK Push';
    });
}

function checkTransactionStatus(checkoutRequestID) {
    const maxAttempts = 30; // Check for 5 minutes (30 attempts × 10 seconds)
    let attempts = 0;
    
    const pollInterval = setInterval(() => {
        attempts++;
        
        fetch(`/api/transaction/${checkoutRequestID}`)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.status === 'completed') {
                    // Transaction successful
                    clearInterval(pollInterval);
                    completePayment();
                } else if (data.status === 'failed') {
                    // Transaction failed
                    clearInterval(pollInterval);
                    const paymentStatus = document.getElementById('paymentStatus');
                    const payButton = document.getElementById('payButton');
                    
                    paymentStatus.innerHTML = `
                        <div class="alert alert-danger">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            Transaction failed. Please try again.
                        </div>
                    `;
                    payButton.disabled = false;
                    payButton.innerHTML = '<i class="fas fa-lock me-2"></i> Pay with M-Pesa STK Push';
                } else if (attempts >= maxAttempts) {
                    // Timeout
                    clearInterval(pollInterval);
                    const paymentStatus = document.getElementById('paymentStatus');
                    const payButton = document.getElementById('payButton');
                    
                    paymentStatus.innerHTML = `
                        <div class="alert alert-warning">
                            <i class="fas fa-clock me-2"></i>
                            Payment timeout. Please check your M-Pesa transaction history and try again if needed.
                        </div>
                    `;
                    payButton.disabled = false;
                    payButton.innerHTML = '<i class="fas fa-lock me-2"></i> Pay with M-Pesa STK Push';
                }
            })
            .catch(error => {
                console.error('Status check error:', error);
                if (attempts >= maxAttempts) {
                    clearInterval(pollInterval);
                    const paymentStatus = document.getElementById('paymentStatus');
                    const payButton = document.getElementById('payButton');
                    
                    paymentStatus.innerHTML = `
                        <div class="alert alert-warning">
                            <i class="fas fa-clock me-2"></i>
                            Unable to verify payment status. Please check your M-Pesa transaction history.
                        </div>
                    `;
                    payButton.disabled = false;
                    payButton.innerHTML = '<i class="fas fa-lock me-2"></i> Pay with M-Pesa STK Push';
                }
            });
    }, 10000); // Check every 10 seconds
}

function completePayment() {
    const paymentStatus = document.getElementById('paymentStatus');
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    const successDetails = document.getElementById('successDetails');
    
    // Show success
    paymentStatus.innerHTML = `
        <div class="alert alert-success">
            <i class="fas fa-check-circle me-2"></i>
            Payment successful! Your data bundle will be activated shortly.
        </div>
    `;
    
    // Update modal details
    successDetails.innerHTML = `
        <div class="success-checkmark text-center mb-3">
            <i class="fas fa-check-circle"></i>
        </div>
        <p><strong>Transaction Details:</strong></p>
        <ul class="list-unstyled">
            <li><strong>Plan:</strong> ${selectedPlan.name}</li>
            <li><strong>Data:</strong> ${selectedPlan.data}</li>
            <li><strong>Amount:</strong> Ksh ${selectedPlan.price}</li>
            <li><strong>Airtel Number:</strong> +254 ${airtelNumber}</li>
            <li><strong>Transaction ID:</strong> MP${Date.now()}</li>
            <li><strong>Activation Time:</strong> Within 5 minutes</li>
        </ul>
    `;
    
    // Show modal
    successModal.show();
}

function resetForm() {
    // Reset all form data
    document.getElementById('phoneForm').reset();
    document.getElementById('mpesaNumber').value = '';
    document.getElementById('phoneError').classList.add('d-none');
    document.getElementById('phoneSuccess').classList.add('d-none');
    document.getElementById('dataPlans').classList.add('d-none');
    document.getElementById('paymentSection').classList.add('d-none');
    document.getElementById('paymentStatus').innerHTML = '';
    
    // Reset button
    const payButton = document.getElementById('payButton');
    payButton.disabled = false;
    payButton.innerHTML = '<i class="fas fa-lock me-2"></i> Pay with M-Pesa STK Push';
    
    // Reset variables
    selectedPlan = null;
    airtelNumber = '';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('successModal')).hide();
}

// Test function to verify everything is working
function testFunctions() {
    console.log('=== TESTING FUNCTIONS ===');
    console.log('dataPlans:', dataPlans);
    console.log('selectPlan function exists:', typeof selectPlan);
    console.log('showPaymentSection function exists:', typeof showPaymentSection);
    
    // Test selectPlan directly
    selectPlan('basic');
    console.log('After calling selectPlan(basic):');
    console.log('selectedPlan:', selectedPlan);
    
    // Test showPaymentSection directly
    showPaymentSection();
}

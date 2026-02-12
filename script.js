// Airtel Data Bundles JavaScript - Fixed Version v2.0

// Data plans configuration
const dataPlans = [
    {
        id: 'basic',
        name: 'Basic',
        data: '5GB',
        price: 300,
        validity: '30 days',
        popular: false,
        features: ['WhatsApp', 'Facebook', 'Basic browsing']
    },
    {
        id: 'standard',
        name: 'Standard',
        data: '12GB',
        price: 500,
        validity: '30 days',
        popular: true,
        features: ['Social media', 'Video streaming', 'Unlimited WhatsApp']
    },
    {
        id: 'premium',
        name: 'Premium',
        data: '35GB',
        price: 1000,
        validity: '30 days',
        popular: false,
        features: ['HD streaming', 'Gaming', 'All social apps']
    },
    {
        id: 'ultra',
        name: 'Ultra',
        data: '40GB',
        price: 1500,
        validity: '30 days',
        popular: true,
        features: ['4K streaming', 'Online gaming', 'Hotspot enabled']
    },
    {
        id: 'mega',
        name: 'Mega',
        data: '50GB',
        price: 2000,
        validity: '30 days',
        popular: false,
        features: ['Unlimited everything', '5G ready', 'Priority support']
    },
    {
        id: 'ultimate',
        name: 'Ultimate',
        data: '65GB',
        price: 3000,
        validity: '30 days',
        popular: true,
        features: ['Unlimited everything', '5G ready', 'VIP support', 'Free roaming']
    }
];

let selectedPlan = null;
let airtelNumber = '';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript loaded successfully');
    setupEventListeners();
});

function setupEventListeners() {
    // Phone form submission
    const phoneForm = document.getElementById('phoneForm');
    if (phoneForm) {
        phoneForm.addEventListener('submit', handlePhoneSubmit);
    }
    
    // Pay button
    const payButton = document.getElementById('payButton');
    if (payButton) {
        payButton.addEventListener('click', initiatePayment);
    }
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
    if (phoneError) phoneError.classList.add('d-none');
    if (phoneSuccess) phoneSuccess.classList.add('d-none');
    
    if (!validatePhoneNumber(phoneNumber)) {
        if (phoneError) {
            phoneError.textContent = 'Invalid Airtel number format. Please enter a valid number (e.g., 712345678)';
            phoneError.classList.remove('d-none');
        }
        return;
    }
    
    // Store phone number and proceed
    airtelNumber = phoneNumber;
    if (phoneSuccess) {
        phoneSuccess.innerHTML = '<i class="fas fa-check-circle me-2"></i>Valid Airtel number: +254 ' + phoneNumber;
        phoneSuccess.classList.remove('d-none');
    }
    
    // Show data plans after 1 second
    setTimeout(showDataPlans, 1000);
}

function showDataPlans() {
    const plansContainer = document.getElementById('plansContainer');
    const dataPlansSection = document.getElementById('dataPlans');
    
    if (!plansContainer || !dataPlansSection) {
        console.error('Required elements not found');
        return;
    }
    
    // Clear existing plans
    plansContainer.innerHTML = '';
    
    // Generate plan cards
    dataPlans.forEach(plan => {
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
        
        plansContainer.appendChild(col);
    });
    
    // Show section
    dataPlansSection.classList.remove('d-none');
    
    // Scroll to plans
    dataPlansSection.scrollIntoView({ behavior: 'smooth' });
}

function selectPlan(planId) {
    console.log('selectPlan called with planId:', planId);
    
    selectedPlan = dataPlans.find(plan => plan.id === planId);
    console.log('selectedPlan found:', selectedPlan);
    
    if (!selectedPlan) {
        console.error('Plan not found:', planId);
        return;
    }
    
    // Update UI to show selected plan
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-plan-id="${planId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Show payment section
    showPaymentSection();
}

function showPaymentSection() {
    const paymentSection = document.getElementById('paymentSection');
    const selectedPlanInfo = document.getElementById('selectedPlanInfo');
    const confirmPhoneNumber = document.getElementById('confirmPhoneNumber');
    
    if (!paymentSection || !selectedPlanInfo || !confirmPhoneNumber) {
        console.error('Required elements not found');
        return;
    }
    
    // Update payment info
    selectedPlanInfo.innerHTML = `
        <strong>${selectedPlan.name} Plan</strong><br>
        ${selectedPlan.data} for Ksh ${selectedPlan.price}<br>
        Valid for ${selectedPlan.validity}
    `;
    
    // Use globally set airtelNumber variable
    confirmPhoneNumber.textContent = '+254 ' + airtelNumber;
    
    // Show payment section
    paymentSection.classList.remove('d-none');
    
    // Scroll to payment
    paymentSection.scrollIntoView({ behavior: 'smooth' });
}

function initiatePayment() {
    const mpesaNumber = document.getElementById('mpesaNumber').value;
    const payButton = document.getElementById('payButton');
    const paymentStatus = document.getElementById('paymentStatus');
    
    if (!validatePhoneNumber(mpesaNumber)) {
        if (paymentStatus) {
            paymentStatus.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Please enter a valid M-Pesa number
                </div>
            `;
        }
        return;
    }
    
    // Disable button and show loading
    if (payButton) {
        payButton.disabled = true;
        payButton.innerHTML = '<span class="loading-spinner"></span> Processing...';
    }
    
    if (paymentStatus) {
        paymentStatus.innerHTML = '';
    }
    
    // Make API call to backend for STK push
    fetch('/st533', {
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
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Payment response:', data);
        
        if (data.success) {
            // STK push sent successfully
            if (paymentStatus) {
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
            }
            
            // Poll for transaction status
            if (data.checkoutRequestID) {
                checkTransactionStatus(data.checkoutRequestID);
            }
        } else {
            throw new Error(data.message || 'Failed to initiate payment');
        }
    })
    .catch(error => {
        console.error('Payment error:', error);
        if (paymentStatus) {
            paymentStatus.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    ${error.message || 'Payment failed. Please try again.'}
                </div>
            `;
        }
        if (payButton) {
            payButton.disabled = false;
            payButton.innerHTML = '<i class="fas fa-lock me-2"></i> Pay with M-Pesa STK Push';
        }
    });
}

function checkTransactionStatus(checkoutRequestID) {
    // Poll for transaction status
    const pollInterval = setInterval(() => {
        fetch(`/api/transaction/${checkoutRequestID}`)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.status === 'completed') {
                    clearInterval(pollInterval);
                    showSuccessModal();
                }
            })
            .catch(error => {
                console.error('Status check error:', error);
            });
    }, 5000);
}

function showSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        const modal = new bootstrap.Modal(successModal);
        modal.show();
    }
}

// success.js - Extract Stripe session ID and user ID from URL and verify checkout
document.addEventListener('DOMContentLoaded', function() {
    // Extract URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const userId = urlParams.get('user_id');

    // Status message element
    const statusMessage = document.getElementById('status-message');

    // Make sure we have both parameters
    if (!sessionId || !userId) {
        if (statusMessage) {
            statusMessage.innerText = 'Error: Missing session or user information.';
            statusMessage.className = 'error';
        }
        console.error('Missing required parameters: session_id or user_id');
        return;
    }

    // Update UI to show verification in progress
    if (statusMessage) {
        statusMessage.innerText = 'Verifying your subscription...';
    }

    // Send verification request to the webhook server
    fetch('/verify-checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session_id: sessionId,
            user_id: userId
        })
    })
    .then(response => {
        // Log the raw response for debugging
        console.log('Response status:', response.status);
        console.log('Response headers:', Array.from(response.headers.entries()));

        // Try to get the text first for logging
        return response.text().then(text => {
            console.log('Response text:', text);
            try {
                // Try to parse the text as JSON
                return JSON.parse(text);
            } catch (parseError) {
                console.error('Failed to parse JSON:', parseError);
                throw new Error('Invalid JSON response: ' + text);
            }
        });
    })
    .then(data => {
        if (data.status === 'success') {
            // Show success message
            if (statusMessage) {
                statusMessage.innerText = 'Subscription confirmed! Your bot access has been upgraded.';
                statusMessage.className = 'success';
            }
            console.log('Subscription verified successfully');
        } else {
            // Show error message
            if (statusMessage) {
                statusMessage.innerText = 'Error: ' + (data.message || 'Could not verify subscription.');
                statusMessage.className = 'error';
            }
            console.error('Verification error:', data.message);
        }
    })
    .catch(error => {
        // More detailed error handling
        console.error('Full error:', error);

        // Show error message
        if (statusMessage) {
            statusMessage.innerText = 'Error contacting the server. Please contact support.' +
                                      (error.message ? ` (${error.message})` : '');
            statusMessage.className = 'error';
        }
    });
});
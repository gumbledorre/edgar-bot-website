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
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Show success message
            if (statusMessage) {
                statusMessage.innerText = 'Subscription confirmed! Your bot access has been upgraded.';
                statusMessage.className = 'success';

                // Add more detailed information
                const statusContainer = document.getElementById('status-container');
                if (statusContainer) {
                    const detailsDiv = document.createElement('div');
                    detailsDiv.className = 'details';
                    detailsDiv.innerHTML = `
                        <p>Your subscription has been successfully activated. You can now enjoy all the premium features!</p>
                        <p>If you don't see the upgraded features immediately, please allow up to 5 minutes for the changes to take effect or restart your Discord client.</p>
                    `;
                    statusContainer.appendChild(detailsDiv);
                }
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
        // Show error message
        if (statusMessage) {
            statusMessage.innerText = 'Error contacting the server. Please contact support.';
            statusMessage.className = 'error';
        }
        console.error('Fetch error:', error);
    });
});
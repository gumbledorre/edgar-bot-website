// cancel.js - Log subscription cancellation and handle cancel page behavior
document.addEventListener('DOMContentLoaded', function() {
    // Extract URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');

    // Status message element
    const statusMessage = document.getElementById('status-message');

    // If we have a user ID, log the cancellation
    if (userId) {
        // Update UI to show logging in progress (if status element exists)
        if (statusMessage) {
            statusMessage.innerText = 'Recording cancellation...';
        }

        // Send cancellation log to the webhook server
        fetch('/log-cancellation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Show acknowledgment message
                if (statusMessage) {
                    statusMessage.innerText = 'Your cancellation has been recorded.';
                    statusMessage.className = 'info';
                }
                console.log('Cancellation logged successfully');
            } else {
                // Don't show error to user - silently log it
                console.error('Logging error:', data.message);
            }
        })
        .catch(error => {
            // Don't show error to user - silently log it
            console.error('Fetch error:', error);
        });
    } else {
        console.log('No user ID provided, skipping cancellation logging');
    }
});
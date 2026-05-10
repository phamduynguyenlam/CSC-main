// Updated service to use backend API for the Knot API integration.

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';

interface KnotApiResponse {
    success: boolean;
    message: string;
    transactionId?: string;
}

/**
 * Initiates a transaction review process for a given user via the backend API.
 * @param {string} userId - The identifier for the user whose transactions are to be reviewed.
 * @returns {Promise<KnotApiResponse>} - A promise that resolves with the result of the API call.
 */
export const initiateTransactionReview = async (userId: string): Promise<KnotApiResponse> => {
    console.log(`[Knot API] Initiating transaction review for user: ${userId}`);

    try {
        const response = await fetch(`${API_BASE_URL}/api/knot/transaction-review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            console.log(`[Knot API] Successfully started review. Transaction ID: ${data.transactionId}`);
        } else {
            console.error(`[Knot API] Failed to initiate review for user: ${userId}`);
        }

        return data;
    } catch (error) {
        console.error(`[Knot API] Error initiating transaction review:`, error);
        return {
            success: false,
            message: `Failed to start transaction review for user ${userId}. Please try again.`,
        };
    }
};

/**
 * Gets the status of a transaction review.
 * @param {string} transactionId - The transaction ID to check status for.
 * @returns {Promise<any>} - A promise that resolves with the transaction status.
 */
export const getTransactionStatus = async (transactionId: string): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/knot/transaction/${transactionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`[Knot API] Error getting transaction status:`, error);
        return {
            transactionId,
            status: 'error',
            message: 'Failed to retrieve transaction status'
        };
    }
};

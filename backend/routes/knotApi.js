import express from 'express';

const router = express.Router();

// Simulate Knot API - Initiate transaction review
router.post('/transaction-review', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    console.log(`[Knot API] Initiating transaction review for user: ${userId}`);

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isSuccess = Math.random() > 0.1; // 90% chance of success for demo
    
    if (isSuccess) {
      const transactionId = `knot_trx_${Math.random().toString(36).substr(2, 9)}`;
      console.log(`[Knot API] Successfully started review. Transaction ID: ${transactionId}`);
      
      res.json({
        success: true,
        message: `Successfully initiated transaction review for user ${userId}.`,
        transactionId: transactionId,
      });
    } else {
      console.error(`[Knot API] Failed to initiate review for user: ${userId}`);
      res.status(500).json({
        success: false,
        message: `Failed to start transaction review for user ${userId}. Please try again.`,
      });
    }
  } catch (error) {
    console.error('Error in transaction review:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while processing transaction review.'
    });
  }
});

// Get transaction status
router.get('/transaction/:transactionId', (req, res) => {
  const { transactionId } = req.params;
  
  // Simulate transaction status check
  const statuses = ['pending', 'in-progress', 'completed', 'failed'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  res.json({
    transactionId,
    status: randomStatus,
    timestamp: new Date().toISOString(),
    details: `Transaction ${transactionId} is currently ${randomStatus}.`
  });
});

export default router;
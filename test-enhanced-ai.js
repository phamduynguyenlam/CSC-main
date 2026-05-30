#!/usr/bin/env node

// Test script for enhanced AI chatbot with business context
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001/api/gemini/ask';

const testQueries = [
    {
        name: "Business Metrics Query",
        message: "How are our current business metrics performing?"
    },
    {
        name: "Customer Sentiment Query", 
        message: "What insights do you see in our customer sentiment trends?"
    },
    {
        name: "Sales Performance Query",
        message: "Can you analyze our sales performance and provide recommendations?"
    }
];

async function testEnhancedChatbot() {

    for (const query of testQueries) {
        console.log(`📊 Testing: ${query.name}`);
        console.log(`❓ Query: "${query.message}"`);
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: query.message,
                    conversationHistory: []
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                console.log(`✅ Success: ${data.success}`);
                console.log(`🤖 Response: ${data.response.substring(0, 200)}...`);
                console.log(`💭 User Sentiment: ${data.sentiment.emotion} (${data.context.confidenceScore}/10)`);
                console.log(`📈 Business Data Used: ${data.metadata.fallback ? 'No (Fallback)' : 'Yes (Live Data)'}`);
                
                // Check if response contains specific business metrics
                const hasMetrics = /(\d+(\.\d+)?[%$]|\d+\s*(calls|users|revenue|sentiment))/i.test(data.response);
                console.log(`📊 Contains Specific Metrics: ${hasMetrics ? 'Yes' : 'No'}`);
                
            } else {
                console.log(`❌ HTTP Error: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
        
        console.log("\n" + "─".repeat(80) + "\n");
    }
}

testEnhancedChatbot().then(() => {
    console.log("🎉 Testing complete!");
    process.exit(0);
}).catch(error => {
    console.error("❌ Test failed:", error);
    process.exit(1);
});
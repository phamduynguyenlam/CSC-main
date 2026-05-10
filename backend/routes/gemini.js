/**
 * SentiMind Sentiment Analysis Engine
 * 
 * This module provides comprehensive sentiment analysis for customer experience monitoring.
 * It includes both AI-powered analysis (Google Gemini) and a robust fallback system
 * for real-time emotion detection and agent assistance.
 * 
 * Features:
 * - 10 distinct emotion categories
 * - 1-10 sentiment scoring
 * - Contextual agent suggestions
 * - Intelligent keyword analysis
 * - Performance-optimized fallback system
 * 
 * @author SentiMind Team
 * @version 2.0
 * @since 2025-11-08
 */

import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import vader from 'vader-sentiment';

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

/**
 * Advanced VADER-based sentiment analysis engine
 * 
 * This function uses the VADER (Valence Aware Dictionary and sEntiment Reasoner) lexicon
 * for more accurate sentiment analysis, especially for social media text and customer feedback.
 * VADER is specifically designed to handle slang, emoticons, capitalization, and punctuation.
 * 
 * @param {string} text - The customer's text input to analyze
 * @returns {Object} Analysis result containing emotion, score, and suggestions
 * 
 * VADER provides:
 * - Compound score (-1 to 1): Overall sentiment polarity
 * - Positive score (0 to 1): Proportion of positive sentiment
 * - Negative score (0 to 1): Proportion of negative sentiment  
 * - Neutral score (0 to 1): Proportion of neutral sentiment
 */
function analyzeTextSentiment(text) {
  // Enhanced VADER-based sentiment analysis
  const vaderSentimentAnalysis = (text) => {
    // Get VADER scores
    const vaderResults = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    
    // Extract VADER components
    const { compound, pos, neg, neu } = vaderResults;
    
    // Convert compound score (-1 to 1) to our 1-10 scale
    let sentimentScore = ((compound + 1) / 2) * 9 + 1; // Maps -1->1, 1->10
    
    // Determine emotion based on VADER scores and text analysis
    let detectedEmotion = 'Neutral';
    let intensity = 'medium';
    let priority = 'medium';
    let keyIndicators = [];
    
    // WORD-FOCUSED emotion classification (prioritizing explicit keywords over tone)
    const emotionRules = {
      // Positive word analysis (exact keyword matching gets priority)
      'Excited': {
        keywords: ['excited', 'amazing', 'fantastic', 'incredible', 'awesome', 'love it', 'perfect', 'excellent', 'brilliant', 'outstanding', 'spectacular', 'phenomenal', 'superb', 'magnificent'],
        phrases: ['love this', 'absolutely amazing', 'this is awesome', 'so excited', 'really amazing'],
        score: 9,
        priority: 'low',
        keywordWeight: 3.0  // High weight for exact matches
      },
      'Happy': {
        keywords: ['happy', 'pleased', 'delighted', 'great', 'wonderful', 'good', 'nice', 'cool', 'glad', 'joy', 'cheerful', 'content'],
        phrases: ['really happy', 'so pleased', 'this is great', 'very good', 'quite happy'],
        score: 7.5,
        priority: 'low',
        keywordWeight: 2.5
      },
      'Grateful': {
        keywords: ['thank', 'thanks', 'appreciate', 'grateful', 'helpful', 'thankful', 'blessing', 'appreciate it'],
        phrases: ['thank you', 'really appreciate', 'so helpful', 'much appreciated', 'very grateful'],
        score: 8.5,
        priority: 'low',
        keywordWeight: 3.0
      },
      'Satisfied': {
        keywords: ['satisfied', 'fine', 'okay', 'good enough', 'works', 'alright', 'adequate', 'sufficient', 'acceptable'],
        phrases: ['that works', 'good enough', 'seems fine', 'i am satisfied', 'this is fine'],
        score: 6.5,
        priority: 'low',
        keywordWeight: 2.0
      },
      
      // Negative word analysis (explicit negative words)
      'Angry': {
        keywords: ['furious', 'hate', 'ridiculous', 'unacceptable', 'fed up', 'livid', 'outraged', 'disgusted', 'enraged', 'infuriated', 'mad'],
        phrases: ['fed up with', 'absolutely ridiculous', 'completely unacceptable', 'hate this', 'so angry','fucking pissed','shitty service'],
        score: 1.5,
        priority: 'high',
        keywordWeight: 3.5
      },
      'Frustrated': {
        keywords: ['frustrated', 'annoying', 'irritating', 'doesn\'t work', 'not working', 'broken', 'useless', 'terrible', 'awful','shitty','fucking'],
        phrases: ['doesn\'t work', 'keep trying', 'still doesn\'t', 'same problem', 'every time', 'not working','fucking hell','this is shitty','you\'re an asshole'],
        score: 2.5,
        priority: 'high',
        keywordWeight: 3.0
      },
      'Disappointed': {
        keywords: ['disappointed', 'expected better', 'let down', 'underwhelming', 'not good', 'worse than expected', 'disappointing'],
        phrases: ['expected better', 'not what i', 'thought it would', 'worse than expected', 'let me down'],
        score: 3,
        priority: 'medium',
        keywordWeight: 2.5
      },
      'Concerned': {
        keywords: ['worried', 'concerned', 'anxious', 'nervous', 'uncertain', 'doubtful', 'hesitant', 'unsure'],
        phrases: ['worried about', 'not sure if', 'concerned that', 'what if', 'hope this works'],
        score: 4,
        priority: 'medium',
        keywordWeight: 2.0
      },
      'Confused': {
        keywords: ['confused', 'unclear', 'don\'t understand', 'complicated', 'lost', 'perplexed', 'puzzled', 'baffled'],
        phrases: ['don\'t understand', 'not clear', 'how do i', 'what does this mean', 'makes no sense'],
        score: 4.5,
        priority: 'low',
        keywordWeight: 2.0
      }
    };
    
    // Intensity markers for better classification
    const intensityMarkers = {
      high: ['really', 'very', 'extremely', 'absolutely', 'completely', 'so', 'totally', 'super'],
      emphasis: ['!!!', '!!!!', 'ALL CAPS', 'URGENT', '???'],
      escalation: ['always', 'never', 'every time', 'constantly', 'still', 'again']
    };
    
    // Calculate intensity based on VADER scores and text markers
    const lowerText = text.toLowerCase();
    let intensityScore = Math.abs(compound); // Base intensity from VADER
    
    // Check for intensity markers
    Object.values(intensityMarkers).flat().forEach(marker => {
      if (lowerText.includes(marker.toLowerCase()) || text.includes(marker)) {
        intensityScore += 0.2;
      }
    });
    
    // Check for capitalization (VADER handles this but we can enhance)
    const capsWords = text.match(/[A-Z]{2,}/g) || [];
    if (capsWords.length > 0) {
      intensityScore += capsWords.length * 0.1;
    }
    
    // Set intensity level
    if (intensityScore > 0.7) {
      intensity = 'high';
    } else if (intensityScore > 0.4) {
      intensity = 'medium';
    } else {
      intensity = 'low';
    }
    
    // Find best matching emotion - WORD-FOCUSED ANALYSIS
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [emotionName, rules] of Object.entries(emotionRules)) {
      let matchScore = 0;
      let foundKeywords = [];
      let foundPhrases = [];
      
      // PRIMARY: Direct keyword matching (main scoring factor)
      rules.keywords.forEach(keyword => {
        if (lowerText.includes(keyword.toLowerCase())) {
          matchScore += rules.keywordWeight || 1.0;
          foundKeywords.push(keyword);
        }
      });
      
      // SECONDARY: Phrase matching (gets higher weight)
      if (rules.phrases) {
        rules.phrases.forEach(phrase => {
          if (lowerText.includes(phrase.toLowerCase())) {
            matchScore += (rules.keywordWeight || 1.0) * 1.5;
            foundPhrases.push(phrase);
          }
        });
      }
      
      // TERTIARY: VADER as minor modifier only (not primary factor)
      if (foundKeywords.length > 0 || foundPhrases.length > 0) {
        // Small VADER boost only when words already match
        const vaderBonus = Math.abs(compound) * 0.3;
        matchScore += vaderBonus;
      }
      
      // Priority weighting (only applies when keywords found)
      if (foundKeywords.length > 0 || foundPhrases.length > 0) {
        const priorityMultiplier = rules.priority === 'high' ? 1.3 : 
                                 rules.priority === 'medium' ? 1.1 : 1.0;
        matchScore *= priorityMultiplier;
        
        console.log(`Word Match - ${emotionName}: ${foundKeywords.length} keywords, ${foundPhrases.length} phrases, final score: ${matchScore.toFixed(2)}`);
        
        if (matchScore > bestScore) {
          bestScore = matchScore;
          bestMatch = {
            emotion: emotionName,
            score: rules.score,
            priority: rules.priority,
            keywords: foundKeywords,
            phrases: foundPhrases,
            matchScore: matchScore,
            confidence: Math.min(95, 50 + (foundKeywords.length * 12) + (foundPhrases.length * 18)),
            method: 'word-analysis'
          };
        }
      }
    }
    
    // Apply best match or use VADER-only classification
    if (bestMatch) {
      detectedEmotion = bestMatch.emotion;
      sentimentScore = bestMatch.score;
      priority = bestMatch.priority;
      keyIndicators = bestMatch.keywords || [];
      
      console.log(`Selected: ${detectedEmotion} (score: ${sentimentScore}, method: word-analysis)`);
    } else {
      // Fallback to VADER-only analysis when no keywords match
      if (compound >= 0.3) {
        detectedEmotion = 'Happy';
        sentimentScore = 5.5 + (compound * 4);
      } else if (compound >= 0.1) {
        detectedEmotion = 'Satisfied';
        sentimentScore = 5 + (compound * 2);
      } else if (compound <= -0.3) {
        detectedEmotion = 'Frustrated';
        sentimentScore = 3 - (compound * 2);
      } else if (compound <= -0.1) {
        detectedEmotion = 'Concerned';
        sentimentScore = 4.5 + compound;
      } else {
        detectedEmotion = 'Neutral';
        sentimentScore = 5;
      }
      
      console.log(`Fallback: ${detectedEmotion} (VADER only: ${compound.toFixed(3)})`);
    }
    
    // Adjust priority based on intensity
    if (intensity === 'high' && ['Angry', 'Frustrated', 'Disappointed'].includes(detectedEmotion)) {
      priority = 'high';
    }
    
    return {
      emotion: detectedEmotion,
      sentimentScore: Math.max(1, Math.min(10, sentimentScore)),
      intensity: intensity,
      keyIndicators: keyIndicators,
      priority: priority,
      vaderScores: {
        compound: compound,
        positive: pos,
        negative: neg,
        neutral: neu
      },
      // Add enhanced coaching features
      suggestion: getSuggestion(detectedEmotion),
      recommendedTone: priority === 'high' ? 'empathetic' : detectedEmotion === 'Excited' ? 'enthusiastic' : 'professional',
      coachingTips: getCoachingTips(detectedEmotion),
      phraseExamples: getPhraseExamples(detectedEmotion),
      warningFlags: getWarningFlags(detectedEmotion)
    };
  };

  // Helper functions for enhanced coaching
  function getSuggestion(emotion) {
    const suggestions = {
      'Happy': "Customer is satisfied! Maintain this positive experience and consider upselling opportunities.",
      'Satisfied': "Good interaction. Continue providing excellent service and ask if there's anything else needed.",
      'Grateful': "Customer appreciates the service. This is a great opportunity to strengthen the relationship.",
      'Excited': "Customer is very enthusiastic! Capitalize on this energy and explore additional ways to help.",
      'Frustrated': "Customer is frustrated. Acknowledge their feelings, apologize for the inconvenience, and focus on immediate resolution.",
      'Angry': "Customer is angry. Stay calm, listen actively, apologize sincerely, and escalate if necessary.",
      'Disappointed': "Customer had higher expectations. Acknowledge the disappointment and work to exceed expectations moving forward.",
      'Confused': "Customer needs clarification. Slow down, explain step-by-step, and ensure understanding before proceeding.",
      'Concerned': "Customer has concerns. Address them directly with reassurance and detailed information.",
      'Neutral': "Customer seems neutral. Engage proactively to understand their needs and provide helpful assistance."
    };
    return suggestions[emotion] || suggestions['Neutral'];
  }

  function getCoachingTips(emotion) {
    const tips = {
      'Happy': ['Continue the positive momentum', 'Ask if there\'s anything else you can help with', 'This is a good time to ask for feedback'],
      'Satisfied': ['Maintain professional service quality', 'Confirm all concerns are addressed', 'End on a positive note'],
      'Grateful': ['Accept thanks graciously', 'Reinforce your commitment to service', 'Ask how else you can assist'],
      'Excited': ['Match their enthusiasm appropriately', 'Provide detailed information they\'re seeking', 'Explore additional ways to help'],
      'Frustrated': ['Acknowledge their frustration immediately', 'Use empathetic language', 'Focus on concrete solutions'],
      'Angry': ['Stay calm and professional', 'Listen without interrupting', 'Prepare to escalate if needed'],
      'Disappointed': ['Acknowledge their disappointment', 'Avoid making excuses', 'Focus on making it right'],
      'Confused': ['Speak slowly and clearly', 'Break down information into steps', 'Check for understanding frequently'],
      'Concerned': ['Address concerns directly', 'Provide reassuring information', 'Offer additional support'],
      'Neutral': ['Engage proactively', 'Ask clarifying questions', 'Show genuine interest in helping']
    };
    return tips[emotion] || tips['Neutral'];
  }

  function getPhraseExamples(emotion) {
    const phrases = {
      'Happy': ['I\'m so glad to hear that!', 'That\'s wonderful news!', 'Is there anything else I can help you with today?'],
      'Satisfied': ['I\'m pleased I could help', 'Thank you for your patience', 'Let me know if you need anything else'],
      'Grateful': ['You\'re very welcome!', 'I\'m happy I could assist you', 'It\'s my pleasure to help'],
      'Excited': ['I love your enthusiasm!', 'That sounds fantastic!', 'I\'m excited to help you with this'],
      'Frustrated': ['I completely understand your frustration', 'Let me help resolve this right away', 'I can see why this would be frustrating'],
      'Angry': ['I sincerely apologize for this issue', 'I want to make this right for you', 'Let me escalate this to my supervisor'],
      'Disappointed': ['I\'m sorry this didn\'t meet your expectations', 'Let me see how I can improve this situation', 'I want to make this right'],
      'Confused': ['Let me explain that more clearly', 'I\'ll walk you through this step by step', 'Does this make sense so far?'],
      'Concerned': ['I understand your concerns', 'Let me address those worries', 'I\'m here to help resolve this'],
      'Neutral': ['How can I assist you today?', 'I\'m here to help', 'What can I do for you?']
    };
    return phrases[emotion] || phrases['Neutral'];
  }

  function getWarningFlags(emotion) {
    const flags = {
      'Happy': ['Don\'t oversell', 'Stay focused'],
      'Satisfied': ['Maintain quality', 'Don\'t assume everything is perfect'],
      'Grateful': ['Don\'t become complacent', 'Continue professional service'],
      'Excited': ['Don\'t overwhelm them', 'Stay focused on their needs'],
      'Frustrated': ['Watch for escalation', 'Don\'t minimize their feelings'],
      'Angry': ['Prepare for escalation', 'Don\'t take it personally'],
      'Disappointed': ['Avoid defensive responses', 'Focus on solutions'],
      'Confused': ['Don\'t rush explanations', 'Check understanding often'],
      'Concerned': ['Address concerns promptly', 'Provide clear reassurance'],
      'Neutral': ['Engage actively', 'Don\'t assume satisfaction']
    };
    return flags[emotion] || flags['Neutral'];
  }
  
  // Emotion pattern matching for specific emotional states
  // Each emotion has trigger phrases that indicate that specific feeling
  const emotionPatterns = {
    'Happy': ['happy', 'joy', 'pleased', 'delighted', 'thrilled', 'excited'],
    'Satisfied': ['satisfied', 'content', 'good', 'fine', 'okay', 'pleasant'],
    'Grateful': ['thank', 'thanks', 'appreciate', 'grateful'],
    'Excited': ['excited', 'amazing', 'awesome', 'fantastic', 'brilliant'],
    'Frustrated': ['frustrated', 'annoying', 'irritated', 'difficult', 'complicated'],
    'Angry': ['angry', 'furious', 'mad', 'outraged', 'livid', 'hate'],
    'Disappointed': ['disappointed', 'let down', 'expected better', 'worse than'],
    'Confused': ['confused', 'unclear', 'don\'t understand', 'complicated'],
    'Concerned': ['worried', 'concerned', 'anxious', 'trouble', 'problem']
  };
  
  // Generate contextual agent suggestions based on detected emotion
  // Each suggestion is tailored to the specific emotional state
  const suggestions = {
    'Happy': "Customer is satisfied! Maintain this positive experience and consider upselling opportunities.",
    'Satisfied': "Good interaction. Continue providing excellent service and ask if there's anything else needed.",
    'Grateful': "Customer appreciates the service. This is a great opportunity to strengthen the relationship.",
    'Excited': "Customer is very enthusiastic! Capitalize on this energy and explore additional ways to help.",
    'Frustrated': "Customer is frustrated. Acknowledge their feelings, apologize for the inconvenience, and focus on immediate resolution.",
    'Angry': "Customer is angry. Stay calm, listen actively, apologize sincerely, and escalate if necessary.",
    'Disappointed': "Customer had higher expectations. Acknowledge the disappointment and work to exceed expectations moving forward.",
    'Confused': "Customer needs clarification. Slow down, explain step-by-step, and ensure understanding before proceeding.",
    'Concerned': "Customer has concerns. Address them directly with reassurance and detailed information.",
    'Neutral': "Customer seems neutral. Engage proactively to understand their needs and provide helpful assistance."
  };

  // Real-time coaching tips based on emotion
  const coachingTips = {
    'Happy': [
      'Continue the positive momentum',
      'Ask if there\'s anything else you can help with',
      'This is a good time to ask for feedback'
    ],
    'Satisfied': [
      'Maintain professional service quality',
      'Confirm all concerns are addressed',
      'End on a positive note'
    ],
    'Grateful': [
      'Accept thanks graciously',
      'Reinforce your commitment to service',
      'Ask how else you can assist'
    ],
    'Excited': [
      'Match their enthusiasm appropriately',
      'Provide detailed information they\'re seeking',
      'Explore additional ways to help'
    ],
    'Frustrated': [
      'Acknowledge their frustration immediately',
      'Use empathetic language',
      'Focus on concrete solutions'
    ],
    'Angry': [
      'Stay calm and professional',
      'Listen without interrupting',
      'Prepare to escalate if needed'
    ],
    'Disappointed': [
      'Acknowledge their disappointment',
      'Avoid making excuses',
      'Focus on making it right'
    ],
    'Confused': [
      'Speak slowly and clearly',
      'Break down information into steps',
      'Check for understanding frequently'
    ],
    'Concerned': [
      'Address concerns directly',
      'Provide reassuring information',
      'Offer additional support'
    ],
    'Neutral': [
      'Engage proactively',
      'Ask clarifying questions',
      'Show genuine interest in helping'
    ]
  };

  // Example phrases agents can use
  const phraseExamples = {
    'Happy': [
      'I\'m so glad to hear that!',
      'That\'s wonderful news!',
      'Is there anything else I can help you with today?'
    ],
    'Satisfied': [
      'I\'m pleased I could help',
      'Thank you for your patience',
      'Have a great rest of your day!'
    ],
    'Grateful': [
      'You\'re very welcome',
      'I\'m happy I could assist you',
      'Thank you for giving us the opportunity to help'
    ],
    'Excited': [
      'That\'s fantastic!',
      'I can hear how excited you are!',
      'Let me make sure you have everything you need'
    ],
    'Frustrated': [
      'I completely understand your frustration',
      'I can see why that would be frustrating',
      'Let me help resolve this for you right away'
    ],
    'Angry': [
      'I sincerely apologize for this situation',
      'I hear your concern and I want to help',
      'Let me get this fixed for you immediately'
    ],
    'Disappointed': [
      'I understand this isn\'t what you expected',
      'I can see why you\'d feel disappointed',
      'Let me see what I can do to make this right'
    ],
    'Confused': [
      'Let me explain that more clearly',
      'I\'ll walk you through this step by step',
      'Please let me know if you need clarification'
    ],
    'Concerned': [
      'I understand your concern',
      'Let me address that worry for you',
      'I want to make sure you feel confident about this'
    ],
    'Neutral': [
      'How can I best assist you today?',
      'I\'m here to help with whatever you need',
      'Let me understand your situation better'
    ]
  };

  // Warning flags for each emotion
  const warningFlags = {
    'Happy': ['Don\'t oversell', 'Keep it genuine'],
    'Satisfied': ['Don\'t rush the conversation', 'Ensure completeness'],
    'Grateful': ['Don\'t dismiss their thanks', 'Maintain professionalism'],
    'Excited': ['Don\'t overwhelm them', 'Stay focused on their needs'],
    'Frustrated': ['Watch for escalation', 'Don\'t minimize their feelings'],
    'Angry': ['Prepare for escalation', 'Don\'t take it personally'],
    'Disappointed': ['Avoid defensive responses', 'Focus on solutions'],
    'Confused': ['Don\'t rush explanations', 'Check understanding often'],
    'Concerned': ['Address concerns promptly', 'Provide clear reassurance'],
    'Neutral': ['Engage actively', 'Don\'t assume satisfaction']
  };
  
  // Call the main VADER sentiment analysis
  return vaderSentimentAnalysis(text);
}

/**
 * Main API endpoint for sentiment analysis
 * 
 * This endpoint provides a hybrid approach to sentiment analysis:
 * 1. Primary: Google Gemini AI for sophisticated contextual analysis
 * 2. Fallback: Local analysis engine when API is unavailable
 * 
 * The system automatically detects API availability and gracefully falls back
 * to ensure 100% uptime for sentiment analysis functionality.
 * 
 * @route POST /analyze-transcript
 * @param {string} transcript - Customer's text input to analyze
 * @returns {Object} Detailed sentiment analysis with suggestions
 * 
 * Response format:
 * {
 *   emotion: string,           // Primary emotion (Happy, Angry, etc.)
 *   sentimentScore: number,    // 1-10 sentiment score
 *   intensity: string,         // low/medium/high
 *   keyIndicators: string[],   // Words that triggered the analysis
 *   suggestion: string,        // Agent action recommendation
 *   priority: string,          // low/medium/high urgency
 *   recommendedTone: string    // empathetic/professional/enthusiastic
 * }
 */
router.post('/analyze-transcript', async (req, res) => {
  try {
    const { transcript } = req.body;

    // Input validation
    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    // API Key availability check - fallback to local analysis if needed
    if (!process.env.API_KEY || process.env.API_KEY === 'your_google_gemini_api_key_here') {
      console.log('Using fallback sentiment analyzer (no valid API key)');
      const analysis = analyzeTextSentiment(transcript);
      return res.json(analysis);
    }

    try {
      // Initialize Google Gemini AI model
      const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

      // ULTRA-ADVANCED sentiment analysis prompt with extensive training examples
      const prompt = `
        You are an expert sentiment analysis AI trained on thousands of customer conversations. Analyze this statement with MAXIMUM ACCURACY.

        CUSTOMER STATEMENT: "${transcript}"

        ADVANCED ANALYSIS RULES:

        1. EMOTION DETECTION PRIORITY (choose ONLY ONE, in exact order):
           
           IMMEDIATE NEGATIVE DETECTION (if ANY indicator present):
           - "Angry": hate, furious, pissed, mad, livid, outraged, disgusted, fed up, sick of, can't stand, rage, fuck, shit, damn, hell, asshole, bitch, unacceptable, ridiculous, bullshit, garbage, trash, worthless
           - "Frustrated": frustrated, annoying, annoyed, irritated, doesn't work, not working, broken, stupid, terrible, awful, horrible, wtf, wth, omg, seriously, ugh, argh, tried everything, still broken, keeps happening
           - "Disgusted": disgusting, gross, nasty, revolting, repulsive, sick, horrible, hideous, appalling, vile, nauseating, offensive
           - "Disappointed": disappointed, sucks, bad, worse, terrible, disappointing, let down, expected better, useless, pathetic, weak, lame, boring, underwhelming, not impressed
           
           SARCASM DETECTION (negative despite positive words):
           - "oh great", "just great", "wonderful" + negative context = Frustrated
           - "perfect" + "..." or negative tone = Frustrated  
           - "fantastic" + sarcastic context = Frustrated
           
           MIXED/CONDITIONAL EMOTIONS:
           - "I guess", "whatever", "fine whatever", "if you say so", "yeah right" = Disappointed
           
           POSITIVE EMOTIONS (only if no negative detected):
           - "Excited": excited, amazing, fantastic, incredible, awesome, can't wait, love it, perfect, excellent, brilliant, joyful, joyous, thrilled, elated, ecstatic, overjoyed
           - "Grateful": thank, thanks, appreciate, grateful, helpful, blessing, thankful, blessed
           - "Happy": happy, pleased, delighted, great, wonderful, good, nice, cool, glad, cheerful, joy, blissful, content, merry, uplifted
           - "Satisfied": satisfied, fine, okay, good enough, that works, alright, decent
           
           NEUTRAL/OTHER:
           - "Concerned": worried, concerned, anxious, nervous, uncertain, what if
           - "Confused": confused, don't understand, unclear, complicated, lost, how do i

        2. INTENSITY MODIFIERS:
           - ALL CAPS = +2 intensity points
           - Multiple !!! = +1.5 intensity points  
           - Intensifiers (really, very, extremely, absolutely, completely, so, super) = +1 intensity point
           - Profanity = +2 intensity points
           - Multiple negative words = +1 point per extra word

        3. CONTEXT-AWARE SCORING:
           - Angry: 1.0-2.0 (lower with more intensity)
           - Frustrated: 2.0-3.0 
           - Disgusted: 1.5-2.5
           - Disappointed: 2.5-3.5
           - Sarcastic: Always 2.0-3.0 range
           - Concerned: 3.5-4.5
           - Confused: 4.0-5.0
           - Neutral: 5.0
           - Satisfied: 6.0-7.0
           - Happy: 7.0-8.0
           - Grateful: 8.0-9.0
           - Excited: 8.5-10.0

        4. TRAINING EXAMPLES:
           - "I hate this fucking thing" → Angry, 1.0, high intensity
           - "This is absolutely ridiculous" → Angry, 1.5, high intensity
           - "Oh great, just what I needed..." → Frustrated, 2.5, medium intensity (sarcasm)
           - "I guess it's fine whatever" → Disappointed, 3.0, low intensity
           - "WTF is wrong with this???" → Frustrated, 2.0, high intensity
           - "This sucks so bad" → Disappointed, 2.5, medium intensity
           - "Doesn't work at all" → Frustrated, 2.5, medium intensity
           - "Really amazing work!" → Excited, 9.0, high intensity
           - "Thank you so much" → Grateful, 8.5, high intensity

        5. EDGE CASES:
           - Positive words + negative context = Focus on negative context
           - Questions with frustration = Frustrated, not Confused
           - Mild complaints = Disappointed, not Angry
           - Repeated issues = Frustrated with higher intensity

        RESPOND WITH EXACT JSON FORMAT:
        {
          "emotion": "exact emotion name from list above",
          "sentimentScore": precise_number_1_to_10_with_decimals,
          "intensity": "low/medium/high",
          "keyIndicators": ["specific words that triggered this emotion"],
          "suggestion": "specific agent action for this emotion",
          "priority": "high for negative emotions, medium for neutral, low for positive",
          "recommendedTone": "empathetic for negative, professional for neutral, enthusiastic for positive",
          "coachingTips": [
            "Specific behavioral tip for this emotion",
            "Tone guidance for this emotional state", 
            "Next step recommendation"
          ],
          "phraseExamples": [
            "Perfect response phrase for this emotion",
            "Alternative empathetic response",
            "Follow-up phrase option"
          ],
          "warningFlags": [
            "Escalation risk for this emotion",
            "Behavioral warning sign"
          ]
        }

        BE EXTREMELY CONSISTENT: Same emotional words should ALWAYS produce the same emotion classification and similar sentiment scores.
      `;

      // Generate analysis request to Gemini AI
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        // Parse JSON response from Gemini AI
        const parsed = JSON.parse(text);
        
        // Format and validate the response data with enhanced coaching features
        const analysisResult = {
          emotion: parsed.emotion || 'Unknown',
          suggestion: parsed.suggestion || 'Continue monitoring conversation.',
          sentimentScore: parsed.sentimentScore || 5,
          intensity: parsed.intensity || 'medium',
          keyIndicators: parsed.keyIndicators || [],
          priority: parsed.priority || 'medium',
          recommendedTone: parsed.recommendedTone || 'professional',
          coachingTips: parsed.coachingTips || [
            'Listen actively and acknowledge the customer\'s concern',
            'Use empathetic language to build rapport',
            'Focus on solutions rather than problems'
          ],
          phraseExamples: parsed.phraseExamples || [
            'I understand your concern and I\'m here to help',
            'Let me look into this for you right away',
            'I can see why this would be frustrating'
          ],
          warningFlags: parsed.warningFlags || [
            'Monitor for escalation signals',
            'Watch for tone changes'
          ]
        };
        
        res.json(analysisResult);
      } catch (parseError) {
        // JSON parsing failed - use local fallback analysis with enhanced coaching
        console.error('JSON parsing error, using fallback analysis');
        const fallbackAnalysis = analyzeTextSentiment(transcript);
        
        // Add coaching suggestions to fallback analysis
        fallbackAnalysis.coachingTips = [
          'Maintain a calm and professional tone',
          'Acknowledge the customer\'s feelings',
          'Offer specific next steps or solutions'
        ];
        fallbackAnalysis.phraseExamples = [
          'I hear what you\'re saying and I want to help',
          'Let me see what I can do to resolve this',
          'Thank you for bringing this to my attention'
        ];
        fallbackAnalysis.warningFlags = ['Monitor conversation flow', 'Watch for frustration signals'];
        
        res.json(fallbackAnalysis);
      }
    } catch (apiError) {
      // Gemini API failed - use local fallback analysis
      console.error('Gemini API error, using fallback analysis:', apiError.message);
      const fallbackAnalysis = analyzeTextSentiment(transcript);
      res.json(fallbackAnalysis);
    }
  } catch (error) {
    // General error handling with safe fallback
    console.error('Error analyzing transcript:', error);
    res.status(500).json({ 
      error: 'Failed to analyze transcript',
      emotion: 'Neutral',
      suggestion: 'Continue monitoring conversation.',
      sentimentScore: 5,
      intensity: 'medium',
      keyIndicators: [],
      priority: 'medium',
      recommendedTone: 'professional'
    });
  }
});

/**
 * Enhanced AI Chatbot Endpoint
 * Provides intelligent conversational AI with sentiment-aware responses
 * 
 * @route POST /ask
 * @param {string} message - User's message/question
 * @param {Array} conversationHistory - Previous conversation context
 * @param {string} userContext - Additional user context (mood, role, etc.)
 * @returns {Object} Enhanced AI response with sentiment analysis
 */
router.post('/ask', async (req, res) => {
  try {
    const { message, conversationHistory = [], userContext = {} } = req.body;

    // Input validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message is required and must be a string',
        success: false
      });
    }

    // Import business context service
    const { DataContextService } = await import('../services/dataContextService.js');
    
    // Get current business intelligence data
    const businessContext = await DataContextService.getCurrentBusinessContext();
    const contextSummary = DataContextService.generateAIContextSummary(businessContext);

    // First, analyze the user's message sentiment
    const sentimentAnalysis = analyzeTextSentiment(message);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

    // Enhanced system instruction with sentiment awareness and business context
    const systemInstruction = `
      You are "SenseAI", an advanced AI assistant integrated into a comprehensive Customer Experience (CX) Analytics Platform.
      
      CORE IDENTITY:
      - Name: SenseAI
      - Role: Intelligent CX Analytics Assistant & Business Intelligence Advisor
      - Expertise: Customer sentiment analysis, business intelligence, data insights, and strategic recommendations
      
      CURRENT BUSINESS CONTEXT (REAL-TIME DATA):
      📊 **Current Performance**: ${contextSummary.currentState}
      📈 **Key Metrics**: ${contextSummary.performance}
      💭 **Sentiment Overview**: ${contextSummary.sentimentInsights}
      🔄 **Operations**: ${contextSummary.operationalStatus}
      ⚡ **Priority Actions**: ${contextSummary.priorities}
      📊 **Live Trends**: ${contextSummary.trends}
      
      RECENT CUSTOMER FEEDBACK:
      ${contextSummary.recentFeedback}
      
      USER CONTEXT:
      - Current user sentiment: ${sentimentAnalysis.emotion} (Score: ${sentimentAnalysis.score}/10)
      - User mood indicators: ${sentimentAnalysis.keyIndicators.join(', ') || 'None detected'}
      - Priority level: ${sentimentAnalysis.priority}
      
      RESPONSE GUIDELINES:
      1. **Use Real Data**: Always reference the actual business metrics provided above when discussing performance, trends, or insights.
      
      2. **Sentiment Adaptation**: Adjust your tone based on user sentiment:
         - Positive (7-10): Be enthusiastic and encouraging
         - Neutral (4-6): Be professional and informative  
         - Negative (1-3): Be empathetic, supportive, and solution-focused
      
      3. **Data-Driven Responses**:
         - Reference specific KPIs (active calls: ${businessContext.kpis.activeCalls}, sentiment: ${businessContext.kpis.avgSentiment}/10)
         - Mention actual trends (sentiment ${businessContext.sentimentAnalytics.currentTrend})
         - Use real feedback examples when relevant
         - Provide actionable insights based on current data
      
      4. **Expertise Areas**:
         - Real-time sentiment analysis (current avg: ${businessContext.kpis.avgSentiment}/10)
         - Call center performance (${businessContext.kpis.activeCalls} active calls)
         - Revenue insights ($${(businessContext.kpis.revenue/1000000).toFixed(1)}M YTD)
         - Customer satisfaction trends (${businessContext.kpis.customerSatisfaction}%)
         - Operational efficiency and optimization
         - Strategic recommendations based on current data
      
      5. **When providing insights**:
         - Always use the current metrics provided
         - Reference specific trends from the business context
         - Suggest actions based on actual performance data
         - Connect insights to real customer feedback patterns
      
      6. **Conversation Style**:
         - Be friendly yet professional
         - Remember conversation context
         - Ask clarifying questions when needed
         - Provide step-by-step guidance backed by real data
      
      Remember: You have access to LIVE business data including ${businessContext.kpis.activeCalls} active calls, ${businessContext.kpis.customerSatisfaction}% satisfaction rate, and real-time sentiment trending ${businessContext.sentimentAnalytics.currentTrend}. Always reference this actual data in your responses.
    `;

    // Build conversation context
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = '\n\nPREVIOUS CONVERSATION CONTEXT:\n';
      conversationHistory.slice(-5).forEach((msg, index) => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'SenseAI'}: ${msg.content}\n`;
      });
    }

    // Create enhanced prompt with context
    const enhancedPrompt = `${systemInstruction}${conversationContext}

CURRENT USER MESSAGE: ${message}

Please respond as SenseAI, taking into account the user's current sentiment (${sentimentAnalysis.emotion}) and the conversation context.`;

    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
      },
    });

    const result = await chat.sendMessage(enhancedPrompt);
    const response = await result.response;
    const aiResponse = response.text();

    // Enhanced response object
    const enhancedResponse = {
      success: true,
      response: aiResponse,
      sentiment: sentimentAnalysis,
      context: {
        userEmotion: sentimentAnalysis.emotion,
        confidenceScore: sentimentAnalysis.score,
        priority: sentimentAnalysis.priority,
        keyIndicators: sentimentAnalysis.keyIndicators,
        suggestions: sentimentAnalysis.suggestions
      },
      metadata: {
        timestamp: new Date().toISOString(),
        model: 'gemini-1.0-pro',
        responseLength: aiResponse.length,
        conversationLength: conversationHistory.length + 1
      }
    };

    res.json(enhancedResponse);

  } catch (error) {
    console.error('Error in enhanced chatbot endpoint:', error);
    
    // Fallback response with sentiment analysis
    const fallbackSentiment = analyzeTextSentiment(req.body.message || '');
    
    res.status(500).json({ 
      success: false,
      error: 'AI service temporarily unavailable',
      response: getFallbackResponse(fallbackSentiment.emotion),
      sentiment: fallbackSentiment,
      metadata: {
        timestamp: new Date().toISOString(),
        fallback: true
      }
    });
  }
});

/**
 * Get appropriate fallback response based on user sentiment
 */
function getFallbackResponse(emotion) {
  const fallbackResponses = {
    'Angry': "I understand you're frustrated. Let me connect you with a specialist who can help resolve this issue immediately. 😔",
    'Frustrated': "I can see this is causing you difficulty. While I'm temporarily unavailable, here are some quick steps that might help... 🛠️",
    'Disappointed': "I'm sorry this hasn't met your expectations. Let me make sure we address your concerns properly. 💙",
    'Confused': "I understand this can be confusing. Let me break this down into simpler steps for you. 📋",
    'Happy': "Great to hear you're having a positive experience! I'll be back shortly to help you even further. 😊",
    'Excited': "I love your enthusiasm! I'll be available again soon to help you make the most of our platform. 🚀",
    'Grateful': "Thank you for your patience! I truly appreciate your understanding while I'm temporarily offline. 🙏",
    'Satisfied': "Glad things are working well for you! I'll be back online shortly if you need anything else. ✅"
  };
  
  return fallbackResponses[emotion] || "I'm temporarily unavailable, but I'll be back shortly to assist you. Thank you for your patience! 🤖";
}

/**
 * AI Assistant endpoint for general customer experience inquiries
 * 
 * This endpoint provides conversational AI capabilities for CX analysts
 * to ask questions about customer data, trends, and insights.
 * 
 * @route POST /assistant
 * @param {string} prompt - User's question or request
 * @param {Array} history - Previous conversation history (optional)
 * @returns {Object} AI-generated response with insights
 */
router.post('/assistant', async (req, res) => {
  try {
    const { prompt, history = [] } = req.body;

    // Input validation
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

    // System instruction for consistent AI assistant behavior
    const systemInstruction = `
      You are an advanced AI assistant embedded in a "Unified CX Dashboard". Your name is "Insight".
      Your audience is a CX Analyst or Manager.
      Your goal is to provide concise, data-driven, and actionable answers to their questions about customer experience, business performance, and market trends.
      When asked for data (like SWOT, summaries, or trends), generate plausible, representative examples that a company might see.
      You can format your answers with simple markdown (bolding, lists).
      Be friendly, professional, and helpful.
    `;

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(systemInstruction + '\n\n' + prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Error generating assistant response:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      response: "I'm sorry, I encountered an error while processing your request. Please try again later."
    });
  }
});

export default router;
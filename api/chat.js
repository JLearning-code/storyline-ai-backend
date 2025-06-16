// Secure Storyline + AI Integration using your backend
// No API keys exposed in the frontend!

// Your backend URL (replace with your actual deployed URL)
const BACKEND_URL = 'https://storyline-ai-backend.vercel.app/api/chat'; // Vercel example
// const BACKEND_URL = 'https://your-site.netlify.app/.netlify/functions/chat'; // Netlify example

// Main function to call AI through your secure backend
async function callAISecurely(userPrompt, outputVariable = 'AIResponse') {
    try {
        // Show loading message
        var player = GetPlayer();
        player.SetVar(outputVariable, 'AI is thinking...');
        
        // Call your backend (no API key needed here!)
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: userPrompt
            })
        });

        // Check if request was successful
        if (!response.ok) {
            throw new Error(`Backend Error: ${response.status}`);
        }

        // Parse the response
        const data = await response.json();
        
        if (data.success) {
            // Set the AI response in Storyline variable
            player.SetVar(outputVariable, data.response);
            player.SetVar('AIComplete', true);
            
            console.log('AI Response received:', data.response);
            return data.response;
        } else {
            throw new Error(data.error || 'Unknown error');
        }

    } catch (error) {
        console.error('Error calling AI:', error);
        
        // Set error message in Storyline
        var player = GetPlayer();
        player.SetVar(outputVariable, 'Sorry, there was an error. Please try again.');
        player.SetVar('AIError', true);
        
        return null;
    }
}

// Helper function to process user input
function processUserInputSecurely() {
    var player = GetPlayer();
    var userInput = player.GetVar('UserInput');
    
    if (userInput && userInput.trim() !== '') {
        callAISecurely(userInput, 'AIResponse');
    } else {
        player.SetVar('AIResponse', 'Please enter a question first.');
    }
}

// Example usage functions
function generateQuizSecurely(topic) {
    const prompt = `Create a multiple-choice question about ${topic} for corporate training.`;
    callAISecurely(prompt, 'QuizQuestion');
}

function generateFeedbackSecurely(userAnswer, topic) {
    const prompt = `Provide constructive feedback for this answer about ${topic}: "${userAnswer}"`;
    callAISecurely(prompt, 'Feedback');
}

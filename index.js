// By: @iBuyRare (X)

const Anthropic = require('@anthropic-ai/sdk');
const { TwitterApi } = require('twitter-api-v2');
const SECRETS = require('./SECRETS');

// Correct way to initialize the Anthropic client
const claudeClient = new Anthropic({
  apiKey: SECRETS.CLAUDE_API_KEY
});

// Store previously generated tweets to avoid repetition
const previousTweets = new Set();

async function run() {
  const cryptoTopic = 'Bitcoin'; // Example topic, replace dynamically as needed
  const prompt = `
    You are a social media expert specializing in cryptocurrency content. Your task is to create an interesting and engaging tweet about a given cryptocurrency topic.
    
    Here is the cryptocurrency topic you should tweet about: ${cryptoTopic}
    
    Instructions:
    1. Develop tweet ideas about the cryptocurrency topic.
    2. Select the most engaging idea.
    3. Craft a tweet within 280 characters that is unique and not similar to previous tweets.
    4. Wrap your final tweet in <tweet> tags.

    Example output:
    <tweet>[Your engaging tweet here] #Crypto #Blockchain</tweet>
  `;

  try {
    const response = await claudeClient.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 400,
      temperature: 0.8, // Increased for diversity
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    // Extract tweet using regex
    const tweetMatch = response.content[0].text.match(/<tweet>(.*?)<\/tweet>/s);
    let finalTweet = tweetMatch 
      ? tweetMatch[1].trim() 
      : response.content[0].text.trim().slice(0, 280);

    // Validate tweet length
    if (finalTweet.length > 280) {
      throw new Error('Tweet exceeds 280 characters');
    }

    // Check for repetition
    if (previousTweets.has(finalTweet)) {
      console.log("Generated tweet is similar to a previous tweet. Regenerating...");
      return run(); // Retry generating a new tweet
    }

    // Add the new tweet to the set of previous tweets
    previousTweets.add(finalTweet);
    
    console.log("Generated Tweet:", finalTweet);
    await sendTweet(finalTweet);
  } catch (error) {
    console.error("Error in tweet generation process:", error);
  }
}

async function sendTweet(tweetText) {
  const twitterClient = new TwitterApi({
    appKey: SECRETS.APP_KEY,
    appSecret: SECRETS.APP_SECRET,
    accessToken: SECRETS.ACCESS_TOKEN,
    accessSecret: SECRETS.ACCESS_SECRET,
  });

  try {
    // Use v2.tweet method to post the tweet
    const response = await twitterClient.v2.tweet(tweetText);
    console.log("Tweet sent successfully!", response);
  } catch (error) {
    console.error("Error sending tweet:", error);
    // Optionally log more detailed error information
    if (error.data) {
      console.error("Twitter API Error Details:", error.data);
    }
  }
}

run();

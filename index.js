// By: @iBuyRare (X)

const Anthropic = require('@anthropic-ai/sdk');
const { TwitterApi } = require('twitter-api-v2');
const SECRETS = require('./SECRETS');

// Correct way to initialize the Anthropic client
const claudeClient = new Anthropic({
  apiKey: SECRETS.CLAUDE_API_KEY
});
// Add your own prompt here
async function run() {
  const prompt = `
    As a crypto specialist, create a tweet that feels authentic and conversational about Bitcoin, crypto, and memecoin insights. 
    Focus on sharing unique tips, tricks, rants, or fresh advice, staying around 300 characters. 
    Avoid repetition, keep the tone current, clear, positive, and specific. 
    Do not use emojis, and include only two trending hashtags.
  `;

  try {
    const response = await claudeClient.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 400,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const text = response.content[0].text.trim();
    console.log(text);
    await sendTweet(text);
  } catch (error) {
    console.error("Error generating text with Claude:", error);
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
    await twitterClient.v2.tweet(tweetText);
    console.log("Tweet sent successfully!");
  } catch (error) {
    console.error("Error sending tweet:", error);
  }
}

run();

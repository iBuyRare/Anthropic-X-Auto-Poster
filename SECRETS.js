// By: @iBuyRare (X)
// It’s highly recommended to use environment variables to store sensitive information rather than hardcoding secrets directly into your repository files. However, I’ve chosen to omit this step to keep things simple for newcomers.

//As an alternative, you can download the repository or fork it to your own account and keep it private. This way, your sensitive information will remain secure and hidden from the public.

const APP_KEY = "YOUR_TWITTER_APP_KEY_HERE";
const APP_SECRET = "YOUR_TWITTER_APP_SECRET_HERE";
const ACCESS_TOKEN = "YOUR_TWITTER_ACCESS_TOKEN_HERE";
const ACCESS_SECRET = "YOUR_TWITTER_ACCESS_SECRET_HERE";
const CLAUDE_API_KEY = "YOUR_CLAUDE_KEY_HERE";

const SECRETS = {
  APP_KEY,
  APP_SECRET,
  ACCESS_TOKEN,
  ACCESS_SECRET,
  CLAUDE_API_KEY,
};

module.exports = SECRETS;

const dotenv = require('dotenv-safe');


(async () => {
    const { ChatGPTUnofficialProxyAPI } = await import('chatgpt');
    const { default: Authenticator } = await import('openai-token');
    const { default: oraPromise } = await import('ora');
  
    const auth = new Authenticator('the.captain.wayne254@gmail.com', 'wayne9914');
    await auth.begin();
    const token = await auth.getAccessToken();
    console.log("Token received: ", token);
  
 



dotenv.config()

/**
 * Demo for testing conversation support using a reverse proxy which provides
 * access to the unofficial ChatGPT API.
 *
 * ```
 * npx tsx demos/demo-reverse-proxy.ts
 * ```
 */
async function main() {
  // WARNING: this method will expose your access token to a third-party. Please be
  // aware of the risks before using this method.
  const api = new ChatGPTUnofficialProxyAPI({
    // optionally override the default reverse proxy URL (or use one of your own...)
    // apiReverseProxyUrl: 'https://chat.duti.tech/api/conversation',
    // apiReverseProxyUrl: 'https://gpt.pawan.krd/backend-api/conversation',

    accessToken: token,
    debug: false
  })

  const prompt = 'Write a poem about cats.'

  let res = await oraPromise(api.sendMessage(prompt), {
    text: prompt
  })

  console.log('\n' + res.text + '\n')

  const prompt2 = 'Can you make it cuter and shorter?'

  res = await oraPromise(
    api.sendMessage(prompt2, {
      conversationId: res.conversationId,
      parentMessageId: res.id
    }),
    {
      text: prompt2
    }
  )
  console.log('\n' + res.text + '\n')

  const prompt3 = 'Now write it in French.'

  res = await oraPromise(
    api.sendMessage(prompt3, {
      conversationId: res.conversationId,
      parentMessageId: res.id
    }),
    {
      text: prompt3
    }
  )
  console.log('\n' + res.text + '\n')

  const prompt4 = 'What were we talking about again?'

  res = await oraPromise(
    api.sendMessage(prompt4, {
      conversationId: res.conversationId,
      parentMessageId: res.id
    }),
    {
      text: prompt4
    }
  )
  console.log('\n' + res.text + '\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
  })();
  
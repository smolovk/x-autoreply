function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
            sendResponse("ok");
            // TODO dont forget to check if text exists
            let tweets = document.querySelectorAll("[data-testid='tweet']")
            for (let i in tweets) {
                timeout(1000);
                let tweet = document.querySelectorAll("[data-testid='tweet']")[i]
                // console.log(tweets)
                // tweets[tweets.length-1].scrollIntoView();
                // // tweets[3].click()
                // tweets = document.querySelectorAll("[data-testid='tweet']")
                // console.log(tweets)
                let tweetText = tweet
                                    .children[0]
                                    .children[0]
                                    .children[1]
                                    .children[1]
                                    .children[1]
                                    .children[0]
                                    .innerText
                if (!tweetText)
                    continue;
                await tweet.scrollIntoView();
                if (tweetText.includes("")) {
                    const likeButton = tweet.querySelector("[data-testid='like']")
                    likeButton.click()
                    tweet.click()
                    await timeout(2000)
                    // let input = document.querySelector('[data-text="true"]').parentElement
                    // input.textContent = "gm"
                    // input.click()
                    // input.dispatchEvent(new Event("input", {bubbles: true}))

                    let button = document.querySelector("[data-testid='tweetButtonInline']")
                    button.click()
                    timeout(300)
                    document.querySelector("[data-testid='app-bar-back']").click()
                    timeout(300)
                }
            }
    }
);


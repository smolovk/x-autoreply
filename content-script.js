let running = false;
let bg;

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let savedTweets = []
function findTweet(all) {
    for (let tweet of all) {
        let tweetText = tweet.querySelector("[data-testid='tweetText']").innerText
        if (!tweetText || tweetText == "")
            return null;
        if (!savedTweets.find(s => s.includes(tweetText))) {
            savedTweets.push(tweetText)
            // check if yours
            let profileLink = tweet.querySelector("[data-testid='User-Name']>div>div>a").href;
            tweet.style.background = "#D3D3D3";
            //kuku
            if (!profileLink.includes("smolov_k_")) 
                return tweet
        }
    }
}

chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
            sendResponse(!running);
            if (running) {
                running = false
                document.querySelector("[data-testid='SideNav_AccountSwitcher_Button']").style.background = bg;
                return;
            }
            bg = document.querySelector("[data-testid='SideNav_AccountSwitcher_Button']").style.background
            document.querySelector("[data-testid='SideNav_AccountSwitcher_Button']").style.background = "green";
            running = true;
            // TODO dont forget to check if text exists
            let tweets = []
            let tweet;
            for (;;) {
                if (!running)
                    break;
                await timeout(1000);
                tweets = document.querySelectorAll("[data-testid='tweet']")

                tweet = findTweet(tweets);
                if (!tweet)
                    continue;
                let tweetText = tweet.querySelector("[data-testid='tweetText']").innerText

                await timeout(300)
                await tweet.scrollIntoView();
                await timeout(3000)
                if (tweetText.toLowerCase().includes("gm")) {
                    const likeButton = tweet.querySelector("[data-testid='like']")
                    if (likeButton)
                        likeButton.click()
                    await timeout(100)
                    tweet.click()
                    await timeout(2000)
                    let input = document.querySelector('[data-text="true"]').parentElement
                    //kuku
                    let array = ["gm mate!", "gm bro", "GM!"]
                    let reply = array[Math.floor(Math.random() * array.length)];
                    input.textContent = reply;
                    input.click()
                    input.dispatchEvent(new Event("input", {bubbles: true}))

                    let button = document.querySelector("[data-testid='tweetButtonInline']")
                    button.click()
                    console.log("replied!", reply)
                    timeout(1000)
                    document.querySelector("[data-testid='app-bar-back']").click()
                    timeout(300)
                }
            }
    }
);


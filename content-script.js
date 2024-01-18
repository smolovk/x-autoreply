let running = false;
let bg;

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let savedTweets = []
function findTweet(all, myName) {
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
            if (!profileLink.includes(myName)) 
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

            let myName = document.querySelector("[data-testid='SideNav_AccountSwitcher_Button']>div:nth-child(2)>div>div:nth-child(2)").innerText.replace("@","");
            console.log("My name is ", myName);
            for (;;) {
                if (!running)
                    break;
                await timeout(1000);
                tweets = document.querySelectorAll("[data-testid='tweet']")

                tweet = findTweet(tweets, myName);
                if (!tweet)
                    continue;
                let tweetText = tweet.querySelector("[data-testid='tweetText']").innerText

                //variables to use in text
                let OPFullName = tweet.querySelector("[data-testid='User-Name']>div").innerText
                let OPFirstName = OPFullName.split(" ")[0]

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
                    let emojis = ["☀️","☕️","🌞"]
                    let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                    let replies = [`Gm ${OPFirstName}${randomEmoji}`]
                    let reply = replies[Math.floor(Math.random() * replies.length)];
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


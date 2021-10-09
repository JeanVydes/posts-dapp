App = {
    contract: {},
    init: async() => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
        await App.renderPosts()
    },
    loadWeb3: async() => {
        if(window.ethereum) {
            App.web3Provider = window.ethereum;
            await window.ethereum.request({ method: "eth_requestAccounts" })
        } else if (web3) {
            web = new Web3(window.web3.currentProvider)
        } else {
            console.log("install some wallet in your browser... (metamask)")
        }
    },
    loadAccount: async() => {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        })

        App.account = accounts[0]
    },
    loadContract: async() => {
        try {
            const res = await fetch("Posts.json")
            const postsContract = await res.json()
            
            Postsx = TruffleContract(postsContract)
            Postsx.setProvider(App.web3Provider)

            App.postsContract = await Postsx.deployed()
        } catch(err) {
            console.log(err)
        }
    },
    renderPosts: async() => {
        const postsCounterObject = await App.postsContract.postsCounter()
        const postsCounterID = postsCounterObject.toNumber()

        let html = ""

        for(let i = 1; i <= postsCounterID-1; i++) {
            const post = await App.postsContract.posts(i);
            

            let id = post[0].toNumber()
            let author = post[1]
            let title = post[2]
            let description = post[3]
            let createdAt = post[4].toNumber()
            let available = post[5]

            author = {
                address: author[0],
                display_name: author[1]
            }

            const postFormatted = {
                id,
                author,
                title,
                description,
                createdAt,
                available
            }

            html += `
            <div class="alert alert-secondary" role="alert">
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <p class="title is-4">${postFormatted.title}</p>
                            <p class="subtitle is-6">by ${postFormatted.author.display_name}</p>
                        </div>
                    </div>

                    <div class="content">
                        ${postFormatted.description}
                        <br>
                        ${new Date(
                            postFormatted.createdAt * 1000
                        ).toLocaleString()}
                    </div>
                </div>
            </div>
            `   
        }

        document.querySelector("#feed").innerHTML = html
    },
    render: async() => {
        document.getElementById("account-address").innerText = App.account
    },
    submitPost: async() => {
        let title = document.getElementById("post-title").value
        let description = document.getElementById("post-description").value
        let displayName = document.getElementById("post-display-name").value
        console.log(title, description, displayName)
        const result = await App.postsContract.NewPost(title, description, displayName, {
            from: App.account
        })

        console.log(result)
    }
}
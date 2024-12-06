const connectButton = document.getElementById("connect-button");
const walletAddress = document.getElementById("wallet-address");
const showcandidates = document.getElementById("show-candidates");
let web3, contract;
connectButton.addEventListener("click", async () => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        web3.eth.getAccounts().then(console.log);
        walletAddress.textContent = await web3.eth.getAccounts();
        contract = await contract_instance(web3, abi, contractAddress);
      } catch (error) {
        console.log("User denied account access...");
      }
    } else if (window.web3) {
      web3 = new Web3(web3.currentProvider);
      web3.eth.getAccounts().then(console.log);
    } else {
      console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
});
showcandidates.addEventListener("click", async () => {

});
const connectButton = document.getElementById("connect-button");
const walletAddress = document.getElementById("wallet-address");
const showcandidates = document.getElementById("show-button");
const addCandidateButton = document.getElementById("confirm-add-button");
let web3, contract;
connectButton.addEventListener("click", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            if (accounts.length > 0) {
                const selectedAccount = accounts[0];
                walletAddress.textContent = selectedAccount;
                contract = await contract_instance(web3, CONTRACT_ABI, CONTRACT_ADDRESS);
                const isValidVoter = await contract.methods.validVoters(selectedAccount).call();
                if (isValidVoter) {
                    // Hiển thị nút Vote
                    document.getElementById('show-button').style.display = 'block';
                } else {
                    alert("Bạn không có quyền bỏ phiếu");
                }
            } else {
                console.log("Không tìm thấy tài khoản nào!");
            }
        } catch (error) {
            console.log("Người dùng từ chối quyền truy cập tài khoản:", error);
        }
    } else {
        console.log("Không phát hiện trình duyệt Ethereum. Vui lòng cài đặt MetaMask!");
    }
  });
// hiển thị ứng cử viên
// hiển thị ứng cử viên
showcandidates.addEventListener("click", async () => {
  if (window.web3) {
      web3 = new Web3(web3.currentProvider);
      contract = await contract_instance(web3, CONTRACT_ABI, CONTRACT_ADDRESS);

      const candidateListElement = document.getElementById("candidate-list");
      candidateListElement.innerHTML = ''; // Xóa tất cả các ứng cử viên hiện có

      const candidate = await GetCandidate(contract);
      console.log("Books from blockchain:", candidate);

      candidate.forEach((item) => {
          const { candidate_id, name ,vote_count } = item;

          const candidateElement = document.createElement("div");
          candidateElement.classList.add("candidate");

          const headerElement = document.createElement("div");
          headerElement.classList.add("candidate-header");

          
          const nameSpan = document.createElement("span");
          nameSpan.textContent = `${candidate_id} ${name} `; 

          const vote = document.createElement("span");
          vote.textContent = `Số phiếu hiện tại : ${vote_count}`;
          vote.style.textAlign = "left";

          const voteButton = document.createElement("button");
          voteButton.textContent = "Vote";
          voteButton.id = `vote-${candidate_id}`;
          voteButton.classList.add("vote-button");
          voteButton.addEventListener("click", () => handvote(candidate_id));



          headerElement.appendChild(nameSpan);
          headerElement.appendChild(voteButton);
          
          candidateElement.appendChild(headerElement);
          candidateListElement.appendChild(candidateElement);
          candidateElement.appendChild(vote);
          

      });
  }
});


// const handvote = async()=>
// {
//   if(window.web3) {
//     web3 = new Web3(web3.currentProvider);
//     contract = await contract_instance(web3, CONTRACT_ABI, CONTRACT_ADDRESS);
//     const accounts = await web3.eth.getAccounts();
//     const candidate_id = document.getElementById("candidate-id").value;
//     try {
//       const gasPrice = await web3.eth.getGasPrice(); 
//       await contract.methods.vote(candidate_id).send({ from: accounts[0], gas: 9000000 , gasPrice: gasPrice});
//       showCandidate();
//       alert("Vote thành công!");  
//     } catch (error) {
//       alert("Có lỗi xảy ra khi vote!");
//       console.log(error);
//     }
//   }
// }


// Cập nhật lại danh sách sách

const showCandidate = async () => {
  showcandidates.click();
};
const connectButton = document.getElementById("connect-button");
const walletAddress = document.getElementById("wallet-address");
const showcandidates = document.getElementById("show-button");
const addCandidateButton = document.getElementById("confirm-add-button");
let web3, contract;
connectButton.addEventListener("click", async () => {
  if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
          // Yêu cầu quyền truy cập vào tài khoản
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

          // Sử dụng tài khoản đầu tiên mặc định
          if (accounts.length > 0) {
              const selectedAccount = accounts[0];
              console.log("Kết nối thành công với tài khoản:", selectedAccount);
              walletAddress.textContent = selectedAccount; // Hiển thị tài khoản đã kết nối
              contract = await contract_instance(web3, abi, contractAddress);
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
      console.log("danh sách ứng cử viên:", candidate);

      candidate.forEach((item) => {
          const { candidate_id, name ,vote_count } = item;

          const candidateElement = document.createElement("div");
          candidateElement.classList.add("candidate");

          const headerElement = document.createElement("div");
          headerElement.classList.add("candidate-header");

          
          const nameSpan = document.createElement("span");
          nameSpan.textContent = `Tên ứng viên: ${candidate_id} ${name} `; 

          const vote = document.createElement("span");
          vote.textContent = `Số phiếu hiện tại : ${vote_count}`;
          vote.style.textAlign = "left";


          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.id = `delete-${candidate_id}`;
          deleteButton.classList.add("delete-button");
          deleteButton.addEventListener("click", () => handleDelete(candidate_id));

          const updateButton = document.createElement("button");
          updateButton.textContent = "Update";
          updateButton.id = `update-${candidate_id}`;
          updateButton.classList.add("update-button");
          updateButton.addEventListener("click", () => handUpdate(candidate_id , name));


          headerElement.appendChild(nameSpan);
          
          candidateElement.appendChild(headerElement);
          candidateListElement.appendChild(candidateElement);
          candidateElement.appendChild(vote);
          candidateElement.appendChild(deleteButton);
          candidateElement.appendChild(updateButton);


      });
  }
});

addCandidateButton.addEventListener("click", async () => {
  if(window.web3) {
      web3 = new Web3(web3.currentProvider);
      contract = await contract_instance(web3, CONTRACT_ABI, CONTRACT_ADDRESS);
      const accounts = await web3.eth.getAccounts();
      const candidateName = document.getElementById("candidate-name").value;
      try {
        const gasPrice = await web3.eth.getGasPrice(); 
        await contract.methods.addCandidate(candidateName, accounts[0]).send({ from: accounts[0], gas: 9000000 , gasPrice: gasPrice});
        showCandidate();
        alert("Thêm ứng cử viên thành công!");  
      } catch (error) {
        alert("Có lỗi xảy ra khi thêm sách!");
        console.log(error);
      }
  }
});

const handleDelete = async (candidate_id) => {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const accounts = await web3.eth.getAccounts();

      const gasPrice = await web3.eth.getGasPrice();
      await contract.methods.removeCandidate(candidate_id).send({from: accounts[0],gas: 9000000,gasPrice: gasPrice,
      });

      alert("Xóa ứng cử viên thành công!");
      showCandidate(); // Cập nhật danh sách ứng viên
    } catch (error) {
      alert("Có lỗi xảy ra khi xóa ứng cử viên!");
      console.error(error);
    }
  }
};



const handUpdate = async (candidate_id, name) => {
  const newname = prompt("Nhập tên mới", name); // Lấy tên mới từ người dùng

  if (newname) {
    if (window.ethereum) {
      try {
        web3 = new Web3(web3.currentProvider);    
        contract = await contract_instance(web3, CONTRACT_ABI, CONTRACT_ADDRESS);
        const accounts = await web3.eth.getAccounts();
        const gasPrice = await web3.eth.getGasPrice(); 
       
        await contract.methods.updateCandidate(candidate_id, newname).send({ from: accounts[0], gas: 9000000, gasPrice: gasPrice });
        showCandidate(); // Cập nhật danh sách ứng viên
        alert("ứng viên đã được cập nhật thành công!");
      } catch (error) {
        alert("Có lỗi xảy ra khi cập nhật sách!");
        console.error(error);
      }
    }
  }
};

const showCandidate = async () => {
  showcandidates.click();
};
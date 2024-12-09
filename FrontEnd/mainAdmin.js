const connectButton = document.getElementById("connect-button");
const walletAddress = document.getElementById("wallet-address");
const showcandidates = document.getElementById("show-button");
const showvoters = document.getElementById("show-button-voter");
const addCandidateButton = document.getElementById("confirm-add-button");
const addVoterButton = document.getElementById("confirm-add-voter-button");

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
              // console.log("Kết nối thành công với tài khoản:", selectedAccount);
              walletAddress.textContent = selectedAccount; // Hiển thị tài khoản đã kết nối
              contract = await contract_instance(web3, CONTRACT_ABI, CONTRACT_ADDRESS);

              const adminAddress = await contract.methods.admin().call();

              if (selectedAccount.toLowerCase() === adminAddress.toLowerCase()) {
                // Hiển thị các nút CRUD
                document.getElementById('add-button').style.display = 'block';
                document.getElementById('show-button').style.display = 'block';
                document.getElementById('show-button-voter').style.display = 'block';

                document.getElementById('add-voter-button').style.display = 'inline-block'; // Thêm cử tri

            } else {
                alert("Bạn không có quyền admin");
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
//Thêm ứng cử viên
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
//Xóa ứng cử viên
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
//Cập nhật ứng cử viên
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

// Hiển thị danh sách cử tri
showvoters.addEventListener("click", async () => {
  if (window.web3) {
    web3 = new Web3(web3.currentProvider);
    contract = await contract_instance(web3, CONTRACT_ABI, CONTRACT_ADDRESS);
    const voterListElement = document.getElementById("voter-list");
    voterListElement.innerHTML = ''; // Xóa tất cả các cử tri hiện có

    try {
      // Gọi hàm lấy danh sách cử tri từ contract
      const voters = await showAllVoters(contract);
      console.log("Danh sách cử tri:", voters);
      // Hiển thị cử tri
      // Hiển thị cử tri
      voters[0].forEach((address, index) => {
        const listItem = document.createElement("div");
        listItem.className = "voter-item";
        
        // Hiển thị ID
        const idParagraph = document.createElement("p");
        idParagraph.textContent = `ID: ${index + 1}`; // ID tự động tăng bắt đầu từ 1

          
        const nameParagraph = document.createElement("p");
        nameParagraph.textContent = `Tên: ${voters[1][index]}`;
        
        const addressParagraph = document.createElement("p");
        addressParagraph.textContent = `Địa chỉ: ${address}`;
        
        // Tạo nút Delete
        const deleteButton = document.createElement("button");
        deleteButton.id = `delete-${index}`;
        deleteButton.textContent = "Xóa";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => handleDelete_voter(index));

        // Tạo nút Update
        const updateButton = document.createElement("button");
        updateButton.id = `update-${index}`;
        updateButton.textContent = "Cập Nhập";
        updateButton.classList.add("update-button");
        updateButton.addEventListener("click", () => handUpdate_voter(address, voters[1][index]));

        listItem.appendChild(idParagraph);
        listItem.appendChild(nameParagraph);
        listItem.appendChild(addressParagraph);
        listItem.appendChild(deleteButton);
        //listItem.appendChild(updateButton);
        
        voterListElement.appendChild(listItem);
      });
      
    } catch (error) {
      console.error("Có lỗi xảy ra khi hiển thị danh sách cử tri:", error);
      alert("Không thể tải danh sách cử tri!");
    }
  } else {
    alert("Vui lòng kết nối ví MetaMask!");
  }
});


//Thêm cử tri
addVoterButton.addEventListener("click", async () => {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const accounts = await web3.eth.getAccounts();
      const voterAddress = document.getElementById("voter-address").value;
      const voterName = document.getElementById("voter-name").value;

      const gasPrice = await web3.eth.getGasPrice();
      await contract.methods.addValidVoter(voterAddress, voterName).send({from: accounts[0], gas: 9000000, gasPrice: gasPrice});
      alert("Thêm cử tri thành công!");
      showVoter(); // Cập nhật danh sách cử tri
    } catch (error) {
      alert("Có lỗi xảy ra khi thêm cử tri!");
      console.error(error);
    }
  }
});

//xóa cử tri
const handleDelete_voter = async (index) => {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const accounts = await web3.eth.getAccounts();

      const gasPrice = await web3.eth.getGasPrice();
      await contract.methods.removeVoterById(index).send({from: accounts[0],gas: 9000000,gasPrice: gasPrice,
      });

      alert("Xóa cử tri thành công!");
      showVoter(); // Cập nhật danh sách cử tri
    } catch (error) {
      alert("Có lỗi xảy ra khi xóa cử tri!");
      console.error(error);
    }
  }
};

//cập nhật cử tri

// const handUpdate_voter = async (address, name) => {
//   const newName = prompt("Nhập tên mới", name); // Lấy tên mới từ người dùng
//   const newAddress = prompt("Nhập địa chỉ mới", address); // Lấy địa chỉ mới
//   if (newName) {
//     if (window.ethereum) {
//       try {
//         web3 = new Web3(web3.currentProvider);    
//         contract = await contract_instance(web3, CONTRACT_ABI, CONTRACT_ADDRESS);
//         const accounts = await web3.eth.getAccounts();
//         const gasPrice = await web3.eth.getGasPrice(); 
       
//         await contract.methods.updateVoterAddress(newAddress, newName).send({ from: accounts[0], gas: 9000000, gasPrice: gasPrice });
//         showVoter(); // Cập nhật danh sách cử tri
//         alert("Cử tri đã được cập nhật thành công!");

//       } catch (error) {
//         alert("Có lỗi xảy ra khi cập nhật cử tri!");
//         console.error(error);
//       }
//     } 
//   }
// }


//Hiển thị ứng cử viên
const showCandidate = async () => {
  showcandidates.click();
};
//hiển thị cử tri
const showVoter = async () => {
  showvoters.click();
};
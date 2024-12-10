//contract.js
let instance   ; 
async function contract_instance(web3 , abi , address) {
	return new web3.eth.Contract(abi, address);;
}
//-------------------quản lý time--------------------------------------------------------------------------------
//show bầu cử 
async function getTimeRemaining(instance) {
    return await instance.methods.getTimeRemaining().call();
}
//tạo cuộc bầu cử
async function createElection(instance, name, time, fromAddress) {
    return await instance.methods.createElection(name, time).send({ from: fromAddress });
}
//sửa cuộc bầu cử
async function updateElectionInfo(contract) {
    try {
        const result = await contract.methods.getTimeRemaining().call();
        console.log("Kết quả getTimeRemaining:", result);
        const timeRemaining = result[0];
        const electionName = result[1];

        if (timeRemaining > 0) {
            const timeText = formatTimeRemaining(Number(timeRemaining));
            document.getElementById("election-time-list").textContent = `Cuộc bầu cử: ${electionName} | Thời gian còn lại: ${timeText}`;
        } else {
            const winner = await contract.methods.getWinnerName().call();
            document.getElementById("election-time-list").textContent = `Cuộc bầu cử đã kết thúc. Người thắng: ${winner}`;
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin cuộc bầu cử:", error);
    }
}


function formatTimeRemaining(seconds) {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days} ngày ${hours} giờ ${minutes} phút ${secs} giây`;
}

// Cập nhật mỗi giây
setInterval(() => updateElectionInfo(contract), 1000);


//end bầu cử
async function endElection(instance, form) {
    return await instance.methods.endElection().send({ "from": form });
}

//------------------------------------------------------------------------------------------------------------

//hiển thị danh sách ứng cử viên
async function GetCandidate(instance) {
	return await instance.methods.getCandidates().call();
}
//thêm ứng cử viên
async function addCandidate(name, form) {
    try {
        // Gọi phương thức Solidity `addCandidate` với `id` được tự động tạo
        const currentId = await instance.methods.currentCandidateId().call();
        // Gửi giao dịch
        const transaction = await instance.methods.addCandidate(name).send({from: form });
        console.log('Ứng cử viên được thêm thành công', transaction);
    } catch (error) {
        console.error('Lỗi khi thêm ứng cử viên:', error);
    }
}
//cập nhật ứng cử viên
async function updateCandidate(instance, id, name, form) {
    return await instance.methods.updateCandidate(id, name).send({ "from": form });
}
//xóa ứng cử viên
async function removeCandidate(instance, id, form) {
    return await instance.methods.removeCandidate(id).send({ "from": form });
}
async function vote(instance, candidateId, form) {
    return await instance.methods.vote(candidateId).send({ "from": form });
}

//-----------------------------cử tri-------------------------------------------------------------------------------


//hiển thị danh sách cử tri đủ điều kiện
async function showAllVoters(instance) {
    return await instance.methods.showAllVoters().call();
}
//thêm cử tri đủ điều kiện
async function addValidVoter(instance, address, name, form) {
    return await instance.methods.addValidVoter(address, name).send({ "from": form });
}
//cập nhật địa chỉ cử tri
async function updateVoterAddress(instance, id, newAddress, form) {
    return await instance.methods.updateVoterAddress(id, newAddress).send({ "from": form });
}
//xóa cử tri
async function removeVoterById(instance, id, form) {
    return await instance.methods.removeVoterById(id).send({ "from": form });
}

//------------------------------------------------------------------------------------------------------------


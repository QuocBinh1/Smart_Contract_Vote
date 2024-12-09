//contract.js
async function contract_instance(web3 , abi , address) {
	return new web3.eth.Contract(abi, address);;
}

//-------------------tạo cuộc bầu cử--------------------------------------------------------------------------------
async function createElection(instance, name, time, fromAddress) {
    try {
        // Gọi phương thức Solidity `createElection` với tên và thời gian
        const transaction = await instance.methods.createElection(name, time).send({ from: fromAddress });
        console.log('Cuộc bầu cử được tạo thành công', transaction);
    } catch (error) {
        console.error('Lỗi khi tạo cuộc bầu cử:', error);
    }
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
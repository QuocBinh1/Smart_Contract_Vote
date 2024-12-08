//contract.js
async function contract_instance(web3 , abi , address) {
	return new web3.eth.Contract(abi, address);;
}

async function GetCandidate(instance) {
	return await instance.methods.getCandidates().call();
}

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

async function removeCandidate(instance, id, form) {
    return await instance.methods.removeCandidate(id).send({ "from": form });
}
async function updateCandidate(instance, id, name, form) {
    return await instance.methods.updateCandidate(id, name).send({ "from": form });
}

// async function vote(instance, id, form) {
//     return await instance.methods.vote(id).send({ "from": form });
// }



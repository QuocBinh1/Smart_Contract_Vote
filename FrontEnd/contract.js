//contract.js
async function contract_instance(web3 , abi , address) {
	return new web3.eth.Contract(abi, address);;
}

// async function GetAllBook(instance) {
// 	return await instance.methods.showAllBooks().call();
// }
// async function addBook(id, title, author,year, price , form) {
// 	return await instance.methods.addBook(id,title, author,year, price).send({"from": form});
// }
// async function updateBook(id, title, author, year, price, form) {
// 	return await instance.methods.updateBook(id, title, author, year, price).send({"from": form});
// }
// async function deleteBook(id, form) {
// 	return await instance.methods.deleteBook(id).send({"from": form});
// }
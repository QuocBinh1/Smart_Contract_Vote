// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Election {
    bool public electionStarted;
    bool public electionEnded;
    uint public electionEndTime;
    address public admin; // Địa chỉ admin
    mapping (address => bool) public isValidVoter;

    // Địa chỉ hợp lệ được phép bình
    mapping(address => bool) public validVoters;

    constructor() {
        admin = msg.sender; // Người triển khai là admin mặc định
    }
    modifier onlyadmin(){
        require(msg.sender == admin,"chi admin moi co quyen" );
        _;
    }
    
    

    // Quản lý cuộc bầu cử
    struct ElectionDetails {
        string title;
        uint start_date;
        uint end_date;
        string status;
    }
    ElectionDetails public election;

    // Quản lý ứng cử viên
    struct Candidate {
        uint candidate_id;
        string name;
        uint vote_count;
    }
    Candidate[] public candidates;
    mapping(uint => address) public candidateAddresses;
    uint public currentCandidateId = 0; // Biến trạng thái theo dõi ID ứng cử viên hiện tại

    struct Voter {
        address voterAddress;
        uint voterId;
    }
    Voter[] public votersList; 
    mapping(address => uint) public voterIds;  

    // Quản lý cử tri
    mapping(address => bool) public hasVoted;
    mapping(address => string) public voterNames; 
    address[] public voters;  

    // Các sự kiện
    event ElectionCreated(string title, uint start_date, uint end_date);
    event CandidateAdded(string name, uint candidate_id);
    event CandidateUpdated(uint candidate_id, string newName);
    event CandidateRemoved(uint candidate_id);
    event Voted(address voter, uint candidate_id);
    event ElectionEnded();
    event ElectionResults(uint[] voteCounts);
    event VoterAdded(address voter, string name);
    event VoterRemoved(address voter);
    event VoterUpdated(address oldAddress, address newAddress);

    // 1. Tạo cuộc bầu cử
    function createElection(string memory _title, uint _durationMinutes) public {
        require(!electionStarted, "Election has already started.");
        election = ElectionDetails({
            title: _title,
            start_date: block.timestamp,
            end_date: block.timestamp + _durationMinutes * 1 minutes,
            status: "Ongoing"
        });
        electionStarted = true;
        electionEndTime = election.end_date;
        emit ElectionCreated(_title, election.start_date, election.end_date);
    }

    // 2. Cập nhật tên cuộc bầu cử
    function updateElectionTitle(string memory _newTitle) public {
        require(electionStarted, "Election has not started.");
        election.title = _newTitle;
    }

    // 3. Đăng ký ứng cử viên
    function addCandidate(string memory _name) public {
        uint candidateId = currentCandidateId;
        candidates.push(Candidate({
            candidate_id: candidateId,
            name: _name,
            vote_count: 0
        }));
        candidateAddresses[candidateId] = msg.sender;
        currentCandidateId++;
        emit CandidateAdded(_name, candidateId);
    }

    // 4. Sửa thông tin ứng cử viên
    function updateCandidate(uint candidate_id, string memory newName) public {
        require(candidate_id < candidates.length, "Invalid candidate ID");
        require(msg.sender == candidateAddresses[candidate_id], "Only the owner can update this candidate");

        // Cập nhật tên ứng viên
        candidates[candidate_id].name = newName;
        emit CandidateUpdated(candidate_id, newName); // Thêm event nếu cần
    }

    // 5. Xóa ứng cử viên
    function removeCandidate(uint _candidateId) public {
        require(_candidateId < candidates.length, "Invalid candidate ID.");
        require(candidateAddresses[_candidateId] == msg.sender, "Only the candidate can remove their profile.");
        
        // Xóa ứng cử viên khỏi mảng
        for (uint i = _candidateId; i < candidates.length - 1; i++) {
            candidates[i] = candidates[i + 1];
        }
        candidates.pop();
        emit CandidateRemoved(_candidateId);
    }

    // 6. Đăng ký các địa chỉ ví hợp lệ (Cử tri)
    function addValidVoter(address _voter, string memory _name) public {
        require(!validVoters[_voter], "Voter is already registered.");
        validVoters[_voter] = true;
        voterNames[_voter] = _name;

        uint voterId = votersList.length; 
        voterIds[_voter] = voterId;  

        // Thêm cử tri vào mảng votersList
        votersList.push(Voter({
            voterId: voterId,
            voterAddress: _voter
    }));
    
    emit VoterAdded(_voter, _name);
    }
    
    function updateVoterAddress(uint _voterId, address _newAddress) public {
    // Kiểm tra ID hợp lệ
    require(_voterId < votersList.length, "Invalid voter ID.");

    // Lấy địa chỉ cũ của cử tri
    address oldAddress = votersList[_voterId].voterAddress;

    // Kiểm tra địa chỉ cử tri cũ hợp lệ
    require(validVoters[oldAddress], "Old voter address is not valid.");

    // Kiểm tra địa chỉ mới chưa được sử dụng
    require(!validVoters[_newAddress], "New address is already a valid voter.");

    // Xóa địa chỉ cũ khỏi danh sách hợp lệ
    validVoters[oldAddress] = false;

    // Thêm địa chỉ mới vào danh sách hợp lệ
    validVoters[_newAddress] = true;

    // Cập nhật trong danh sách cử tri
    votersList[_voterId].voterAddress = _newAddress;

    // Cập nhật tên liên kết với địa chỉ mới
    voterNames[_newAddress] = voterNames[oldAddress];
    voterNames[oldAddress] = ""; // Xóa tên liên kết với địa chỉ cũ

    emit VoterUpdated(oldAddress, _newAddress);
    }

    // 7. Xóa cử tri
    function removeVoterById(uint _voterId) public {
    require(_voterId < votersList.length, "Invalid voter ID.");

    // Tìm cử tri từ ID
    address voterAddress = votersList[_voterId].voterAddress;
    
    // Kiểm tra nếu cử tri đã bỏ phiếu và hủy phiếu của họ
    require(validVoters[voterAddress], "Voter is not valid.");
    validVoters[voterAddress] = false;
    hasVoted[voterAddress] = false;

    // Xóa cử tri khỏi mảng votersList
    for (uint i = _voterId; i < votersList.length - 1; i++) {
        votersList[i] = votersList[i + 1];
    }
    votersList.pop();  // Xóa phần tử cuối cùng trong mảng

    // Xóa ID cử tri từ mapping voterIds
    delete voterIds[voterAddress];

    emit VoterRemoved(voterAddress);
}

    // 8. Bỏ phiếu
    function vote(uint _candidateId) public {
        // Kiểm tra xem cử tri đã bỏ phiếu chưa
        require(validVoters[msg.sender], "You are not an authorized voter.");
        require(!hasVoted[msg.sender], "You have already voted.");
        require(_candidateId < candidates.length, "Invalid candidate.");

        candidates[_candidateId].vote_count++;
        hasVoted[msg.sender] = true;
        emit Voted(msg.sender, _candidateId);
    }

    // 9. Kết thúc cuộc bầu cử và công bố kết quả
    function endElection() public {
        require(!electionEnded, "Election has already ended.");
        electionEnded = true;
        
        uint[] memory results = new uint[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            results[i] = candidates[i].vote_count;
        }
        emit ElectionEnded();
        emit ElectionResults(results);
    }

    // 10. Quản lý thời gian bầu cử
    function getTimeRemaining() public view returns (uint) {
        if (block.timestamp >= electionEndTime) {
            return 0;
        }
        return electionEndTime - block.timestamp;
    }

    // 11. Lấy thông tin ứng cử viên
    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    // 12. Hiển thị tất cả các cử tri
    function showAllVoters() public view returns (Voter[] memory) {
        return votersList; // Trả về danh sách cử tri với địa chỉ và ID
    }
}
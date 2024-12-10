//tạo cuộc bầu cử

document.getElementById('create-election-button').addEventListener('click', function () {
    document.getElementById('form-election').style.display = 'block';
});
document.getElementById('cancel-election').addEventListener('click', function () {
    document.getElementById('form-election').style.display = 'none';
});


//ứng cử viên
document.getElementById('add-button').addEventListener('click', function () {
    document.getElementById('add-candidate-form').style.display = 'block';
});
document.getElementById('cancel-button').addEventListener('click', function () {
    document.getElementById('add-candidate-form').style.display = 'none';
});
//cử tri



//Hiển thị form "Thêm cử tri"
document.getElementById('add-voter-button').addEventListener('click', function () {
    document.getElementById('add-form-voter').style.display = 'block';
});

// Ẩn form "Thêm cử tri"
document.getElementById('cancel-voter-button').addEventListener('click', function () {
    document.getElementById('add-form-voter').style.display = 'none';
});



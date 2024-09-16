document.addEventListener("DOMContentLoaded", function () {
    const uploadForm = document.getElementById('uploadForm');

    // 检查是否为管理员
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
        alert('无权限上传，请先登录管理员账户！');
        window.location.href = 'login.html';
    }

    // 处理上传表单提交
    uploadForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(uploadForm);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'x-admin': isAdmin // 在请求头中附加管理员标志
                }
            });

            const result = await response.json();
            if (result.success) {
                alert('上传成功！');
                window.location.href = 'index.html';  // 上传成功后跳转到首页
            } else {
                alert('上传失败，请重试！');
            }
        } catch (error) {
            console.error('上传错误:', error);
            alert('上传时发生错误，请稍后再试！');
        }
    });
});

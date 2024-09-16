document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    let projectData;  // 用于存储当前项目数据

    if (!projectId) {
        alert('未找到作品');
        window.location.href = 'index.html'; // 如果没有找到ID，跳转回首页
        return;
    }

    try {
        const response = await fetch('/projects');
        const projects = await response.json();

        const project = projects[projectId];
        if (!project) {
            alert('作品不存在');
            window.location.href = 'index.html';
            return;
        }

        projectData = project; // 保存项目数据以便后续修改

        // 设置标题
        document.getElementById('project-title').innerText = project.title;

        // 设置媒体内容
        const projectMedia = document.getElementById('project-media');
        projectMedia.innerHTML = ''; // 清空已有内容

        if (project.type === 'image') {
            const img = document.createElement('img');
            img.src = `/uploads/${project.file}`; // 确保路径指向服务器正确文件夹
            img.style.maxWidth = '80%';
            projectMedia.appendChild(img);
        } else if (project.type === 'video') {
            const video = document.createElement('video');
            video.controls = true;
            video.style.maxWidth = '70%';  // 限制视频最大宽度为页面宽度的70%
            video.style.maxHeight = '300px'; // 限制视频最大高度为300px
            const source = document.createElement('source');
            source.src = `/uploads/${project.file}`;
            source.type = 'video/mp4';
            video.appendChild(source);
            projectMedia.appendChild(video);

        }

        // 设置描述
        const description = document.getElementById('project-description');
        description.innerHTML = markdownToHtml(project.description);

        // 设置修改表单的初始值
        document.getElementById('edit-title').value = project.title;
        document.getElementById('edit-description').value = project.description;

    } catch (error) {
        console.error('加载项目详情错误:', error);
    }

    // Markdown 转换函数
    function markdownToHtml(markdown) {
        return markdown
            .replace(/## (.*$)/gim, '<h2>$1</h2>') // h2
            .replace(/# (.*$)/gim, '<h1>$1</h1>') // h1
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>') // bold
            .replace(/\*(.*)\*/gim, '<em>$1</em>') // italic
            .replace(/\n/gim, '<br>'); // line break
    }

    // 检查是否为管理员
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin === 'true') {
        document.getElementById('edit-btn').style.display = 'block';
    }

    // 显示修改表单
    document.getElementById('edit-btn').addEventListener('click', () => {
        document.getElementById('edit-form').style.display = 'block';
    });

    // 取消修改
    document.getElementById('cancel-btn').addEventListener('click', () => {
        document.getElementById('edit-form').style.display = 'none';
    });

    // 提交修改表单
    document.getElementById('updateForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', document.getElementById('edit-title').value);
        formData.append('description', document.getElementById('edit-description').value);

        const fileInput = document.getElementById('edit-file');
        if (fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]);  // 只有在用户上传新文件时，才提交文件
        }

        try {
            const response = await fetch(`/projects/${projectId}`, {
                method: 'PUT',  // 使用PUT方法进行更新
                body: formData,
                headers: {
                    'x-admin': isAdmin  // 在请求头中附加管理员标志
                }
            });
            const result = await response.json();

            if (result.success) {
                alert('修改成功！');
                window.location.reload();  // 刷新页面以展示修改后的数据
            } else {
                alert('修改失败，请重试！');
            }
        } catch (error) {
            console.error('提交修改错误:', error);
            alert('提交修改时发生错误，请稍后再试！');
        }
    });
});

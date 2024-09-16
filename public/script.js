document.addEventListener("DOMContentLoaded", function () {
    loadProjects();
    loadArticles(); // 加载文章

    async function loadProjects() {
        const projectsContainer = document.getElementById('projects');
        projectsContainer.innerHTML = '';  // 清空项目列表

        try {
            const response = await fetch('/projects');
            const projects = await response.json();

            projects.forEach((project, index) => {
                const projectDiv = document.createElement('div');
                projectDiv.classList.add('project');

                const title = document.createElement('h3');
                title.innerText = project.title;

                // 包装点击事件，跳转到详情页面并传递项目的索引作为ID
                projectDiv.addEventListener('click', () => {
                    window.location.href = `details.html?id=${index}`;
                });

                if (project.type === 'image') {
                    const img = document.createElement('img');
                    img.src = `/uploads/${project.file}`;
                    projectDiv.appendChild(img);
                } else if (project.type === 'video') {
                    const video = document.createElement('video');
                    video.controls = true;
                    const source = document.createElement('source');
                    source.src = `/uploads/${project.file}`;
                    source.type = 'video/mp4';
                    video.appendChild(source);
                    projectDiv.appendChild(video);
                }

                const description = document.createElement('p');
                description.classList.add('description');
                description.innerHTML = markdownToHtml(project.description);
                projectDiv.appendChild(description);

                projectsContainer.appendChild(projectDiv);
            });
        } catch (error) {
            console.error('加载项目错误:', error);
        }
    }


     // 解析并显示文章内容的函数
     async function loadArticles() {
        const articlesContainer = document.getElementById('articles');
        articlesContainer.innerHTML = ''; // 清空文章列表

        try {
            const response = await fetch('/articles');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const articles = await response.json();

            // 显示文章列表并设置链接
            articles.forEach(article => {
                const articleItem = document.createElement('li');
                const articleLink = document.createElement('a');

                // 跳转到 article.html 并传递文件路径作为查询参数
                articleLink.href = `article.html?article=${encodeURIComponent(article)}`;
                
                // 仅显示文件名而非完整路径
                const fileName = article.split('/').pop();
                articleLink.innerText = fileName;

                articleItem.appendChild(articleLink);
                articlesContainer.appendChild(articleItem);
            });
        } catch (error) {
            console.error('Failed to load articles:', error);
        }
    }

    function markdownToHtml(markdown) {
        return markdown
            .replace(/## (.*$)/gim, '<h2>$1</h2>') // h2
            .replace(/# (.*$)/gim, '<h1>$1</h1>') // h1
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>') // bold
            .replace(/\*(.*)\*/gim, '<em>$1</em>') // italic
            .replace(/\n/gim, '<br>'); // line break
    }
});

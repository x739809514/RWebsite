let currentPage = 1;
const articlesPerPage = 15;  // Number of articles per page

const app = express();
document.addEventListener("DOMContentLoaded", function () {
    loadProjects();
    loadArticles(); // 加载文章
    app.use(express.static('public'))});

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


    async function loadArticles(page = 1) {
        const articlesContainer = document.getElementById('articles');
        articlesContainer.innerHTML = ''; // Clear current articles
        const paginationControls = document.querySelector('.pagination');
        if (paginationControls) paginationControls.remove();  // Clear existing pagination
    
        try {
            const response = await fetch('/articles'); // Fetch the articles
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const articles = await response.json();
    
            // Calculate pagination
            const totalArticles = articles.length;
            const totalPages = Math.ceil(totalArticles / articlesPerPage);
            const start = (page - 1) * articlesPerPage;
            const end = start + articlesPerPage;
            const articlesToDisplay = articles.slice(start, end);
    
            // Display the articles for the current page
            articlesToDisplay.forEach(article => {
                const articleItem = document.createElement('li');
                const articleLink = document.createElement('a');
    
                const fileName = article.split('\\').pop().replace('.md', '');
                articleLink.innerText = fileName;
    
                articleLink.href = `article.html?article=${encodeURIComponent(article)}`;
                articleItem.appendChild(articleLink);
                articlesContainer.appendChild(articleItem);
            });
    
            // Add pagination controls
            const paginationControls = document.createElement('div');
            paginationControls.classList.add('pagination');
    
            if (page > 1) {
                const prevButton = document.createElement('button');
                prevButton.innerText = 'Previous';
                prevButton.onclick = () => loadArticles(page - 1);  // Load the previous page
                paginationControls.appendChild(prevButton);
            }
    
            if (page < totalPages) {
                const nextButton = document.createElement('button');
                nextButton.innerText = 'Next';
                nextButton.onclick = () => loadArticles(page + 1);  // Load the next page
                paginationControls.appendChild(nextButton);
            }
    
            articlesContainer.appendChild(paginationControls);
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
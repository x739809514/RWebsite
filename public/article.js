// 如果在 article.html 页面，则加载并解析 Markdown 文件
const urlParams = new URLSearchParams(window.location.search);
const articlePath = urlParams.get('article');
if (articlePath) {
    loadArticle(articlePath);
}

// 加载并解析 Markdown 文件的函数
async function loadArticle(path) {
    console.log(path);
    try {
        const response = await fetch(`/articles/${path}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const markdownText = await response.text();

        // 使用 marked.js 解析 Markdown 并显示
        const markdownParser = marked.marked || marked;
        const articleContent = document.getElementById('article-content');
        articleContent.innerHTML = markdownParser(markdownText); // 解析Markdown

        // 设置文章标题为文件名（去掉 .md 后缀）
        const articleTitle = document.getElementById('article-title');
        const fileName = path.split('/').pop();
        articleTitle.innerText = fileName.split('\\').pop().replace('.md', '');
    } catch (error) {
        console.error('Failed to load article:', error);
    }
}
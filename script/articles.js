class BlogSystem {
    constructor() {
        const articlesConfig = [
    {
        id: '1',
        title: '标准代码模板',
        date: '2025-07-20',
        summary: '简介',
        filename: '标准代码模板.md',
        category: 'JavaScript'
    },
    {
        id: '2',
        title: 'React',
        date: '2025-07-20',
        summary: '简介',
        filename: 'React.md',
        category: 'React'
    },
    {
        id: '3',
        title: 'Web开发规范',
        date: '2025-07-20',
        summary: '简介',
        filename: 'Web开发规范.md',
        category: 'Web开发规范'
    },
    {
        id: '4',
        title: 'huafengWeb项目部署过程记录',
        date: '2025-07-20',
        summary: '简介',
        filename: 'huafengWeb项目部署过程记录.md',
        category: 'Web'
    }
];
        this.articles = articlesConfig;
        this.articlesPath = './articles/';
        this.currentArticle = null;
        this.init();
    }

    init() {
        this.bindEvents();
        
        // 根据当前页面决定初始化哪个视图
        if (document.getElementById('articleList')) {
            this.renderArticleList();
        } else if (document.getElementById('articleDetail')) {
            const urlParams = new URLSearchParams(window.location.search);
            const articleId = urlParams.get('article');
            if (articleId) {
                this.viewArticle(articleId, false);
            }
        }
    }

    bindEvents() {
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = 'articles.html';
            });
        }

        // 处理浏览器前进后退
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.articleId) {
                this.viewArticle(e.state.articleId, false);
            } else {
                window.location.href = 'articles.html';
            }
        });
    }

    renderArticleList() {
        const articleItems = document.getElementById('articleItems');
        const articleCount = document.getElementById('articleCount');

        articleCount.textContent = `${this.articles.length} 篇文章`;

        if (this.articles.length === 0) {
            articleItems.innerHTML = `
                <div class="error-message">
                    <h3>还没有发布文章</h3>
                </div>
            `;
            return;
        }

        articleItems.innerHTML = this.articles.map(article => `
            <div class="article-item" data-id="${article.id}">
                <div class="article-meta">
                    <div class="article-info">
                        <h3>${article.title}</h3>
                        <div class="article-date">${this.formatDate(article.date)} · ${article.category}</div>
                    </div>
                </div>
                <div class="article-summary">${article.summary}</div>
            </div>
        `).join('');

        // 绑定点击事件
        articleItems.querySelectorAll('.article-item').forEach(item => {
            item.addEventListener('click', () => {
                const articleId = item.getAttribute('data-id');
                window.location.href = `articlesInfo.html?article=${articleId}`;
            });
        });
    }


    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'Asia/Shanghai'
        };
        return date.toLocaleDateString('zh-CN', options);
    }

    async viewArticle(articleId, pushState = true) {
        const article = this.articles.find(a => a.id === articleId);
        if (!article) {
            this.showError('文章不存在');
            return;
        }

        this.currentArticle = article;

        // 更新页面标题
        document.title = `${article.title} - 我的在线笔记`;

        // 更新文章头部信息
        document.getElementById('detailTitle').textContent = article.title;
        document.getElementById('detailMeta').textContent = 
            `${this.formatDate(article.date)} · ${article.category}`;

        // 加载文章内容
        await this.loadMarkdownContent(article.filename);
    }

    async loadMarkdownContent(filename) {
        const contentDiv = document.getElementById('markdownContent');
        contentDiv.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                正在加载文章内容...
            </div>
        `;

        try {
            const response = await fetch(`${this.articlesPath}${filename}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const markdownText = await response.text();
            
            // 使用marked.js解析Markdown
            const htmlContent = marked.parse(markdownText);
            contentDiv.innerHTML = htmlContent;

        } catch (error) {
            console.error('加载文章失败:', error);
            contentDiv.innerHTML = `
                <div class="error-message">
                    <h3>加载文章失败</h3>
                    <p>无法加载文章内容: ${filename}</p>
                    <p>错误信息: ${error.message}</p>
                    <p>请检查文章文件是否存在于 articles/ 目录中</p>
                </div>
            `;
        }
    }

    showError(message) {
        const articleItems = document.getElementById('articleItems');
        if (articleItems) {
            articleItems.innerHTML = `
                <div class="error-message">
                    <h3>出错了</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// 初始化博客系统
document.addEventListener('DOMContentLoaded', () => {
    new BlogSystem();
});
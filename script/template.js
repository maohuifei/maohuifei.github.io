function loadComponent(selector, path) {
    fetch(path)
        .then(response => response.text())
        .then(html => {
            document.querySelector(selector).innerHTML = html;
        })
        .catch(err => {
            console.error(`加载组件失败: ${path}`, err);
        });
}

// 加载所有组件
window.addEventListener('DOMContentLoaded', () => {
    loadComponent('header', 'coms/header.html');
    loadComponent('footer', 'coms/footer.html');
});
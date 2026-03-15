document.addEventListener("DOMContentLoaded", function () {
    // 1. Get the article ID from the URL Query params (e.g., blog.html?id=123)
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    const skeletonLoader = document.getElementById('skeleton-loader');
    const blogContent = document.getElementById('blog-content');
    const errorMessage = document.getElementById('error-message');

    if (!postId) {
        if (skeletonLoader) skeletonLoader.style.display = 'none';
        showError();
        return;
    }

    // 2. Fetch the post data
    fetch("https://my-blog-backend-phi.vercel.app/api/posts")
        .then(response => response.json())
        .then(data => {
            if (data.success && data.posts && data.posts.length > 0) {
                // Find the specific post by ID
                const post = data.posts.find(p => p._id === postId || p.id === postId);

                if (post) {
                    renderPost(post);
                } else {
                    showError();
                }
            } else {
                showError();
            }
        })
        .catch(error => {
            console.error("Error fetching the blog post:", error);
            showError();
        });

    function renderPost(post) {
        // Hide skeleton, show content
        if (skeletonLoader) skeletonLoader.style.display = 'none';
        blogContent.style.display = 'block';

        // 3. Populate standard text and image fields
        document.getElementById('blog-title').textContent = post.title;
        document.getElementById('blog-category').textContent = post.category || 'Blog Post';
        document.getElementById('blog-cover-image').src = post.coverImage;
        document.getElementById('blog-cover-image').alt = post.title;

        // 4. Format the Date
        const dateString = new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('blog-date').textContent = dateString;

        // 5. Format and inject the Content
        const formattedContent = post.content
            .split(/\r?\n\r?\n/)
            .filter(p => p.trim() !== '')
            .map(p => {
                if (p.startsWith('•') || /^\d+\./.test(p)) {
                    return `<p style="margin-bottom: 1rem; padding-left: 1rem;">${p}</p>`;
                }
                return `<p style="margin-bottom: 1.5rem;">${p.replace(/\r?\n/g, '<br>')}</p>`;
            })
            .join('');

        document.getElementById('blog-body').innerHTML = formattedContent;

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function showError() {
        if (skeletonLoader) skeletonLoader.style.display = 'none';
        errorMessage.style.display = 'block';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const fileMenuBtn = document.getElementById('file-menu-btn');
    const fileDropdown = document.getElementById('file-dropdown');
    const newPostBtn = document.getElementById('new-post-btn');
    const viewPostsBtn = document.getElementById('view-posts-btn');
    const exitAppBtn = document.getElementById('exit-app-btn');
    const postContentTextArea = document.getElementById('post-content');
    const postsWindow = document.getElementById('posts-window');
    const postsDisplayArea = document.getElementById('posts-display-area');
    const closePostsWindowBtn = document.getElementById('close-posts-window-btn');
    const postCountStatus = document.getElementById('post-count-status');
    const mainAppWindow = document.querySelector('.window'); // The main text.exe window

    let posts = JSON.parse(localStorage.getItem('textExePosts')) || [];

    function updatePostCount() {
        postCountStatus.textContent = `${posts.length} post${posts.length === 1 ? '' : 's'}`;
    }

    // Function to render posts
    function renderPosts() {
        if (posts.length === 0) {
            postsDisplayArea.innerHTML = '<p>No posts yet. Be the first to post!</p>';
            return;
        }
        postsDisplayArea.innerHTML = '';
        posts.forEach((post, index) => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post-item';
            postDiv.innerHTML = `
                <p>${post.content}</p>
                <small>Posted on: ${new Date(post.timestamp).toLocaleString()}</small>
            `;
            postsDisplayArea.prepend(postDiv); // Add new posts to the top
        });
        postsDisplayArea.scrollTop = 0; // Scroll to top to see newest
        updatePostCount();
    }

    // Toggle File menu dropdown
    fileMenuBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent document click from closing immediately
        fileDropdown.style.display = fileDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!fileMenuBtn.contains(event.target) && !fileDropdown.contains(event.target)) {
            fileDropdown.style.display = 'none';
        }
    });

    // Handle "New Post"
    newPostBtn.addEventListener('click', () => {
        const content = postContentTextArea.value.trim();
        if (content) {
            const newPost = {
                content: content,
                timestamp: new Date().toISOString()
            };
            posts.push(newPost);
            localStorage.setItem('textExePosts', JSON.stringify(posts));
            postContentTextArea.value = ''; // Clear the textarea
            alert('Your post has been "saved"! (locally)');
            fileDropdown.style.display = 'none'; // Close dropdown
            renderPosts(); // Re-render posts to show the new one
        } else {
            alert('Please type something before posting!');
        }
    });

    // Handle "View Posts"
    viewPostsBtn.addEventListener('click', () => {
        postsWindow.classList.remove('hidden');
        renderPosts();
        fileDropdown.style.display = 'none'; // Close dropdown
    });

    // Handle "Exit" (minimizes the app, doesn't close the browser)
    exitAppBtn.addEventListener('click', () => {
        mainAppWindow.classList.add('hidden');
        fileDropdown.style.display = 'none'; // Close dropdown
    });

    // Close posts window
    closePostsWindowBtn.addEventListener('click', () => {
        postsWindow.classList.add('hidden');
    });

    // Initial render of posts when page loads
    renderPosts();

    // Basic window controls (minimize/maximize don't do much here)
    const titleBarControls = document.querySelectorAll('.title-bar-controls button');
    titleBarControls.forEach(button => {
        button.addEventListener('click', (event) => {
            const label = button.getAttribute('aria-label');
            if (label === 'Close' && button.closest('.window').id !== 'posts-window') {
                // If it's the main app window's close button
                mainAppWindow.classList.add('hidden');
            } else if (label === 'Close' && button.closest('.window').id === 'posts-window') {
                postsWindow.classList.add('hidden');
            }
            // For minimize/maximize, just a placeholder alert
            // if (label === 'Minimize' || label === 'Maximize') {
            //     alert(`${label} clicked! (Functionality not implemented)`);
            // }
        });
    });
});

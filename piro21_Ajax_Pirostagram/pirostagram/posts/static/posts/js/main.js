document.addEventListener('DOMContentLoaded', function() {
    const posts = document.querySelectorAll('.post');
    const searchInput = document.querySelector('.search');
    const sortButtons = document.querySelectorAll('.sort-btn');

    function likePost(postElement) {
        const postId = postElement.dataset.postId;
        const likeButton = postElement.querySelector('.post__action-btn--like');
        const likesElement = postElement.querySelector('.post__likes');
        const likesCountElement = likesElement.querySelector('.post__likes-count');
        
        if (!likeButton || !likesCountElement) {
            console.error('Like button or likes count element not found');
            return;
        }
    
        const isLiked = likeButton.dataset.liked === 'true';
    
        fetch('/like/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: `post_id=${postId}`
        })
        .then(response => response.json())
        .then(data => {
            if (likesCountElement) {
                likesCountElement.textContent = data.likes_count;
            }
            likeButton.dataset.liked = (!isLiked).toString();
            if (!isLiked) {
                likeButton.classList.add('liked');
            } else {
                likeButton.classList.remove('liked');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }


    function addComment(postElement, commentText) {
        const postId = postElement.dataset.postId;
        const commentsDiv = postElement.querySelector('.post__comments');
        
        fetch('/comment/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: `post_id=${postId}&text=${encodeURIComponent(commentText)}`
        })
        .then(response => response.json())
        .then(data => {
            const newComment = document.createElement('div');
            newComment.classList.add('comment');
            newComment.dataset.commentId = data.comment_id;
            newComment.innerHTML = `
                <span class="comment__username">${data.user}</span> ${data.text}
                <button class="delete-comment-btn" onclick="deleteComment(${data.comment_id})">삭제</button>
                <button class="toggle-reply-btn" onclick="toggleReplyForm(${data.comment_id})">답글</button>
                <div class="replies"></div>
                <form class="reply-form" style="display: none;" onsubmit="addReply(event, ${data.comment_id})">
                    <input type="text" name="reply" placeholder="답글 달기..." required>
                    <button type="submit">게시</button>
                </form>
            `;
            commentsDiv.appendChild(newComment);
        });
    }

    function deleteComment(commentId) {
        const userConfirmed = confirm('댓글을 삭제하시겠습니까?');
        if (userConfirmed) {
            fetch('/comment/delete/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: `comment_id=${commentId}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const comment = document.querySelector(`.comment[data-comment-id="${commentId}"]`);
                    comment.remove();
                }
            });
        }
    }

    function toggleReplyForm(commentId) {
        const form = document.querySelector(`.comment[data-comment-id="${commentId}"] .reply-form`);
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }

    function addReply(event, commentId) {
        event.preventDefault();
        const form = event.target;
        const replyText = form.reply.value;

        fetch('/reply/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: new URLSearchParams({
                comment_id: commentId,
                text: replyText
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const comment = document.querySelector(`.comment[data-comment-id="${commentId}"]`);
                const repliesDiv = comment.querySelector('.replies');
                const newReply = document.createElement('div');
                newReply.classList.add('comment');  // 대댓글에도 기존 댓글 스타일 적용
                newReply.classList.add('reply');    // 추가로 대댓글 스타일 적용
                newReply.dataset.replyId = data.reply_id;
                newReply.innerHTML = `
                    <span class="comment__username">${data.user}</span> ${data.text}
                    <button class="delete-comment-btn" onclick="deleteReply(${data.reply_id})">삭제</button>
                `;
                repliesDiv.appendChild(newReply);
                form.reset();
                form.style.display = 'none';
            } else {
                alert('대댓글을 추가할 수 없습니다.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function deleteReply(replyId) {
        const userConfirmed = confirm('대댓글을 삭제하시겠습니까?');
        if (userConfirmed) {
            fetch('/reply/delete/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: `reply_id=${replyId}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const reply = document.querySelector(`.reply[data-reply-id="${replyId}"]`);
                    reply.remove();
                }
            });
        }
    }

    posts.forEach(post => {
        post.querySelector('.post__action-btn--like').addEventListener('click', () => likePost(post));
        
        post.querySelector('.post__add-comment').addEventListener('submit', (event) => {
            event.preventDefault();
            const input = event.target.querySelector('input[name="comment"]');
            addComment(post, input.value);
            input.value = '';
        });

        post.querySelectorAll('.toggle-reply-btn').forEach(button => {
            button.addEventListener('click', function() {
                const commentId = this.closest('.comment').dataset.commentId;
                toggleReplyForm(commentId);
            });
        });

        post.querySelectorAll('.reply-form').forEach(form => {
            form.addEventListener('submit', function(event) {
                const commentId = this.closest('.comment').dataset.commentId;
                addReply(event, commentId);
            });
        });

        post.querySelectorAll('.delete-comment-btn').forEach(button => {
            button.addEventListener('click', function() {
                const commentId = this.closest('.comment').dataset.commentId;
                deleteComment(commentId);
            });
        });
    });

    searchInput.addEventListener('input', () => searchPosts(searchInput.value.toLowerCase()));

    sortButtons.forEach(button => {
        button.addEventListener('click', () => sortPosts(button.dataset.sort));
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function searchPosts(query) {
        posts.forEach(post => {
            const username = post.querySelector('.post__user-name').textContent.toLowerCase();
            const caption = post.querySelector('.post__caption').textContent.toLowerCase();
            if (username.includes(query) || caption.includes(query)) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    }

    function sortPosts(sortBy) {
        const postsArray = Array.from(posts);
        postsArray.sort((a, b) => {
            if (sortBy === 'recent') {
                return b.dataset.postId - a.dataset.postId;
            } else if (sortBy === 'popular') {
                return b.dataset.likes - a.dataset.likes;
            }
        });
        const container = document.querySelector('.container');
        postsArray.forEach(post => container.appendChild(post));
    }

    function initializeSliders() {
        const sliders = document.querySelectorAll('.post__image-slider .slider');
        sliders.forEach(slider => {
            slider.dataset.index = 0;
            updateSlider(slider);

            const images = slider.querySelectorAll('.post__image');
            images.forEach(image => {
                image.onload = () => {
                    if (image.naturalHeight / image.naturalWidth > 4 / 3) {
                        image.classList.add('slider__image--vertical');
                    } else {
                        image.classList.remove('slider__image--vertical');
                    }
                };
            });
        });
    }

    // 이전 슬라이드로 이동 함수 수정
function prevSlide(button) {
    const slider = button.closest('.post__image-slider').querySelector('.slider');
    let index = parseInt(slider.dataset.index);
    if (index > 0) {
        index--;
        slider.dataset.index = index;
        updateSlider(slider);
    }
}

// 다음 슬라이드로 이동 함수 수정
function nextSlide(button) {
    const slider = button.closest('.post__image-slider').querySelector('.slider');
    let index = parseInt(slider.dataset.index);
    if (index < slider.children.length - 1) {
        index++;
        slider.dataset.index = index;
        updateSlider(slider);
    }
}

// 슬라이더 업데이트 함수
function updateSlider(slider) {
    const index = parseInt(slider.dataset.index);
    const offset = -index * 100;
    slider.style.transform = `translateX(${offset}%)`;
}


    initializeSliders();

    window.deleteComment = deleteComment;
    window.toggleReplyForm = toggleReplyForm;
    window.addReply = addReply;
    window.deleteReply = deleteReply;
    window.prevSlide = prevSlide;
    window.nextSlide = nextSlide;
});

document.addEventListener('DOMContentLoaded', function() {
    // 찜하기 기능
    document.querySelectorAll('.star-button').forEach(button => {
        button.addEventListener('click', function() {
            const ideaId = this.dataset.ideaId;
            fetch(`/api/ideas/${ideaId}/star/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })
            .then(response => response.json())
            .then(data => {
                const starSpan = this.querySelector('.star');
                if (data.starred) {
                    starSpan.textContent = '★';
                    starSpan.classList.add('active');
                } else {
                    starSpan.textContent = '☆';
                    starSpan.classList.remove('active');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('오류가 발생했습니다. 다시 시도해주세요.');
            });
        });
    });

    // 관심도 조절 기능
    document.querySelectorAll('.interest-minus, .interest-plus').forEach(button => {
        button.addEventListener('click', function() {
            const ideaId = this.dataset.ideaId;
            const action = this.classList.contains('interest-minus') ? 'decrease' : 'increase';
            fetch(`/api/ideas/${ideaId}/interest/${action}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })
            .then(response => response.json())
            .then(data => {
                const interestValue = this.parentElement.querySelector('.interest-value');
                interestValue.textContent = data.interest;
            });
        });
    });

    // 스크롤 애니메이션
    window.addEventListener('scroll', function() {
        const ideas = document.querySelectorAll('.idea-item');
        ideas.forEach(idea => {
            const ideaPosition = idea.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            if (ideaPosition < screenPosition) {
                idea.classList.add('fade-in');
            }
        });
    });
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
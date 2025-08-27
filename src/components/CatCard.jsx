import React, { useRef, useEffect } from 'react';

function CatCard({ catUrl, swipeDirection }) {
    const emojiRef = useRef(null);

    useEffect(() => {
        const emoji = emojiRef.current;
        if (emoji) {
            if (swipeDirection === 'right') {
                emoji.classList.add('like-emoji');
                emoji.textContent = '❤️';
            } else if (swipeDirection === 'left') {
                emoji.classList.add('dislike-emoji');
                emoji.textContent = '❌';
            } else {
                emoji.classList.remove('like-emoji', 'dislike-emoji');
                emoji.textContent = '';
            }
            // Remove class and reset after animation
            const animationDuration = 600; // Match CSS animation duration (0.6s)
            const timeoutId = setTimeout(() => {
                emoji.classList.remove('like-emoji', 'dislike-emoji');
                emoji.textContent = '';
            }, animationDuration);

            // Cleanup timeout on unmount or direction change
            return () => clearTimeout(timeoutId);
        }
    }, [swipeDirection]);

    return (
        <div className="cat-card">
            <img src={catUrl} alt="cat" loading="lazy" />
            <div ref={emojiRef} className="emoji"></div>
        </div>
    );
}

export default CatCard;
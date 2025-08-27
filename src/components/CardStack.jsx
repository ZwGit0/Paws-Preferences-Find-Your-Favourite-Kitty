import { useState, useEffect, useRef, createRef, useCallback } from 'react';
import TinderCard from 'react-tinder-card'
import CatCard from './CatCard';
import Summary from './Summary';
import { debounce } from 'lodash';
import { FaTimes, FaHeart } from "react-icons/fa"

function CardStack(){
    const [cats, setCats] = useState([]);
    const [liked, setLiked] = useState([]);
    const [finished, setFinished] = useState(false);
    const [swipeDir, setSwipeDir] = useState(null);
    const [firstImageLoaded, setFirstImageLoaded] = useState(false);  

    // Track the top card’s index (last in the array is on top)
    const [currentIndex, setCurrentIndex] = useState(-1)
    const currentIndexRef = useRef(currentIndex)  

    const setCI = (i) => {
        currentIndexRef.current = i
        setCurrentIndex(i)
    }

    // Ref active card
    const activeRef = createRef()

    useEffect(() => {
        // Fetch 10 random cats 
        const urls = Array.from({ length: 10 }, (_, i) => `https://cataas.com/cat?seed=${i}`);
        
            const promises = urls.map(url =>
                new Promise((resolve) => {
                    const img = new Image();
                    img.src = url;
                    img.onload = () => resolve(url);   // resolve with fixed URL
                    img.onerror = () => resolve(url);  // resolve even if fails
                })
            );

            Promise.all(promises).then((preloadedUrls) => {
                setCats(preloadedUrls);
                setCI(preloadedUrls.length - 1);
                setFirstImageLoaded(true);
            });
    }, [])

    const handleSwipe = (direction, catUrl, index) => {
        setSwipeDir(direction);
        if (direction === 'right') {
            setLiked(prev => [...prev, catUrl])
        }
        // move to next card under the stack
        const nextIndex = index - 1
        setCI(nextIndex)
        if (nextIndex < 0) setFinished(true)
        // Delay resetting swipeDir to allow animation to complete
        setTimeout(() => setSwipeDir(null), 600);
    }

    const swipe = useCallback(
        debounce(async (dir) => {
            if (currentIndexRef.current < 0) return;
            if (activeRef.current && activeRef.current.swipe) {
                await activeRef.current.swipe(dir);
            }
        },),
        [currentIndex, activeRef]
    )

    return (
        <div className="stack-container">
        {!finished ? (
            <>
            <div className="card-stack">
                {cats.length === 0 ? (
                    <div className="placeholder-card">Loading...</div>
                ) : (
                    <TinderCard
                        ref={activeRef}
                        key={cats[currentIndex]}
                        onSwipe={(dir) => handleSwipe(dir, cats[currentIndex], currentIndex)}
                        preventSwipe={['up', 'down']}
                        swipeRequirementType="position"
                        swipeThreshold={35}
                    >
                        <CatCard catUrl={cats[currentIndex]} swipeDirection={swipeDir}/>
                    </TinderCard>
                )}
            </div>

            <div className="controls">
                <button
                    className="dislike"
                    onClick={() => swipe('left')}
                    disabled={currentIndex < 0 || !firstImageLoaded}
                >
                    <FaTimes size={28} />
                </button>

                <button
                    className="like"
                    onClick={() => swipe('right')}
                    disabled={currentIndex < 0 || !firstImageLoaded}
                >
                    <FaHeart size={28} />
                </button>
            </div>
            </>
        ) : (
            <Summary liked={liked} />
        )}
        </div>
    )
}

export default CardStack;
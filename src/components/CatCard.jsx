function CatCard({ catUrl, swipeDirection }) {
  return (
    <div className="cat-card">
    <img src={catUrl} alt="cat" loading="lazy" />
      
        {swipeDirection === 'right' && <div className="emoji like-emoji">❤️</div>}
        {swipeDirection === 'left' && <div className="emoji dislike-emoji">❌</div>}
    </div>
  )
}

export default CatCard;
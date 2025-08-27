function Summary({liked}) {
    return (
        <div className="summary">
            <h2> You liked {liked.length} cats!</h2>
            <div className="liked-cat">
                {liked.map((cat, i) => (
                    <img key={i} src={cat} alt="liked-cat" />
                ))}
            </div>
            <button onClick={() =>window.location.reload()}>Start Over</button>
        </div>
    );
}

export default Summary
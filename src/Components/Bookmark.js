import React, { useState } from 'react';
import '../Styles/Bookmark.css'

const Bookmark = () => {
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleToggle = () => {
        setIsBookmarked(!isBookmarked);
    };

    return (
        <div className="bookmark-switch">
            <input
                checked={isBookmarked}
                onChange={handleToggle}
                className="switch-checkbox"
                id="bookmark-switch"
                type="checkbox"
            />
            <label
                className="switch-label"
                htmlFor="bookmark-switch"
            >
                <span className="switch-button" />
            </label>
        </div>
    );
};

export default Bookmark;

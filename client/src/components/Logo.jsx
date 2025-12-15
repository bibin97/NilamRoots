
import React from 'react';

const Logo = ({ className = "h-8 w-8" }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Golden Oil Drop */}
        <path d="M50 5 C50 5 90 45 90 70 C90 89.33 74.33 105 55 105 C35.67 105 20 89.33 20 70 C20 45 50 5 50 5Z" fill="url(#goldGradient)" />

        {/* Green Leaf overlay */}
        <path d="M50 25 Q70 25 80 45 Q50 55 40 85 Q30 55 50 25Z" fill="#166534" fillOpacity="0.9" />

        <defs>
            <linearGradient id="goldGradient" x1="50" y1="5" x2="50" y2="105" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FACC15" />
                <stop offset="1" stopColor="#CA8A04" />
            </linearGradient>
        </defs>
    </svg>
);

export default Logo;

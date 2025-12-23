import React from 'react';

const BackgroundBlobs = () => {
    return (
        <>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-echo-pastel-blue/30 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-echo-cyan/20 rounded-full blur-3xl pointer-events-none"></div>
        </>
    );
};

export default BackgroundBlobs;

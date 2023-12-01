import React from 'react';

const Maps = ({ latitude, longitude, onClose, zoom = 15, width = 400, height = 300 }) => {
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key

    const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&markers=${latitude},${longitude}&key=${apiKey}`;

    return (
        <div className='floating-preview'>
            <div className='container'>
                <div className="button-row mb-5 d-flex justify-content-end">
                    <button onClick={onClose} className="btn btn-danger" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, width: 40 }}>x</button>
                </div>
                <img
                    src={imageUrl}
                    alt="Location on Google Map"
                    style={{ width: '100%', height: 'auto' }}
                />
            </div>
        </div>
    );
};

export default Maps;

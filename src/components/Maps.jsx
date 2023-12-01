import React from 'react';

const Maps = ({ latitude, longitude, onClose, zoom = 15, width = 400, height = 300 }) => {
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key

    // const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&markers=${latitude},${longitude}`;
    //const imageUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=13&size=600x400&maptype=mapnik&markers=${latitude},${longitude},red-pushpin`;

    // const mapUrl = `https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3685.8101379274012!2d${latitude}!3d${longitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjLCsDMwJzQwLjciTiA4OMKwMjInMTAuOCJF!5e0!3m2!1sen!2sin!4v1701413096130!5m2!1sen!2sin`;
    //const mapUrl = "https://www.google.com/maps/place/22%C2%B030'40.7%22N+88%C2%B022'10.8%22E/@22.5089269,88.362178,17z/"
    const mapUrl = `https://maps.openstreetmap.org/?staticmap&center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}`;
    //const imageUrl = "https://ebrelsford.github.io/thoughts/img/interesting-areas-2019-gmaps.png";
    return (
        <div className='floating-preview'>
            <div className='container overflow-hidden'>
                <div className='m-0 button-row'>
                    <h2 className="py-4 w-100 m-0 bg-dark text-center" style={{color:"white"}}>Venue</h2>
                </div>
                <div className="button-row mb-1 d-flex justify-content-end">
                    <button onClick={onClose} className="btn btn-danger" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, width: 40 }}>x</button>
                </div>
                {/* <img
                    src={imageUrl}
                    alt="Location on Google Map"
                    style={{ width: '100%', height: 'auto' }}
                /> */}
                <iframe src={mapUrl} width="100%" height="100%" style={{border:0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
    );
};

export default Maps;

import React from 'react';
import { FaWindowClose } from 'react-icons/fa';

const Alert = ({ title, message, onAccept, onClose, className, style}) => {
    return (
        <div className={`floating-preview ${className}`} style={style}>
            <div className='container overflow-hidden' style={{minHeight:220,height:"fit-content"}}>
                <div className='m-0 button-row'>
                    <h2 className="py-4 w-100 m-0 bg-dark text-center" style={{color:"white"}}>{title}</h2>
                </div>
                <div className="button-row mb-2 d-flex justify-content-end">
                    {/* <FaWindowClose onClick={onClose} className="btn btn-danger" style={{width: 40}}/> */}
                    <button onClick={onAccept} className="btn btn-danger me-2" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, width: 100 }}>Delete</button>
                    <button onClick={onClose} className="btn btn-primary me-2" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, width: 100 }}>Cancel</button>
                </div>
                <p className='p-4 text-center' style={{fontSize:"large"}}>{message}</p>
            </div>
        </div>
    );
};

export default Alert;

import React, {useState, useRef, useEffect} from 'react';
import './Card.css';

export default function Card(props){
    const [positions, setPositions] = useState({x : 0, y : 0})
    useEffect(() => {
        //[positions] - Set initial positions of the card once the component did mount
        const positionsInfo = card.current.getBoundingClientRect()
        setPositions({x : positionsInfo.x,
                      y : positionsInfo.y
                    });
    },[]);

    const card = useRef(null);

    const uniqueClassName = 'card card-' + props.uid;
    return(
        <div className='card-container'>
            <div 
                ref={card}
                onMouseDown={
                    props.onMouseDownHandler ? (e) => {props.onMouseDownHandler(e, card.current, positions)} : null
                } 
                className={uniqueClassName}
            >
                <p className='asset'>Assets here</p>
            </div>
        </div>
    )
}


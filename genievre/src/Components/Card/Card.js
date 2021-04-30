import React, {useState, useRef} from 'react';
import './Card.css';

export default function Card(){
    let  divX = 0,  divY = 0, mouseX = 0, mouseY = 0;

    const card = useRef(null);

    function handleMouseDown(e){
        e.preventDefault();

        mouseX = e.clientX;
        mouseY = e.clientY;

        card.current.onmouseup=handleMouseUp;
        card.current.onmousemove=handleMouseMove;
    }
    
    function handleMouseMove(e){
        e.preventDefault();
        divX = mouseX - e.clientX;
        divY = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;

        card.current.style.top = (card.current.offsetTop - divY) + "px";
        card.current.style.left = (card.current.offsetLeft - divX) + "px"
    }
    
    function handleMouseUp(e){
        card.current.onmouseup = null;
        card.current.onmousemove = null;
    }

    return(
        <div ref={card} onMouseDown={handleMouseDown} className="card">
            <p>Assets here</p>
        </div>
    )
}


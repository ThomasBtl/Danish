import React, {useEffect, useRef, useState} from 'react';
import Hand from '../Hand/Hand';
import Card from '../Card/Card';
import ShitPile from '../ShitPile/ShitPile';

/**
 *  Component representing the page of the game
 *  Act as a hub for the majority of the player's interaction with the game
 */
export default function Gamepage(){
    //Reference to game components
    const handRef = useRef(null);    
    const shitPileRef = useRef(null);

    //Test variables
    const CARDS = [<Card key={1} uid={1} onMouseDownHandler={cardMouseDownHandler}/>, <Card key={2} uid={2} onMouseDownHandler={cardMouseDownHandler}/>];

    //State keeping track of where the cards are
    const [hand, setHand] = useState(CARDS)
    const [shitPile, setShitPile] = useState([<Card key={3} uid={3} />])

    //Card mouvement variables
    let mouseX = 0, mouseY = 0, deltaX = 0, deltaY = 0;

    /**
     * Card mouse down handler
     * @param {SynteticBaseEvent} e 
     * @param {Object} cardElement the ref of the card that is being dragged
     * @param {Object} positions the positions of the card that is being dragged
     */
    function cardMouseDownHandler(e, cardElement, positions){
        e.preventDefault();

        //get mouse click position
        mouseX = e.clientX;
        mouseY = e.clientY;

        //set the handler for onmouseup (drop card) and onmousemove (move card around)
        cardElement.onmouseup = (e) => cardMouseUpHandler(e, cardElement, positions);
        cardElement.onmousemove = (e) => cardMouseDragHandler(e, cardElement);
    }

    /**
     * Function that allow to drag the card around the game page
     * @param {SynteticBaseEvent} e 
     * @param {Object} cardElement the ref of the card that is being dragged
     */
    function cardMouseDragHandler(e, cardElement){
        e.preventDefault();

        //compute delta
        deltaX = mouseX - e.clientX;
        deltaY = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;

        //move card with delta
        cardElement.style.top = (cardElement.offsetTop - deltaY) + 'px';
        cardElement.style.left = (cardElement.offsetLeft - deltaX) + 'px';
    }

    /**
     * Function that drop the card once the player release its mouse click
     * Check if the the card is in a dedicated component -> If so card switch to new component
     *                                                   -> If not card put back to his original dedicated component                                          
     * @param {SynteticBaseEvent} e 
     * @param {Object} cardElement the ref of the card that is being dragged
     * @param {Object} positions the positions of the card that is being dragged
     */
    function cardMouseUpHandler(e, cardElement, positions){
        e.preventDefault();
        
        if(isCardOverShitPile()){
            swapCardComponent(cardElement.className);
        }
        
        //Remove event
        cardElement.onmouseup = null;
        cardElement.onmousemove = null;

        //put card to (new) initial location
        cardElement.style.top = `${positions.y}px`;
        cardElement.style.left = `${positions.x}px`;
    }

    function isCardOverShitPile(){
        const area = {
            x : shitPileRef.current.getBoundingClientRect().x,
            y : shitPileRef.current.getBoundingClientRect().y,
            xp : shitPileRef.current.getBoundingClientRect().x + shitPileRef.current.getBoundingClientRect().width,
            yp : shitPileRef.current.getBoundingClientRect().y + shitPileRef.current.getBoundingClientRect().height
        };
        return (mouseX >= area.x && mouseX <= area.xp && mouseY >= area.y && mouseY <= area.yp);
    }

    function swapCardComponent(classNameTarget){
        const cardUid = parseInt(classNameTarget.split('-')[1])
        const card = hand.find(c => c.props.uid === cardUid);
        if(card){
            const newHand = hand.filter(c => {
                console.log(c.key)
                console.log(card.key)
                return c.key !== card.key
            });
            const cardProps = card.props
            //copy card
            const newCard = <Card  key={cardProps.uid} uid={cardProps.uid} />
            setHand(newHand);
            setShitPile([...shitPile, newCard]);
        }
        //ERROR : Should not be there
    }

    return(
        <div id="game-page">
            <Hand
                cards = {hand}
                handRef = {handRef}
            />
            <ShitPile 
                shitPileRef = {shitPileRef}
                cards = {shitPile}
            />
        </div>
    )
}
import React, {useRef, useState} from 'react';
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
    const [hand, setHand] = useAsyncRef(CARDS)
    const [shitPile, setShitPile] = useAsyncRef([<Card key={3} uid={3} />])

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
        
        cardElement.style.position = 'absolute';

        //get mouse click position
        mouseX = e.clientX
        mouseY = e.clientY

        cardElement.style.zIndex = 9000;

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
        mouseX = e.clientX
        mouseY = e.clientY

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

    /**
     * @returns true if the mouse is over the shitpile while dropping the card, false otherwise
     */
    function isCardOverShitPile(){
        const area = {
            x : shitPileRef.current.getBoundingClientRect().x,
            y : shitPileRef.current.getBoundingClientRect().y,
            xp : shitPileRef.current.getBoundingClientRect().x + shitPileRef.current.getBoundingClientRect().width,
            yp : shitPileRef.current.getBoundingClientRect().y + shitPileRef.current.getBoundingClientRect().height
        };
        return (mouseX >= area.x && mouseX <= area.xp && mouseY >= area.y && mouseY <= area.yp);
    }

    /**
     * Swap the card from the hand to the shit shit pile. This function is not really portable but right now it does the job.
     * TODO : Redo it so we can swap the card from the hand to the shit pile but also from the shit pile to the hand. In later PR
     * @param {String} classNameTarget the className of the card that is being moved
     */
    function swapCardComponent(classNameTarget){
        const cardUid = parseInt(classNameTarget.split('-')[1])
        const card = hand.current.find(c => c.props.uid === cardUid);
        if(card){
            const newHand = hand.current.filter(c => {
                return c.key !== card.key
            });
            const cardProps = card.props
            //Create a copy of the card but I don't remember why I need to do that xD
            //TODO : Why do I need to do that ? xD
            const newCard = <Card  key={cardProps.uid} uid={cardProps.uid} />
            setHand(newHand);
            setShitPile([newCard, ...shitPile.current]);
        }
        else{
            console.log("cannot be here !");
        }
    }

    return(
        <div id="game-page">
            <ShitPile 
                shitPileRef = {shitPileRef}
                cards = {shitPile.current}
            />
            <Hand
                cards = {hand.current}
                handRef = {handRef}
            />
        </div>
    )
}

/**
 * Custom useState function that will conserved the hand state into a ref
 * from : https://css-tricks.com/dealing-with-stale-props-and-states-in-reacts-functional-components
 * @param {*} value The new value associated to the state
 */
function useAsyncRef(value){
    const ref = useRef(value);
    const [, forceRender] = useState(false);

    function updateState(newState){
        ref.current = newState;
        forceRender(s => !s);
    }

    return [ref, updateState];
}
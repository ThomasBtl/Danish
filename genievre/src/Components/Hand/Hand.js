import './Hand.css';

/**
 *  Component representing the hand of a player
 *  A hand is composed of all the card that the player can use during a round
 *  The hand can be empty, if so the player will use the card disposed in his deck
 * 
 *  props :
 *      nCard -> The number of cards the player has in its hand
 */
export default function Hand(props){
    const handCards = props.cards;
    return(
        <div ref={props.handRef} className='hand'>
            {handCards}
        </div>
    )
}
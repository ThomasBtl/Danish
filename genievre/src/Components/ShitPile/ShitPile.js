import './ShitPile.css';

export default function ShitPile(props){
    const shitPileCards = props.cards;
    return(
        <div ref={props.shitPileRef} className='shit-pile'>
            {shitPileCards}
        </div>
    )
}
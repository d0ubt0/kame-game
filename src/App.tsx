import './App.css'
import { CardCollectionItem } from './components/CardCollectionItem'

function App() {

  return (
    <>
      <CardCollectionItem name='Mudora the Sword Oracle' description={`You can discard 1 other EARTH Fairy monster; Special Summon this card from your hand, then you can place 1 "Gravekeeper's Trap" from your Deck face-up in your Spell & Trap Zone. (Quick Effect): You can banish this card from your field or GY, then target up to 3 cards in any GY(s), or up to 5 if "Exchange of the Spirit" is on your field or in your GY; shuffle them into the Deck. You can only use each effect of "Mudora the Sword Oracle" once per turn.`} attack={1500} defense={1800} image='/YugiOhCardPlaceholder.jpg'></CardCollectionItem>
      <h1>
        Kame Game
      </h1>
    </>
  )
}

export default App

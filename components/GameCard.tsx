import { GameCardStruct } from '@/utils/type.dt';
import { GiBasketballBall } from 'react-icons/gi';

interface ComponentProps {
  card: GameCardStruct;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: (card: GameCardStruct) => void;
}

const GameCard: React.FC<ComponentProps> = ({ onClick, card, isSelected, isDisabled }) => {
  console.log(
    card, isSelected, isDisabled
  );
  const handleClick = () => {
    !isDisabled && onClick(card);
  };

  return (
    <div className="h-[320px]">
      {card.isFlipped ? (
        <div className="h-[320px]">
          <div
            className={`w-[200px] h-[300px] border border-blue-900 transition-all flex items-center justify-center
            duration-300 cursor-pointer hover:shadow-md hover:shadow-blue-500 rounded-lg flex-col
            ${isSelected == true? 'bg-green-500 text-white' : 'bg-[#010922] text-blue-900'}
            ${card.isFlipped && 'shadow-md shadow-blue-500 text-blue-500'}`}
            onClick={handleClick}
          >
            <img
              src={card.image}
              alt="Player Image"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex items-center justify-center w-[100%]">
            <h1 className="text-sm">{card.name}</h1>
          </div>
        </div>
      ) : (
        <div
          className={`w-[200px] h-[300px] border border-blue-900 transition-all flex items-center justify-center
          duration-300 cursor-pointer hover:shadow-md hover:shadow-blue-500 rounded-lg flex-col
          ${isSelected ? 'bg-green-500 text-white' : 'bg-[#010922] text-blue-900'}
          ${card.isFlipped && 'shadow-md shadow-blue-500 text-blue-500'}`}
          // onClick={handleClick}
        >
          <GiBasketballBall size={100} />
        </div>
      )}
    </div>
  );
};

export default GameCard;
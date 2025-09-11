import React from 'react';
interface CardItem {
    title: string;
    description: string;
    link?: string;
    image: {
        src: string;
        alt?: string;
    };
}
interface CardProps {
    cards: CardItem[];
}
declare const Card: React.FC<CardProps>;
export default Card;
//# sourceMappingURL=Card.d.ts.map
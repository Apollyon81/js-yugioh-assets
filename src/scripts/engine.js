const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.querySelector('.score_points'),
  },
  cardSprites: {
    avatar: document.getElementById('card-image'),
    name: document.getElementById('card-name'),
    type: document.getElementById('card-type'),
  },
  fieldCards: {
    player: document.getElementById('player-field-card'),
    computer: document.getElementById('computer-field-card'),
  },
  actions: {
    button: document.getElementById('next-duel'),
  },
};

const playerSides = {
  player1: 'player-cards',
  computer: 'computer-cards',
};

const pathImages = './src/assets/icons/';
const cardData = [
  {
    id: 0,
    name: 'Blue Eys White Dragon',
    type: 'Paper',
    img: `${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: 'Dark Magician',
    type: 'Rock',
    img: `${pathImages}magician.png`,
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: 'Exodia',
    type: 'Scissors',
    img: `${pathImages}exodia.png`,
    WinOf: [0],
    LoseOf: [1],
  },
];

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement('img');
  cardImage.setAttribute('height', '100px');
  cardImage.setAttribute('src', './src/assets/icons/card-back.png');
  cardImage.setAttribute('data-id', IdCard);
  cardImage.classList.add('card');

  if (fieldSide === playerSides.player1) {
    cardImage.addEventListener('mouseover', () => {
      drawSelectCard(IdCard);
    });
    cardImage.addEventListener('click', () => {
      setCardsField(cardImage.getAttribute('data-id'));
    });
  }

  return cardImage;
}

async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  state.fieldCards.player.style.display = 'block';
  state.fieldCards.computer.style.display = 'block';

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await hiddenCardDetails();
  await updateScore();
  await drawButton(duelResults);
}

async function hiddenCardDetails() {
  state.cardSprites.name.innerText = '';
  state.cardSprites.type.innerText = '';
  state.cardSprites.avatar.src = '';
}

async function drawButton(text) {
  state.actions.button.innerText = text;
  state.actions.button.style.display = 'block';
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = 'DRAW';
  let playerCard = cardData[playerCardId];

  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = 'WIN';
    state.score.playerScore++;
  }
  if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = 'LOSE';
    state.score.computerScore++;
  }
  await playAudio(duelResults);

  return duelResults;
}

async function removeAllCardsImages() {
  let cards = document.querySelector('#computer-cards');
  let imageElements = cards.querySelectorAll('img');
  imageElements.forEach((img) => img.remove());

  cards = document.querySelector('#player-cards');
  imageElements = cards.querySelectorAll('img');
  imageElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = 'Attibute :' + cardData[index].type;
}
async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = '';
  state.actions.button.style.display = 'none';

  state.fieldCards.player.style.display = 'none';
  state.fieldCards.computer.style.display = 'none';

  init();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);

  try {
    audio.play();
  } catch (error) {}
}

function init() {
  const bgm = document.getElementById('bgm');
  bgm.play();

  state.fieldCards.player.style.display = 'none';
  state.fieldCards.computer.style.display = 'none';

  drawCards(5, playerSides.player1);
  drawCards(5, playerSides.computer);
}
init();
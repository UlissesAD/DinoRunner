//personagem,background e instruções
const dino = document.querySelector('.dino');
const background = document.querySelector('.background');
const instructionsText = document.querySelector('.game-instructions');

//listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

//Variaveis do jogo
let isJumping = false;
let isGameOver = false;
let canStart = true;
let position = 0;
let isPressed = false;
let score = 0;
//Variaveis que alteram com a nivel
let level = 1;
let objSpeed = 10;
let maxSpawnTime = 6000;
//Ajustaveis para melhorar a jogabilidade caso necessário
let maxJump = 200;  //altura maxima do pulo
let minJump = 120;  //altura minima do pulo
let jumpSpeed = 17; //velocidade do salto e da queda


//detecta quando a tecla é solta
function handleKeyUp(event) {
    if (isGameOver == false && (event.keyCode === 32 || event.keyCode === 38)) {
        isPressed = true;
    }
}

//detecta o se a tecla esta para baixo
function handleKeyDown(event) {
    if (canStart == true) {
        start();
    } else if (isGameOver == false && (event.keyCode === 32 || event.keyCode === 38)) {
        if (!isJumping) {
            jumpMin();
        }
    }
}

//pulo minimo sempre que espaço ou seta para cima é pressionado.
function jumpMin() {
    isJumping = true;

    let upMin = setInterval(() => {
        if (position >= minJump) {
            jumpMax();
            clearInterval(upMin);
        } else {
            // Subindo
            position += jumpSpeed;
            dino.style.bottom = position + 'px';
        }
    }, 20);
}

//pulo caso a barra de espaço é mantida pressionada
function jumpMax() {
    let upInterval = setInterval(() => {
        if (position >= maxJump || isPressed) {
            // Descendo
            clearInterval(upInterval);

            let downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    isPressed = false;
                    isJumping = false;
                } else {
                    position -= jumpSpeed;
                    dino.style.bottom = position + 'px';
                }
            }, 20);
        } else {
            // Subindo
            position += jumpSpeed;
            dino.style.bottom = position + 'px';
        }
    }, 20);

}

//cria obstaculo
function createCactus() {
    const cactus = document.createElement('div');
    let cactusPosition = 1000;
    let randomTime = Math.random() * maxSpawnTime;

    if (isGameOver) return;

    cactus.classList.add('cactus');
    background.appendChild(cactus);
    cactus.style.left = cactusPosition + 'px';

    let leftTimer = setInterval(() => {

        if (cactusPosition < -60 || isGameOver == true) {
            // Saiu da tela
            //score++;
            score++;
            checkLevel();
            clearInterval(leftTimer);
            background.removeChild(cactus);
        } else if (cactusPosition > 0 && cactusPosition < 60 && position < 60) {
            gameOver();
        } else {
            cactusPosition -= objSpeed;
            cactus.style.left = cactusPosition + 'px';
        }
    }, 20);

    setTimeout(createCactus, randomTime);
}

//verifica se entrou no proximo nivel
function checkLevel() {
    if (score == level * 10) {
        level++;
        console.log(level)
        if (level < 50) {
            objSpeed += 0.25;
            maxSpawnTime -= 10;
        }


    }
}

//Inicia ou Re-inicia o jogo
function start() {
    canStart = false;
    isGameOver = false;
    score = 0;
    level = 1;
    objSpeed = 10;
    maxSpawnTime = 6000;
    instructionsText.style.display = 'none';
    background.classList.remove("background");
    background.classList.add("background_run");
    createCactus();
}

//para o fundo e mostra potuação
function gameOver() {
    isGameOver = true;
    setTimeout(() => { canStart = true }, 2000);
    background.classList.add("background");
    background.classList.remove("background_run");
    instructionsText.innerHTML = `Fim de jogo - Pontuação: ${score} Nível: ${level}`;
    instructionsText.style.display = 'flex';
}


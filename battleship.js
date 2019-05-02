const view = {
    displayMessage: function(msg) {
        const messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },
    displayHit: function(location) {
        const cell = document.getElementById(location);
        cell.setAttribute('class', 'hit');
        this.displayMessage('HIT!');
    },
    displayMiss: function(location) {
        const cell = document.getElementById(location);
        cell.setAttribute('class', 'miss');
        this.displayMessage('You missed.');
    },
};

const ships = [
    {
        locations: [0, 0, 0],
        hits: ['', '', ''],
    },
    {
        locations: [0, 0, 0],
        hits: ['', '', ''],
    },
    {
        locations: [0, 0, 0],
        hits: ['', '', ''],
    },
];

const model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: ships,
    fire: function(guess) {
        for (let i = 0; i < ships.length; i++) {
            const ship = ships[i];
            const index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                if (this.isSunk(ship)) {
                    view.displayMessage('You sank my battleship!');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        return false;
    },
    isSunk: function(ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        }
        return true;
    },
    generateShipLocations: function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShip: function() {
        const direction = Math.floor(Math.random() * 2);
        let row;
        let col;
        if (direction === 1) {
            // Generate ship start location for horizontal ones
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else {
            // Generate ship start location for vertical ones
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }

        const newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + '' + (col + i));
            } else {
                newShipLocations.push((row + i) + '' + col);
            }
        }
        return newShipLocations;
    },
    collision: function(locations) {
        for (let i = 0; i < this.numShips; i++) {
            const ship = this.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};

const controller = {
    guesses: 0,
    processGuesses: function(guess) {
        const location = this.parseGuess(guess);
        if (location) {
            this.guesses++;
            const hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage('You sank all my battleships, in ' + this.guesses + ' guesses.');
            }
        }
    },
    parseGuess: function(guess) {
        const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

        if (guess === null || guess.length !== 2) {
            alert('Oops, please enter a letter and a number on the board');
        } else {
            const firstChar = guess.charAt(0);
            const row = alphabet.indexOf(firstChar);
            const column = guess.charAt(1);

            if (isNaN(row) || isNaN(column)) {
                alert('Oops, that isn\'t on the board');
            } else if (row < 0 || row >= model.boardSize ||
                       column < 0 || column >= model.boardSize) {
                alert('Oops, that\'s off the board!');
            } else {
                return row + column;
            }
        }
        return null;
    },
};

/**
 * Initialize view elements.
 */
function init() {
    const fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    const guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocations();
}

/**
 * Handle fire button click.
 */
function handleFireButton() {
    const guessInput = document.getElementById('guessInput');
    const guess = guessInput.value;
    controller.processGuesses(guess);
    guessInput.value = '';
}

/**
 * Handle enter key press in guessInput.
 *
 * @param {Event} e Event object
 * @return {Boolean} Boolean flag
 */
function handleKeyPress(e) {
    const fireButton = document.getElementById('fireButton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init;

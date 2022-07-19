class State {
    static posibleTiles = {
        NOTHING: 'nothing',
        COIN: 'coin',
        BIG_COIN: 'big_coin',
        ENEMY: 'enemy',
        WALL: 'wall'
    }
    UP = State.posibleTiles.NOTHING;
    RIGHT = State.posibleTiles.NOTHING;
    DOWN = State.posibleTiles.NOTHING;
    LEFT = State.posibleTiles.NOTHING;

    TWO_UP = State.posibleTiles.NOTHING;
    TWO_RIGHT = State.posibleTiles.NOTHING;
    TWO_DOWN = State.posibleTiles.NOTHING;
    TWO_LEFT = State.posibleTiles.NOTHING;

    toString() {
        return `${this.UP},${this.RIGHT},${this.DOWN},${this.LEFT}`;
    }

    toString_two() {
        return `${this.UP},${this.TWO_UP},${this.RIGHT},${this.TWO_RIGHT},${this.DOWN},${this.TWO_DOWN},${this.LEFT},${this.TWO_LEFT}`;
    }

}

class ActionEvent {
    static NONE = 'none';
    static COIN = 'coin';
    static BIG_COIN = 'big_coin';
    static KILLED_BY_ENEMY = 'killed_by_enemy';
    static WALL = 'wall';
    static WON = 'won';
}

class Game {
    constructor() {
        this.view = {
            width: 950,
            height: 600,
            // backgroundColor: this.view.p.color(64, 62, 222),
            tileSize: 50,
            canvas: null,
            p: null,
            running: false,
            hovered: false,
            offsetY: Math.floor(this.height / 2),
            enableKeypress: false
        }
        this.environment = {
            startingMap: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 3, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 3, 1, 1],
                [1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
                [1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
                [1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1],
                [1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1],
                [1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
                [1, 1, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
            startingMap_small: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
                [1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1],
                [1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1],
                [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
                [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
                [1, 1, 1, 3, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 3, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
            map: []
        }
        this.player = {
            position: { x: 9, y: 5 },
            actions: {
                UP: 'up',
                DOWN: 'down',
                LEFT: 'left',
                RIGHT: 'right',
                NOTHING: 'nothing'
            }
        }
        this.game = {
            enemiesDefault: [
                { position: { x: 6, y: 3 }, direction: this.player.actions.LEFT, lastTile: 0 },
                // { position: { x: 8, y: 5 }, direction: this.player.actions.LEFT, lastTile: 0 },
                { position: { x: 12, y: 3 }, direction: this.player.actions.LEFT, lastTile: 0 },
                { position: { x: 4, y: 7 }, direction: this.player.actions.DOWN, lastTile: 0 },
                { position: { x: 14, y: 7 }, direction: this.player.actions.RIGHT, lastTile: 0 },
            ],
            enemies: [],
            movementSpeed: 1,
            score: 0
        }

        this.Q_TABLE = {};
        this.discountFactor = 0.7;
        this.alpha = 0.5;
        this.exploration = 0.2;

        this.currentGameState;

        this.bestScore = 0;

        this.init();
    }
    init() {
        this.player.position = { x: 9, y: 5 };

        // this.environment.map = JSON.parse(JSON.stringify(this.environment.startingMap));
        this.environment.map = JSON.parse(JSON.stringify(this.environment.startingMap_small));

        this.game.enemies = JSON.parse(JSON.stringify(this.game.enemiesDefault));

        this.environment.map[this.player.position.y][this.player.position.x] = 2;
        this.game.enemies.forEach(enemy => {
            this.environment.map[enemy.position.y][enemy.position.x] = 4;
        });

        if (this.game.score > this.bestScore) this.bestScore = this.game.score;
        console.log(`Score: ${this.game.score}, Best: ${this.bestScore}`);
        this.game.score = 0;
    }
    start() {
        this.view.p.loop();
    }
    stop() {
        this.view.p.noLoop();
    }

    sketch = p => {
        p.setup = () => {
            p.frameRate(10);
            this.view.canvas = p.createCanvas(this.view.width, this.view.height);
            this.view.p = p;
            // p.background(this.view.backgroundColor);
            p.background(109, 108, 235);
        }
        p.draw = () => {
            // console.log(this.environment.map)
            // p.background(this.view.backgroundColor);
            p.background(109, 108, 235);

            if (p.frameCount % 10 == 0) {
                // console.log(this.getPossibleActions(this.player.position))
                this.updateEnemyMovement();
            }

            this.currentGameState = this.getCurrentState();
            // // console.log(Object.keys(this.Q_TABLE).length);
            let action = this.pickAction(this.currentGameState);
            let [newGameState, actionEvent] = this.getNextGameState(this.currentGameState, action);
            let reward = this.calculateRewardFromAction(actionEvent);
            // console.log(`${actionEvent}: ${reward}`)
            if (!this.Q_TABLE.hasOwnProperty(this.currentGameState.toString())) {
                this.Q_TABLE[this.currentGameState.toString()] = {
                    up: 0.0,
                    right: 0.0,
                    down: 0.0,
                    left: 0.0,
                    nothing: 0.0
                }
            }
            // console.log(`${this.currentGameState} -> ${action} -> ${newGameState}`)
            this.Q_TABLE[this.currentGameState.toString()][action] = this.Q_TABLE[this.currentGameState.toString()][action] + this.alpha *
                (reward + this.discountFactor * this.computeMaxQValue(newGameState) - this.Q_TABLE[this.currentGameState.toString()][action]);

            this.currentGameState = newGameState;

            this.drawEnvironment();
        }
        p.keyPressed = () => {
            if (!this.view.enableKeypress) return;
            let action = this.player.actions.NOTHING;
            this.currentGameState = this.getCurrentState();

            if (p.keyCode === p.LEFT_ARROW) {
                if (this.isValidDirection(this.player.position, this.player.actions.LEFT)) {
                    this.movePlayer(this.player.actions.LEFT);
                }
                action = this.player.actions.LEFT;
            }
            else if (p.keyCode === p.RIGHT_ARROW) {
                if (this.isValidDirection(this.player.position, this.player.actions.RIGHT)) {
                    this.movePlayer(this.player.actions.RIGHT);
                }
                action = this.player.actions.RIGHT;
            }
            else if (p.keyCode === p.UP_ARROW) {
                if (this.isValidDirection(this.player.position, this.player.actions.UP)) {
                    this.movePlayer(this.player.actions.UP);
                }
                action = this.player.actions.UP;
            }
            else if (p.keyCode === p.DOWN_ARROW) {
                if (this.isValidDirection(this.player.position, this.player.actions.DOWN)) {
                    this.movePlayer(this.player.actions.DOWN);
                }
                action = this.player.actions.DOWN;
            }

            // // console.log(Object.keys(this.Q_TABLE).length);
            // let action = this.pickAction(this.currentGameState);
            let [newGameState, actionEvent] = this.getNextGameState(this.currentGameState, action);
            let reward = this.calculateRewardFromAction(actionEvent);
            console.log(`${actionEvent}: ${reward}`)
            if (!this.Q_TABLE.hasOwnProperty(this.currentGameState.toString())) {
                this.Q_TABLE[this.currentGameState.toString()] = {
                    up: 0.0,
                    right: 0.0,
                    down: 0.0,
                    left: 0.0,
                    nothing: 0.0
                }
            }
            console.log(`${this.currentGameState} -> ${action} -> ${newGameState}`)
            console.log(this.environment.map)
            this.Q_TABLE[this.currentGameState.toString()][action] = this.Q_TABLE[this.currentGameState.toString()][action] + this.alpha *
                (reward + this.discountFactor * this.computeMaxQValue(newGameState) - this.Q_TABLE[this.currentGameState.toString()][action]);

            this.currentGameState = newGameState;
        }
    }
    drawEnvironment() {
        this.view.p.rectMode(this.view.p.CENTER);
        for (let i = 0; i < this.environment.map.length; ++i) {
            for (let j = 0; j < this.environment.map[i].length; ++j) {
                let xPos = j * this.view.tileSize + this.view.tileSize / 2;
                let yPos = i * this.view.tileSize + this.view.tileSize / 2;
                switch (this.environment.map[i][j]) {
                    case 0: {
                        this.view.p.fill('yellow');
                        // this.view.p.rect(xPos, yPos, this.view.tileSize, this.view.tileSize);
                        this.view.p.ellipse(xPos, yPos, this.view.tileSize / 5);
                        break;
                    }
                    case 1: {
                        this.view.p.fill(50, 49, 158);

                        this.view.p.rect(xPos, yPos, this.view.tileSize, this.view.tileSize);
                        break;
                    }
                    case 2: {
                        this.view.p.ellipseMode(this.view.p.CENTER);
                        this.view.p.fill('green');
                        this.view.p.ellipse(xPos, yPos, this.view.tileSize * 4 / 5);
                        break;
                    }
                    case 3: {
                        this.view.p.ellipseMode(this.view.p.CENTER);
                        this.view.p.fill('yellow');
                        this.view.p.ellipse(xPos, yPos, this.view.tileSize / 2);
                        break;
                    }
                    case 4: {
                        this.view.p.ellipseMode(this.view.p.CENTER);
                        this.view.p.fill('red');
                        this.view.p.ellipse(xPos, yPos, this.view.tileSize * 4 / 5);
                        break;
                    }
                }
            }
        }
    }

    isValidDirection(position, direction, enemy = false) {
        switch (direction) {
            case this.player.actions.LEFT: {
                return this.environment.map[position.y][position.x - this.game.movementSpeed] != 1 &&
                    (this.environment.map[position.y][position.x - this.game.movementSpeed] != 4 || !enemy);
            }
            case this.player.actions.RIGHT: {
                return this.environment.map[position.y][position.x + this.game.movementSpeed] != 1 &&
                    (this.environment.map[position.y][position.x + this.game.movementSpeed] != 4 || !enemy);
            }
            case this.player.actions.UP: {
                return this.environment.map[position.y - this.game.movementSpeed][position.x] != 1 &&
                    (this.environment.map[position.y - this.game.movementSpeed][position.x] != 4 || !enemy);
            }
            case this.player.actions.DOWN: {
                return this.environment.map[position.y + this.game.movementSpeed][position.x] != 1 &&
                    (this.environment.map[position.y + this.game.movementSpeed][position.x] != 4 || !enemy);
            }
        }
    }

    movePlayer(direction) {
        let newX = this.player.position.x;
        let newY = this.player.position.y;

        switch (direction) {
            case this.player.actions.LEFT: {
                newX -= this.game.movementSpeed;
                break;
            }
            case this.player.actions.RIGHT: {
                newX += this.game.movementSpeed;
                break;
            }
            case this.player.actions.UP: {
                newY -= this.game.movementSpeed;
                break;
            }
            case this.player.actions.DOWN: {
                newY += this.game.movementSpeed;
                break;
            }
        }
        this.environment.map[this.player.position.y][this.player.position.x] = 9;
        // TODO: ACTION FOR REWARD
        switch (this.environment.map[newY][newX]) {
            case 0: {
                this.game.score += 1;
                break;
            }
            case 3: {
                this.game.score += 10;
                break;
            }
            case 4: {
                this.init();
                return;
            }
        }
        this.environment.map[newY][newX] = 2;
        this.player.position = {
            x: newX,
            y: newY
        }
    }

    getPossibleActions(position, enemy = false) {
        return Object.values(this.player.actions).filter(dir => this.isValidDirection(position, dir, enemy));
    }
    geAllActions() {
        return Object.values(this.player.actions);
    }

    updateEnemyMovement() {
        // TODO: same row as player agro
        for (let i = 0; i < this.game.enemies.length; ++i) {
            let enemy = this.game.enemies[i];

            let newX = enemy.position.x;
            let newY = enemy.position.y;
            let direction

            if (this.isValidDirection(enemy.position, enemy.direction, true) && this.getPossibleActions(enemy.position, true).length <= 2) {
                direction = enemy.direction;
            }
            else {
                let posibleActions = this.getPossibleActions(enemy.position, true);
                direction = posibleActions[Math.floor(Math.random() * posibleActions.length)];
                enemy.direction = direction;
            }

            this.environment.map[newY][newX] = enemy.lastTile;
            switch (direction) {
                case this.player.actions.LEFT: {
                    newX -= this.game.movementSpeed;
                    break;
                }
                case this.player.actions.RIGHT: {
                    newX += this.game.movementSpeed;
                    break;
                }
                case this.player.actions.UP: {
                    newY -= this.game.movementSpeed;
                    break;
                }
                case this.player.actions.DOWN: {
                    newY += this.game.movementSpeed;
                    break;
                }
            }
            if (this.player.position.x == newX && this.player.position.y == newY) {
                this.init();
                return;
            }
            enemy.position = {
                x: newX,
                y: newY
            }
            enemy.lastTile = this.environment.map[newY][newX];
            this.environment.map[newY][newX] = 4;
        }
    }

    getTileStateFromPosition(position) {
        if (position.x > 18 || position.x < 0) return State.posibleTiles.WALL;
        if (position.y > 11 || position.y < 0) return State.posibleTiles.WALL;
        let tile = this.environment.map[position.y][position.x];
        switch (tile) {
            case 0: return State.posibleTiles.COIN;
            case 1: return State.posibleTiles.WALL;
            case 3: return State.posibleTiles.BIG_COIN;
            case 4: return State.posibleTiles.ENEMY;
            case 9: return State.posibleTiles.NOTHING;
            default: State.posibleTiles.WALL;
        }
    }

    getCurrentState() {
        let state = new State();
        state.UP = this.getTileStateFromPosition({
            x: this.player.position.x,
            y: this.player.position.y - 1
        });
        state.RIGHT = this.getTileStateFromPosition({
            x: this.player.position.x + 1,
            y: this.player.position.y
        });
        state.DOWN = this.getTileStateFromPosition({
            x: this.player.position.x,
            y: this.player.position.y + 1
        });
        state.LEFT = this.getTileStateFromPosition({
            x: this.player.position.x - 1,
            y: this.player.position.y
        });

        // state.TWO_UP = this.getTileStateFromPosition({
        //     x: this.player.position.x,
        //     y: this.player.position.y - 2
        // });
        // state.TWO_RIGHT = this.getTileStateFromPosition({
        //     x: this.player.position.x + 2,
        //     y: this.player.position.y
        // });
        // state.TWO_DOWN = this.getTileStateFromPosition({
        //     x: this.player.position.x,
        //     y: this.player.position.y + 2
        // });
        // state.TWO_LEFT = this.getTileStateFromPosition({
        //     x: this.player.position.x - 2,
        //     y: this.player.position.y
        // });
        return state;
    }

    // Q-LEARNING

    calculateRewardFromAction(actionEvent) {
        switch (actionEvent) {
            case ActionEvent.NONE: {
                return -1.0;
            }
            case ActionEvent.COIN: {
                return 2.0;
            }
            case ActionEvent.BIG_COIN: {
                return 4.0;
            }
            case ActionEvent.KILLED_BY_ENEMY: {
                return -50.0;
            }
            case ActionEvent.WALL: {
                return -2.0;
            }
            case ActionEvent.WON: {
                return 10.0;
            }
        }
    }

    computeMaxQValue(state) {
        if (!this.Q_TABLE.hasOwnProperty(state.toString())) {
            this.Q_TABLE[state.toString()] = {
                up: 0.0,
                right: 0.0,
                down: 0.0,
                left: 0.0,
                nothing: 0.0
            }
        }
        return Math.max(...Object.values(this.Q_TABLE[state.toString()]));
    }

    pickAction(state) {
        if (this.exploration > Math.random()) {
            let posibleActions = this.geAllActions();
            return posibleActions[Math.floor(Math.random() * posibleActions.length)];
        }
        else {
            if (!this.Q_TABLE.hasOwnProperty(state.toString())) {
                this.Q_TABLE[state.toString()] = {
                    up: 0.0,
                    right: 0.0,
                    down: 0.0,
                    left: 0.0,
                    nothing: 0.0
                }
            }
            let maxVal = Math.max(...Object.values(this.Q_TABLE[state.toString()]));
            let actions = [];
            for (const [key, value] of Object.entries(this.Q_TABLE[state.toString()])) {
                if (maxVal == value) actions.push(key);
            }
            return actions[Math.floor(Math.random() * actions.length)];
        }
    }
    getActioneventFromCurrentState(currentStateTile) {
        switch (currentStateTile) {
            case State.posibleTiles.NOTHING: {
                return ActionEvent.NONE;
            }
            case State.posibleTiles.COIN: {
                return ActionEvent.COIN;
            }
            case State.posibleTiles.BIG_COIN: {
                return ActionEvent.BIG_COIN;
            }
            case State.posibleTiles.ENEMY: {
                return ActionEvent.KILLED_BY_ENEMY;
            }
            case State.posibleTiles.WALL: {
                return ActionEvent.WALL;
            }
        }
    }

    getNextGameState(currentState, action) {
        let actionEvent = ActionEvent.NONE;
        switch (action) {
            case this.player.actions.UP: {
                actionEvent = this.getActioneventFromCurrentState(currentState.UP);
                break;
            }
            case this.player.actions.DOWN: {
                actionEvent = this.getActioneventFromCurrentState(currentState.DOWN);
                break;
            }
            case this.player.actions.LEFT: {
                actionEvent = this.getActioneventFromCurrentState(currentState.LEFT);
                break;
            }
            case this.player.actions.RIGHT: {
                actionEvent = this.getActioneventFromCurrentState(currentState.RIGHT);
                break;
            }
        }
        if (this.isValidDirection(this.player.position, action)) {
            this.movePlayer(action);
        }
        return [this.getCurrentState(), actionEvent];
    }
}

let QLearning_inst = new Game();
new p5(QLearning_inst.sketch, 'reinforcement_canvas');

let q_table_save = document.getElementById('q_table_save');
let q_table_load = document.getElementById('load_q_table');

q_table_save.addEventListener("click", e => {
    var data = QLearning_inst.Q_TABLE;
    var json = JSON.stringify(data);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    q_table_save.download = "asd.json";
    q_table_save.href = url

});

q_table_load.addEventListener("click", e => {
    QLearning_inst.Q_TABLE = JSON.parse(data_exp0);
    QLearning_inst.exploration = 0;
    console.log(`File loaded`)
});

let data_exp20 = `{
    "wall,coin,wall,coin": {
        "up": 4.52191805462141,
        "right": 8.414133234576893,
        "down": 4.584722444942109,
        "left": 7.801157526879638,
        "nothing": 5.510551709646789
    },
    "coin,coin,wall,nothing": {
        "up": 6.057484493354938,
        "right": 8.161135778471275,
        "down": 4.058136669543031,
        "left": 3.760427978052108,
        "nothing": 5.159491112643288
    },
    "coin,wall,nothing,wall": {
        "up": 6.626849808595116,
        "right": 3.286623508849479,
        "down": -2.07067713786529,
        "left": 2.698440532807661,
        "nothing": 2.9502341644768686
    },
    "nothing,coin,wall,nothing": {
        "up": -0.3157527965642313,
        "right": 0.6310763265831066,
        "down": -0.0008700365492400053,
        "left": -0.22735074421480866,
        "nothing": 0.01465455174564917
    },
    "wall,nothing,wall,coin": {
        "up": 3.2006424836718974,
        "right": -0.9029080150667507,
        "down": 3.571467772985401,
        "left": 6.455925063509694,
        "nothing": 4.392970238212439
    },
    "coin,nothing,wall,coin": {
        "up": 6.6782940988554165,
        "right": -1.9738391893600216,
        "down": 3.612316181242958,
        "left": 7.154305209706719,
        "nothing": 4.831008088245296
    },
    "wall,nothing,wall,nothing": {
        "up": -4.172002746348246,
        "right": -3.3418649242159884,
        "down": -4.0690195978528605,
        "left": -3.3673590996966216,
        "nothing": -3.4526131187460787
    },
    "wall,enemy,nothing,wall": {
        "up": -4.537323760401143,
        "right": -39.559742205736015,
        "down": -3.4181530710654138,
        "left": -4.498866335738578,
        "nothing": -3.9586362490512226
    },
    "wall,coin,nothing,wall": {
        "up": 0.5842125238319918,
        "right": 7.412728983700722,
        "down": -3.4362601428416673,
        "left": -0.02140961800423269,
        "nothing": -0.6137374095792049
    },
    "nothing,wall,nothing,wall": {
        "up": -3.8666864256432913,
        "right": -4.473085656242158,
        "down": -3.798590523518207,
        "left": -4.411867951013702,
        "nothing": -3.831284876850799
    },
    "wall,coin,coin,nothing": {
        "up": 4.103582822995842,
        "right": 7.697375264003645,
        "down": 4.803257671157972,
        "left": -1.4896518604198201,
        "nothing": 5.077022954346467
    },
    "wall,coin,wall,nothing": {
        "up": 3.8492577781879067,
        "right": 7.137417687618937,
        "down": 3.797081477783008,
        "left": -0.2833280249471257,
        "nothing": 4.528950065312062
    },
    "wall,nothing,coin,nothing": {
        "up": -0.3868696083354642,
        "right": -1.6571596639079185,
        "down": 1.8765823397882149,
        "left": -1.102857479755843,
        "nothing": 0.31548898303337714
    },
    "nothing,wall,coin,wall": {
        "up": -2.7372423609138568,
        "right": 4.252793404138272,
        "down": 4.911118364646402,
        "left": 3.60558705432694,
        "nothing": 4.144031165517461
    },
    "wall,nothing,nothing,nothing": {
        "up": -3.9125598407958426,
        "right": -3.2394501352378717,
        "down": -3.2086089846082624,
        "left": 0.07473746406356241,
        "nothing": -3.546218948239122
    },
    "coin,wall,coin,nothing": {
        "up": 6.404819221568517,
        "right": 4.004721051979649,
        "down": 7.624627366351989,
        "left": -2.790229156504121,
        "nothing": 5.072493197482403
    },
    "wall,coin,nothing,coin": {
        "up": 2.785598030410763,
        "right": 4.8152689014474275,
        "down": -2.9885399538112005,
        "left": 3.0218888356175846,
        "nothing": 2.9669745543890227
    },
    "wall,wall,coin,nothing": {
        "up": 2.3455481968143506,
        "right": 2.0233997144342446,
        "down": 5.407627547392303,
        "left": -2.872120560514307,
        "nothing": 3.2033978536203542
    },
    "wall,nothing,nothing,coin": {
        "up": 2.869730051534365,
        "right": -1.8363875962396372,
        "down": -1.8501541647392976,
        "left": 6.772364443829298,
        "nothing": 2.7717894364934597
    },
    "wall,nothing,nothing,enemy": {
        "up": -4.446673047157778,
        "right": -2.7040292833966237,
        "down": -3.860728909662708,
        "left": -41.3013839576375,
        "nothing": -3.9045422214951326
    },
    "nothing,wall,big_coin,coin": {
        "up": -0.9139791710726488,
        "right": 0,
        "down": 0,
        "left": 2.096376743738472,
        "nothing": -0.2
    },
    "wall,nothing,wall,enemy": {
        "up": -4.122587711972111,
        "right": -3.351474345757159,
        "down": -3.771356602320005,
        "left": -43.41980579979416,
        "nothing": -3.596640766205142
    },
    "nothing,wall,enemy,wall": {
        "up": -3.596497743330169,
        "right": -4.761580532411584,
        "down": -43.52568810922571,
        "left": -4.644107368886201,
        "nothing": -3.694324125789612
    },
    "nothing,wall,enemy,coin": {
        "up": -1.6924411519902327,
        "right": 2.303678932843148,
        "down": -29.385004189960448,
        "left": 6.602586810775404,
        "nothing": 2.366705461349631
    },
    "coin,nothing,coin,wall": {
        "up": 5.602021452563548,
        "right": 0.4295959886051626,
        "down": 7.304953569304038,
        "left": 3.2800849813179904,
        "nothing": 4.563783858281626
    },
    "nothing,nothing,coin,wall": {
        "up": -1.1883980976124022,
        "right": -1.3692223083280883,
        "down": 3.2084070693973246,
        "left": 1.5605423284407507,
        "nothing": 2.006033560445104
    },
    "wall,enemy,wall,nothing": {
        "up": -4.480955768759358,
        "right": -43.57482104502875,
        "down": -4.184357222377417,
        "left": -3.1859638804101187,
        "nothing": -3.6561064984387377
    },
    "nothing,wall,wall,coin": {
        "up": -0.7839483796477572,
        "right": 3.547838491903661,
        "down": 3.6393612996211244,
        "left": 6.655914013770323,
        "nothing": 4.116297821936184
    },
    "nothing,nothing,nothing,wall": {
        "up": -3.3968351339770764,
        "right": -3.4023723809098216,
        "down": -3.391338464554636,
        "left": -4.280795047539654,
        "nothing": -3.672857844377817
    },
    "nothing,nothing,wall,nothing": {
        "up": -3.203570056156445,
        "right": -3.4816274261326683,
        "down": -3.708737536038671,
        "left": -3.339064715046242,
        "nothing": -3.347230915274022
    },
    "wall,wall,nothing,coin": {
        "up": 0.6241954260341758,
        "right": 1.6178137737634042,
        "down": -3.0262719118047197,
        "left": 6.5615162123217825,
        "nothing": 2.96682121016302
    },
    "wall,nothing,nothing,wall": {
        "up": -4.442656566969542,
        "right": -3.4145524665258415,
        "down": -3.308066279386197,
        "left": -4.510318802125998,
        "nothing": -3.584330009724756
    },
    "nothing,wall,coin,nothing": {
        "up": -0.5539504375025466,
        "right": 0.6307045288214095,
        "down": 5.429402727100456,
        "left": -1.5840521441706044,
        "nothing": 1.8137148916282197
    },
    "nothing,coin,coin,wall": {
        "up": -2.8784949470401546,
        "right": 1.5254725202073363,
        "down": 7.434075218714812,
        "left": 2.8365779636353334,
        "nothing": 4.015109042941579
    },
    "coin,wall,nothing,coin": {
        "up": 1.7378219841690685,
        "right": 2.75611432555511,
        "down": 3.016977948266635,
        "left": 5.8285235923657845,
        "nothing": 3.9477398874281455
    },
    "nothing,wall,nothing,coin": {
        "up": -1.9080672462845991,
        "right": -0.1728120286161713,
        "down": 0.4504226355321932,
        "left": 5.625654519378439,
        "nothing": 0.45159256768770895
    },
    "nothing,nothing,wall,coin": {
        "up": -2.052340869645021,
        "right": -0.7893757645024766,
        "down": -0.4,
        "left": 7.766514179861968,
        "nothing": 2.5753979137302974
    },
    "nothing,wall,wall,nothing": {
        "up": -3.308138672650353,
        "right": -4.261700403928618,
        "down": -4.696830672048239,
        "left": -3.326151696149183,
        "nothing": -3.5425141079075106
    },
    "nothing,coin,nothing,wall": {
        "up": -1.6207635554096722,
        "right": 1.582358386617412,
        "down": 0.1351828850891187,
        "left": 0.3044575278659263,
        "nothing": 0.29767779487676915
    },
    "coin,wall,big_coin,nothing": {
        "up": 0.7880510352112545,
        "right": -0.47903439534891007,
        "down": 1.3983490954063595,
        "left": -0.7432601638526808,
        "nothing": -0.06843839529338813
    },
    "nothing,wall,wall,wall": {
        "up": -3.5422364442860195,
        "right": -4.5532952524015435,
        "down": -4.737442080304998,
        "left": -4.761843460883741,
        "nothing": -3.7404310020508156
    },
    "coin,wall,nothing,nothing": {
        "up": 0.6488959931482551,
        "right": -0.14227039134881064,
        "down": -1.8927349532609232,
        "left": 1.3863837209884484,
        "nothing": 0.2950802422114266
    },
    "enemy,wall,nothing,wall": {
        "up": -43.351616404164496,
        "right": -4.278315175510852,
        "down": -3.0896134212709634,
        "left": -4.560014228410765,
        "nothing": -3.827239675842701
    },
    "wall,nothing,coin,coin": {
        "up": 3.712769702779676,
        "right": -1.194721128199773,
        "down": 3.4703819331084134,
        "left": 6.855253993705908,
        "nothing": 4.531525286367126
    },
    "coin,nothing,wall,nothing": {
        "up": 6.142201570835166,
        "right": -2.5657501521119004,
        "down": 1.696903994080613,
        "left": 1.3242329039433178,
        "nothing": 2.8388819164545698
    },
    "wall,wall,nothing,nothing": {
        "up": -4.5360423585206,
        "right": -4.942799726916923,
        "down": -3.73734647528542,
        "left": -3.5709211770897658,
        "nothing": -3.8736535525244262
    },
    "enemy,nothing,wall,nothing": {
        "up": -32.275008958389705,
        "right": -3.0733568722143896,
        "down": -3.447362916075197,
        "left": -2.5407365530172634,
        "nothing": -3.3429988664436174
    },
    "wall,enemy,nothing,coin": {
        "up": 1.1485515834167286,
        "right": -16.31643295864361,
        "down": -1.0546708546980024,
        "left": 6.616215608804511,
        "nothing": 0.762749977448693
    },
    "wall,nothing,coin,wall": {
        "up": 0.8289611837437928,
        "right": -1.783347271280835,
        "down": 3.3535733271015364,
        "left": 0.7413351829587458,
        "nothing": 1.8781776842146267
    },
    "nothing,wall,coin,coin": {
        "up": -3.151528662252876,
        "right": 2.6139282655345433,
        "down": 5.824891742632025,
        "left": 3.3373426003603868,
        "nothing": 2.92258633452135
    },
    "nothing,coin,wall,coin": {
        "up": 1.808393173726653,
        "right": 0.7128144699168841,
        "down": 2.8717707717678556,
        "left": 6.495856867229161,
        "nothing": 3.9794176178439793
    },
    "coin,nothing,wall,wall": {
        "up": 6.260902445493877,
        "right": -1.3760665081306893,
        "down": 3.776787255372434,
        "left": 3.730145021743521,
        "nothing": 4.18347051109958
    },
    "coin,wall,wall,nothing": {
        "up": 6.1378498894446105,
        "right": 2.729745460714316,
        "down": 2.522551760943353,
        "left": 0.6929029573981573,
        "nothing": 2.2257981595958416
    },
    "coin,coin,nothing,wall": {
        "up": 2.1397202239503113,
        "right": 7.0258177822733465,
        "down": -1.7427631494003104,
        "left": 2.272224140290059,
        "nothing": -0.07978861624568566
    },
    "nothing,wall,big_coin,enemy": {
        "up": -1.340290069351402,
        "right": -0.7321141226535157,
        "down": 1.0315983385771856,
        "left": -32.27217844426049,
        "nothing": 0.1507903605713842
    },
    "nothing,wall,nothing,enemy": {
        "up": -3.57605298359541,
        "right": -4.698162015685443,
        "down": -3.6429830182089202,
        "left": -43.328371472255526,
        "nothing": -3.8245470974229314
    },
    "nothing,wall,nothing,nothing": {
        "up": -3.405578794590705,
        "right": -4.251822115435473,
        "down": -3.345104166603357,
        "left": -3.39511727320107,
        "nothing": -3.397711615481884
    },
    "coin,nothing,enemy,wall": {
        "up": 4.644565862273616,
        "right": -0.6524416396118395,
        "down": -15.636162391091432,
        "left": 0.4440042343362983,
        "nothing": 1.6920263888672906
    },
    "nothing,nothing,enemy,wall": {
        "up": -3.586834569155127,
        "right": -3.154567021608175,
        "down": -37.979375714623245,
        "left": -3.681393106608909,
        "nothing": -3.553886904663335
    },
    "coin,enemy,wall,nothing": {
        "up": 4.427911987472155,
        "right": -8.691011744913622,
        "down": -0.4,
        "left": -0.43349128909095447,
        "nothing": -0.25749926321040867
    },
    "nothing,enemy,coin,wall": {
        "up": -2.944656410689725,
        "right": -29.5400894191445,
        "down": 7.408384313997107,
        "left": 1.5829842330285937,
        "nothing": 1.612630500895544
    },
    "wall,nothing,coin,enemy": {
        "up": 0.4791784997481553,
        "right": -1.9520116892046324,
        "down": 2.915051888951831,
        "left": -21.556763034433423,
        "nothing": 1.1781067578348712
    },
    "nothing,coin,wall,wall": {
        "up": -0.4592281435484189,
        "right": 7.494781769728805,
        "down": 1.8120032362830343,
        "left": 2.2624981564520334,
        "nothing": 3.2050411272224735
    },
    "coin,nothing,big_coin,wall": {
        "up": 5.74362110202076,
        "right": -2.5697343200601863,
        "down": 1.519831917272525,
        "left": 1.6112573183253673,
        "nothing": 2.456203986152802
    },
    "coin,nothing,nothing,wall": {
        "up": 2.90244123230321,
        "right": -2.211820715201203,
        "down": -1.7486335747670663,
        "left": -0.15076503386839335,
        "nothing": 1.480064410987889
    },
    "nothing,coin,big_coin,wall": {
        "up": -1.597062512589217,
        "right": 4.434430951946066,
        "down": 1.336868231759604,
        "left": -0.37377831277041274,
        "nothing": 0.046484107998693014
    },
    "nothing,enemy,nothing,wall": {
        "up": -3.665019942528304,
        "right": -36.461133765069455,
        "down": -3.8414468615231216,
        "left": -4.596003527913653,
        "nothing": -3.9972230046978066
    },
    "nothing,coin,enemy,wall": {
        "up": -0.2730420680256139,
        "right": 5.647503207152259,
        "down": -9.208298437240547,
        "left": -0.18571466756082675,
        "nothing": 0.6038071196814754
    },
    "wall,coin,nothing,enemy": {
        "up": 1.2152376210252762,
        "right": 7.147972194784348,
        "down": -2.8979194062368627,
        "left": -36.27919857036396,
        "nothing": 4.259880717222322
    },
    "wall,nothing,enemy,wall": {
        "up": -4.696150956185927,
        "right": -3.4975233792047673,
        "down": -42.42928305523453,
        "left": -4.360105196420101,
        "nothing": -4.063331157065955
    },
    "wall,coin,nothing,nothing": {
        "up": 1.6248308017236615,
        "right": 5.262139952699469,
        "down": -1.5295643628950866,
        "left": 0.7082468908013992,
        "nothing": 1.3440611187360951
    },
    "enemy,nothing,big_coin,wall": {
        "up": -21.498485659419565,
        "right": -1.2665901946026117,
        "down": 1.2918943614351013,
        "left": -0.6984626517337844,
        "nothing": -0.3021971652075693
    },
    "nothing,nothing,big_coin,wall": {
        "up": -0.15973241793189585,
        "right": -1.9402489662695008,
        "down": 1.361602913907113,
        "left": -0.22001139465881017,
        "nothing": -0.035345638140280564
    },
    "nothing,nothing,wall,wall": {
        "up": -3.3530950660716945,
        "right": -3.2991972363314668,
        "down": -4.10804436620507,
        "left": -3.5149059337352044,
        "nothing": -3.447046947515415
    },
    "coin,wall,nothing,enemy": {
        "up": 6.534088727694138,
        "right": 0,
        "down": 0,
        "left": -21.232412615128542,
        "nothing": 2.087073306174237
    },
    "coin,wall,enemy,wall": {
        "up": 5.094482253496964,
        "right": 0.06470393409291644,
        "down": 0,
        "left": 0.4346718746526109,
        "nothing": 0
    },
    "nothing,wall,enemy,nothing": {
        "up": -3.66375559696761,
        "right": -3.594677826861628,
        "down": -32.324233867364406,
        "left": -3.480696712426332,
        "nothing": -3.576085272840854
    },
    "coin,enemy,nothing,wall": {
        "up": 4.986224252421522,
        "right": -16.014848079863484,
        "down": 0,
        "left": -0.2295439283277665,
        "nothing": 0.3387509587947151
    },
    "nothing,enemy,wall,wall": {
        "up": -3.3656077775207014,
        "right": -21.41746731739204,
        "down": -3.490412917133088,
        "left": -3.5037625480164065,
        "nothing": -3.384507856479027
    },
    "enemy,wall,wall,wall": {
        "up": -21.5577461664513,
        "right": -5.172740102533786,
        "down": -5.746763075170833,
        "left": -5.277100483009634,
        "nothing": -4.978336146599685
    },
    "wall,nothing,enemy,coin": {
        "up": 0.7699262272803682,
        "right": -0.47738960726025437,
        "down": -25.93578264792901,
        "left": 6.63648315318995,
        "nothing": 0.8328866656977514
    },
    "nothing,coin,wall,enemy": {
        "up": 0,
        "right": 0.14107270432649105,
        "down": -0.3701613283493175,
        "left": 0,
        "nothing": -0.15512527181134142
    },
    "nothing,nothing,wall,enemy": {
        "up": -1.0680915121748282,
        "right": -3.310464668865787,
        "down": -3.634334953291696,
        "left": -32.362241400604944,
        "nothing": -3.2700957590815123
    },
    "nothing,wall,wall,enemy": {
        "up": -3.479400654352515,
        "right": -3.766651815645053,
        "down": -3.8052706593046426,
        "left": -34.58448631781122,
        "nothing": -3.46836514963055
    },
    "enemy,nothing,wall,wall": {
        "up": -40.529133873810466,
        "right": -3.182228366401412,
        "down": -4.110095269957009,
        "left": -4.328162560366963,
        "nothing": -3.9830849198910823
    },
    "enemy,wall,nothing,coin": {
        "up": -15.70385449841273,
        "right": 1.2609474826853697,
        "down": -1.38222785257179,
        "left": 7.250605260789227,
        "nothing": 2.2858274388116078
    },
    "enemy,nothing,nothing,wall": {
        "up": -42.74524952245004,
        "right": -3.110101966921693,
        "down": -3.892490054599488,
        "left": -4.617768614136258,
        "nothing": -3.7940646168228276
    },
    "enemy,wall,enemy,nothing": {
        "up": -8.972989990389427,
        "right": -1.5016115923656446,
        "down": -15.778712149371927,
        "left": -1.6028377043387356,
        "nothing": -1.5187612927356846
    },
    "nothing,enemy,big_coin,wall": {
        "up": -0.48486627128059717,
        "right": -15.828609337235118,
        "down": 1.3266464994048364,
        "left": 0,
        "nothing": -0.2
    },
    "coin,wall,enemy,nothing": {
        "up": 4.361825412301031,
        "right": 0.07783430716130146,
        "down": -25.906433443774667,
        "left": -0.29926371573904603,
        "nothing": 0.6553772432318361
    },
    "enemy,nothing,coin,wall": {
        "up": -15.885278119010575,
        "right": -1.0894446999737013,
        "down": 5.768456480347756,
        "left": 0.12786488968020682,
        "nothing": -0.2
    },
    "nothing,wall,coin,enemy": {
        "up": -2.390821153331415,
        "right": 2.2085823252239356,
        "down": 7.644960600464629,
        "left": -15.965299187277704,
        "nothing": 3.966921700086358
    },
    "enemy,coin,nothing,wall": {
        "up": -8.691766971985158,
        "right": 7.32093253617025,
        "down": -1.5004349663192373,
        "left": 1.2861359931088945,
        "nothing": 1.9451437325248593
    },
    "wall,wall,enemy,nothing": {
        "up": -4.49140361558686,
        "right": -4.1568962442997215,
        "down": -37.89987158280973,
        "left": -3.8174402801100884,
        "nothing": -3.817568038632273
    },
    "enemy,coin,wall,nothing": {
        "up": -21.483673927548075,
        "right": -0.17815740554216491,
        "down": -0.7200000000000001,
        "left": -0.9859078154140604,
        "nothing": -0.2
    },
    "wall,nothing,enemy,nothing": {
        "up": -4.054620469838686,
        "right": -3.81610414507906,
        "down": -32.26803790125556,
        "left": -1.8374559487872573,
        "nothing": -3.721604982466034
    },
    "nothing,enemy,wall,nothing": {
        "up": -3.082109054593947,
        "right": -39.92306802978378,
        "down": -3.06884558161697,
        "left": -3.1285090778116755,
        "nothing": -3.08979428472998
    },
    "coin,nothing,wall,enemy": {
        "up": 4.2148432833616365,
        "right": 0,
        "down": 0,
        "left": -8.789215755104767,
        "nothing": -0.2
    },
    "wall,wall,nothing,enemy": {
        "up": -4.048960831660588,
        "right": -4.121400956796517,
        "down": -3.4756011716067254,
        "left": -36.31671951109253,
        "nothing": -3.9250697609573764
    },
    "enemy,wall,coin,nothing": {
        "up": -8.866917662114599,
        "right": -0.4,
        "down": 2.965419625291561,
        "left": -0.7862519249218132,
        "nothing": -0.2
    },
    "wall,nothing,enemy,enemy": {
        "up": -1.15264,
        "right": -1.1674775713613004,
        "down": -8.722709184905709,
        "left": -8.700854285511955,
        "nothing": -1.2427626094592001
    },
    "nothing,wall,big_coin,nothing": {
        "up": -0.07233558507879544,
        "right": -0.5863598621492134,
        "down": 1.18135253086848,
        "left": -0.3965341272550915,
        "nothing": 0
    },
    "enemy,nothing,wall,coin": {
        "up": -8.869998803380518,
        "right": -0.761425925533836,
        "down": 0.11200397081276414,
        "left": 5.984694494101106,
        "nothing": 0.3136718214369348
    },
    "nothing,enemy,wall,coin": {
        "up": 0,
        "right": 0,
        "down": 0.10059364263070024,
        "left": 4.02377400345274,
        "nothing": 0
    },
    "wall,enemy,nothing,enemy": {
        "up": -1.15264,
        "right": -8.6648467639068,
        "down": -1.368023700843077,
        "left": -8.659079238020325,
        "nothing": -0.923136512
    },
    "enemy,wall,wall,nothing": {
        "up": -25.885214417990785,
        "right": -4.254872500107696,
        "down": -4.2168861480786575,
        "left": -3.802567440313186,
        "nothing": -3.8174826401187762
    },
    "wall,enemy,coin,nothing": {
        "up": -0.6534857811775764,
        "right": -29.212834556683546,
        "down": -0.19073994228913987,
        "left": -1.034118560420711,
        "nothing": -0.2
    },
    "enemy,wall,nothing,nothing": {
        "up": -34.60659345182776,
        "right": -4.308286017489448,
        "down": -3.783132751824145,
        "left": -0.795953061379826,
        "nothing": -3.7172221726793335
    },
    "wall,enemy,wall,coin": {
        "up": -0.4,
        "right": -8.840169424080743,
        "down": 0,
        "left": 4.281449820329393,
        "nothing": 0
    },
    "wall,enemy,nothing,nothing": {
        "up": -4.214546613966013,
        "right": -15.85557570144767,
        "down": -3.489115501481438,
        "left": -3.5345581998692635,
        "nothing": -3.5342922664503376
    },
    "nothing,enemy,wall,enemy": {
        "up": -2.091992265815178,
        "right": -15.649191928213131,
        "down": -1.15264,
        "left": -15.910390167881232,
        "nothing": -0.923136512
    },
    "nothing,enemy,enemy,wall": {
        "up": 0,
        "right": 0,
        "down": 0,
        "left": 0,
        "nothing": 0
    },
    "enemy,nothing,enemy,wall": {
        "up": -15.602632832514999,
        "right": -1.7677444296505933,
        "down": -8.651677317524141,
        "left": -1.7961044504028871,
        "nothing": -1.929881786536731
    },
    "coin,enemy,wall,enemy": {
        "up": 1.47936441517224,
        "right": 0,
        "down": 0,
        "left": 0,
        "nothing": 0
    },
    "wall,coin,enemy,nothing": {
        "up": -0.7200000000000001,
        "right": 4.391282195043966,
        "down": -8.737638003637333,
        "left": -0.714127279771012,
        "nothing": -0.2
    },
    "wall,coin,wall,enemy": {
        "up": -0.4,
        "right": 4.011907108836494,
        "down": -0.4,
        "left": -8.744747057195346,
        "nothing": 0
    },
    "enemy,wall,big_coin,nothing": {
        "up": -8.666509313495732,
        "right": -0.6618111478396573,
        "down": 1.2319042458193763,
        "left": -1.2114313397580716,
        "nothing": 0
    },
    "enemy,wall,enemy,wall": {
        "up": -15.753927759357454,
        "right": -2.4855252189184003,
        "down": -21.317550504633914,
        "left": -2.716788155022312,
        "nothing": -2.3979853766676364
    },
    "enemy,enemy,wall,wall": {
        "up": -8.670498793357735,
        "right": -8.656007967871743,
        "down": -0.4,
        "left": -0.7200000000000001,
        "nothing": -0.2
    },
    "wall,enemy,wall,enemy": {
        "up": -1.4209689600000002,
        "right": -25.5611022203757,
        "down": -0.7840000000000001,
        "left": -15.622915510233785,
        "nothing": -0.923136512
    },
    "wall,enemy,enemy,nothing": {
        "up": -0.7840000000000001,
        "right": -8.666692094744418,
        "down": -8.739175711333667,
        "left": -1.1312710239058665,
        "nothing": -0.7237760000000001
    },
    "enemy,wall,coin,wall": {
        "up": 0,
        "right": 0,
        "down": 1.3904416747827255,
        "left": 0,
        "nothing": 0
    },
    "enemy,wall,nothing,enemy": {
        "up": -8.715860701611804,
        "right": -0.4,
        "down": -0.7331305623377194,
        "left": -15.681980323122522,
        "nothing": -0.5456000000000001
    },
    "enemy,enemy,nothing,wall": {
        "up": -8.75744779527678,
        "right": 0,
        "down": -0.44058960252329094,
        "left": -0.4,
        "nothing": 0
    },
    "enemy,nothing,wall,enemy": {
        "up": -8.83385131309154,
        "right": -0.7381018922702204,
        "down": 0,
        "left": 0,
        "nothing": 0
    },
    "enemy,coin,wall,wall": {
        "up": 0,
        "right": 4.62087995832959,
        "down": -0.4,
        "left": -0.4,
        "nothing": 0
    },
    "nothing,wall,enemy,enemy": {
        "up": 0,
        "right": 0,
        "down": -8.661144662317978,
        "left": 0,
        "nothing": 0
    }
}`;

let data_exp0 = `{
    "wall,coin,wall,coin": {
        "up": 2.3860853555626216,
        "right": 6.203273190350304,
        "down": 2.365571361555842,
        "left": 5.869235596796827,
        "nothing": 3.2604145651781673
    },
    "coin,nothing,wall,coin": {
        "up": 4.113009881904107,
        "right": 0.5032454019881674,
        "down": 2.0284107427730063,
        "left": 5.785258009794584,
        "nothing": 2.983751840998613
    },
    "wall,nothing,coin,coin": {
        "up": 1.2668489018501328,
        "right": -0.8009143104783985,
        "down": 3.4588951558339294,
        "left": 5.631823080260924,
        "nothing": 2.4266493797516198
    },
    "wall,nothing,wall,coin": {
        "up": 0.1860045287155937,
        "right": -1.3268132566094515,
        "down": 0.90868106207423,
        "left": 2.612479132436567,
        "nothing": 1.457958021139943
    },
    "wall,nothing,coin,nothing": {
        "up": 0.18153100811389355,
        "right": -2.5150128593728676,
        "down": 1.638604511151909,
        "left": -1.6616370602564472,
        "nothing": -0.2531368450757223
    },
    "coin,nothing,wall,nothing": {
        "up": 5.622651955106339,
        "right": -0.6316192089947736,
        "down": 0.7146322820978644,
        "left": -0.5471822006327673,
        "nothing": 0.9057101995169804
    },
    "wall,coin,wall,nothing": {
        "up": 1.6603393157559243,
        "right": 4.957277080330972,
        "down": 1.791542578608634,
        "left": -0.34260265880806084,
        "nothing": 2.4092815231169693
    },
    "coin,wall,nothing,wall": {
        "up": 5.296598068657085,
        "right": 0.9544556472893823,
        "down": 1.1091288474127357,
        "left": 1.1015195097213568,
        "nothing": 1.0045852473976198
    },
    "wall,wall,nothing,coin": {
        "up": -0.36478807466354424,
        "right": 0.6210535051414385,
        "down": -2.9194080608651922,
        "left": 2.4212658284735173,
        "nothing": 2.0136899217615776
    },
    "nothing,wall,nothing,wall": {
        "up": -3.1587732544048466,
        "right": -4.1780439692598,
        "down": -2.273019834089598,
        "left": -4.05469395744362,
        "nothing": -3.331469368400266
    },
    "wall,nothing,enemy,coin": {
        "up": 1.3670555957362502,
        "right": 0,
        "down": -42.953189757999695,
        "left": 5.845313109898293,
        "nothing": 0
    },
    "wall,nothing,coin,wall": {
        "up": 0.4890721152931359,
        "right": -2.1584673649957242,
        "down": 2.0216576326707867,
        "left": 0.28404653803032653,
        "nothing": 0.33793233387609267
    },
    "nothing,wall,coin,wall": {
        "up": 1.451245874710135,
        "right": 1.349331760415755,
        "down": 5.595239388124197,
        "left": 0.6670372425719591,
        "nothing": 1.7365449291528257
    },
    "wall,nothing,nothing,wall": {
        "up": -3.6624050358574145,
        "right": -3.0792444633652836,
        "down": -3.1183532337664213,
        "left": -3.9330918535773547,
        "nothing": -3.10799178963145
    },
    "wall,nothing,wall,nothing": {
        "up": -3.3472290557966207,
        "right": -3.1938161225054884,
        "down": -4.210789976613992,
        "left": -3.2091193678659726,
        "nothing": -3.241477165422463
    },
    "nothing,coin,big_coin,wall": {
        "up": -1.2327711923106588,
        "right": 1.0959723600622575,
        "down": 2.331081580142701,
        "left": 0.12493084949556736,
        "nothing": 1.0137724346627643
    },
    "nothing,wall,wall,wall": {
        "up": -3.148205293933489,
        "right": -3.8097654613480305,
        "down": -3.6435077214133162,
        "left": -3.464085640771858,
        "nothing": -3.1219161304877536
    },
    "nothing,coin,nothing,wall": {
        "up": 0.6499187203937928,
        "right": 1.9571528029856156,
        "down": -2.028572199333025,
        "left": -0.4049992207781736,
        "nothing": 0.9084260586037427
    },
    "nothing,enemy,nothing,wall": {
        "up": -3.1057860034978804,
        "right": -45.74540049067347,
        "down": -2.6538031611645527,
        "left": -4.004901759390528,
        "nothing": -2.907481966345811
    },
    "nothing,wall,enemy,wall": {
        "up": -2.9462698072771434,
        "right": -3.470096802473461,
        "down": -45.81359231160574,
        "left": -3.980158370241797,
        "nothing": -3.150465768890907
    },
    "coin,coin,wall,nothing": {
        "up": 5.347589103034821,
        "right": 5.692537555101145,
        "down": 2.1206553762508724,
        "left": 1.3237646775758205,
        "nothing": 3.0707919924355718
    },
    "wall,coin,nothing,wall": {
        "up": -0.3702402577974324,
        "right": 3.204841121314365,
        "down": -2.8181391333621812,
        "left": -0.9527033820445662,
        "nothing": 1.3566852958363382
    },
    "wall,enemy,nothing,wall": {
        "up": -4.115064123255468,
        "right": -45.78892251354504,
        "down": -2.2336581298352343,
        "left": -2.928209723484481,
        "nothing": -2.3723398841854415
    },
    "coin,nothing,coin,wall": {
        "up": 4.094643340336308,
        "right": 1.0018421812543288,
        "down": 5.599838470506402,
        "left": 1.4056664095179532,
        "nothing": 2.373813006773239
    },
    "nothing,coin,coin,wall": {
        "up": -2.284210753050189,
        "right": 2.4674843926581103,
        "down": 5.781549397321172,
        "left": 1.9015505190726527,
        "nothing": 2.006865403642634
    },
    "nothing,coin,wall,coin": {
        "up": -1.191767183856606,
        "right": 2.811047146785878,
        "down": 1.9352716198512667,
        "left": 5.066108529920886,
        "nothing": 2.1990585629047046
    },
    "enemy,nothing,wall,wall": {
        "up": -45.509545774626645,
        "right": -1.9592603545551839,
        "down": -3.6462236281930576,
        "left": -3.9389781920093085,
        "nothing": -3.0620937118496165
    },
    "enemy,wall,nothing,wall": {
        "up": -45.73509916353077,
        "right": -3.4684590633930386,
        "down": -2.3719770909362143,
        "left": -3.2121800486924483,
        "nothing": -2.7832859144233466
    },
    "nothing,coin,wall,nothing": {
        "up": -0.9689266740123863,
        "right": 3.7101542193408785,
        "down": -0.15610817925756715,
        "left": -0.021616146937872838,
        "nothing": -0.04091398498474441
    },
    "coin,wall,wall,nothing": {
        "up": 4.813286038371367,
        "right": 2.0385217807585394,
        "down": 1.6055757702015216,
        "left": -1.243663929198195,
        "nothing": 2.9763263516406484
    },
    "nothing,nothing,wall,nothing": {
        "up": -3.104505072131781,
        "right": -3.183279603071332,
        "down": -3.922026931166607,
        "left": -2.7750269795925306,
        "nothing": -3.203946873405758
    },
    "wall,coin,nothing,nothing": {
        "up": 1.059817828180515,
        "right": 5.2429038928924765,
        "down": -1.6588229692873981,
        "left": -1.3795333826803913,
        "nothing": 1.9809132398395717
    },
    "nothing,nothing,nothing,wall": {
        "up": -3.209094567713418,
        "right": -2.959379005760246,
        "down": -3.216653069465604,
        "left": -3.8431417104618264,
        "nothing": -3.2158815577329083
    },
    "wall,coin,coin,nothing": {
        "up": 1.6540708376306985,
        "right": 3.0103364784624516,
        "down": 3.451407048234739,
        "left": 1.8907536340910218,
        "nothing": 2.7082218939875453
    },
    "coin,wall,coin,nothing": {
        "up": 3.6370662181930418,
        "right": 1.670231388847933,
        "down": 5.621845106424764,
        "left": -2.806095763024596,
        "nothing": 2.570613748632944
    },
    "coin,coin,nothing,wall": {
        "up": 1.3680131590646079,
        "right": 4.418975499827336,
        "down": -3.0086759022345406,
        "left": 1.1720196620361882,
        "nothing": 1.0814013150374755
    },
    "coin,wall,big_coin,nothing": {
        "up": 1.768044723766173,
        "right": 0,
        "down": 3.91399065984015,
        "left": -0.940281156773966,
        "nothing": 1.2033190209270672
    },
    "nothing,nothing,coin,wall": {
        "up": -1.3718827302173042,
        "right": -0.9147308716350564,
        "down": 3.464788888445085,
        "left": 1.1822067263319345,
        "nothing": 0.38580392651242323
    },
    "nothing,wall,coin,coin": {
        "up": -2.4856355590099053,
        "right": 1.5371178823016955,
        "down": 5.833955756352747,
        "left": 2.483447702344545,
        "nothing": 2.000856787255657
    },
    "nothing,coin,wall,wall": {
        "up": 0.8191528068665979,
        "right": 6.058302548004079,
        "down": 1.3696159661086424,
        "left": 0.22483499691144315,
        "nothing": -0.21420332696965372
    },
    "nothing,nothing,wall,wall": {
        "up": -3.217360103492711,
        "right": -3.2308296993100543,
        "down": -4.011891219511264,
        "left": -3.7633100842969434,
        "nothing": -3.220359267082255
    },
    "wall,nothing,nothing,nothing": {
        "up": -4.057949698867456,
        "right": -2.7248188310029056,
        "down": -3.223320763736316,
        "left": -3.077867054197167,
        "nothing": -2.9658548962603715
    },
    "nothing,wall,wall,nothing": {
        "up": -3.2262952622256,
        "right": -4.051134734169166,
        "down": -3.864709112729562,
        "left": -3.162437280125035,
        "nothing": -3.1992772281122477
    },
    "coin,nothing,nothing,wall": {
        "up": 3.55191886573312,
        "right": -2.1941748156891823,
        "down": -1.2688422506833663,
        "left": 0.14180397915347343,
        "nothing": 1.0509846670175462
    },
    "nothing,wall,nothing,coin": {
        "up": -2.006365638967003,
        "right": -0.5060223594975075,
        "down": -1.9638573644916668,
        "left": 4.160594837720502,
        "nothing": 0.2971609205047953
    },
    "wall,coin,nothing,enemy": {
        "up": 0.7331983585982003,
        "right": 5.669743814342137,
        "down": -1.8537988179061318,
        "left": -45.73114146311474,
        "nothing": 1.9072537241885232
    },
    "nothing,wall,wall,coin": {
        "up": 0.29842848984385806,
        "right": 0.9344540593380775,
        "down": 1.610593403317245,
        "left": 3.085668373190815,
        "nothing": 1.8778763862363625
    },
    "coin,nothing,wall,wall": {
        "up": 4.818109663208398,
        "right": -0.9333854326702896,
        "down": 1.5112976497828898,
        "left": 1.904348839162149,
        "nothing": 2.778965878618786
    },
    "coin,wall,nothing,coin": {
        "up": 3.7537139347615343,
        "right": 0.6714945166962849,
        "down": -1.6842514415875947,
        "left": 0.7185815415529392,
        "nothing": 0.6628710831148397
    },
    "wall,nothing,nothing,coin": {
        "up": 1.4301847736386495,
        "right": -2.3916894370758577,
        "down": -1.1420392005024984,
        "left": 4.346003003743488,
        "nothing": 2.059349177703611
    },
    "coin,wall,nothing,nothing": {
        "up": 5.044679238554954,
        "right": 0.07896584306155607,
        "down": -2.144169996508099,
        "left": -1.1279848321586807,
        "nothing": 0.0811820156348263
    },
    "coin,nothing,big_coin,wall": {
        "up": 1.60468793360377,
        "right": -2.7728365043846566,
        "down": 3.230603382243119,
        "left": 0.10715400610073017,
        "nothing": 0.6885840736691238
    },
    "nothing,wall,nothing,nothing": {
        "up": -1.8994221537913416,
        "right": -3.7881367744011305,
        "down": -3.2292509415777157,
        "left": -3.2183703330924933,
        "nothing": -3.219529867637297
    },
    "wall,enemy,nothing,coin": {
        "up": 0.4583937015634141,
        "right": -40.1502275135868,
        "down": -2.3729836967293423,
        "left": 5.568485224361462,
        "nothing": 2.3813049089353564
    },
    "wall,enemy,wall,coin": {
        "up": 0.21593327544615115,
        "right": -40.211688862763125,
        "down": 0.9496237084740249,
        "left": 5.781060633488281,
        "nothing": 0.8489489230313036
    },
    "enemy,wall,big_coin,nothing": {
        "up": -22.81106627693421,
        "right": -1,
        "down": 2.7087187722230786,
        "left": -1.480298030803453,
        "nothing": 0.6627939714137228
    },
    "wall,enemy,wall,nothing": {
        "up": -2.944171683812921,
        "right": -45.798930076343225,
        "down": -3.067133983874075,
        "left": -2.928275123651704,
        "nothing": -2.9873229762329476
    },
    "coin,enemy,nothing,wall": {
        "up": 4.580227710659223,
        "right": -44.33350900000735,
        "down": -1.258841967812147,
        "left": 0,
        "nothing": 1.7853443857782976
    },
    "nothing,enemy,big_coin,wall": {
        "up": -2.0179873357389333,
        "right": -40.33686587226522,
        "down": 3.575977689643037,
        "left": -0.5612680656311854,
        "nothing": 1.1779239258397558
    },
    "wall,coin,nothing,coin": {
        "up": 1.3362162070805812,
        "right": 2.8828982496691378,
        "down": -1.101343559282569,
        "left": 4.755780758347234,
        "nothing": 1.715013362114706
    },
    "nothing,enemy,wall,nothing": {
        "up": -3.1603120909125346,
        "right": -42.881091166638605,
        "down": -3.8351422032997267,
        "left": -2.18827922420597,
        "nothing": -3.1803687046441294
    },
    "wall,enemy,nothing,nothing": {
        "up": -3.567469607085984,
        "right": -45.7308906689136,
        "down": -3.178128816532562,
        "left": -3.167226240579405,
        "nothing": -3.1823738866518765
    },
    "nothing,coin,enemy,wall": {
        "up": -2.3869049672642837,
        "right": 5.33619350144725,
        "down": -23.048547339955245,
        "left": 0.017523393091407824,
        "nothing": 0
    },
    "wall,wall,coin,nothing": {
        "up": 1.6230627404068414,
        "right": 1.4904735635684216,
        "down": 2.9716922267079875,
        "left": -1.9716945847318696,
        "nothing": 2.4678210594088257
    },
    "wall,nothing,wall,enemy": {
        "up": -3.382122085628986,
        "right": -1.8783235234542888,
        "down": -3.5302095841129786,
        "left": -45.71694654980867,
        "nothing": -2.8480869653158845
    },
    "coin,wall,enemy,nothing": {
        "up": 4.69396810893174,
        "right": 0.3344817871457149,
        "down": -23.02402293745306,
        "left": -1.7469346546816344,
        "nothing": 0.022057242660597942
    },
    "enemy,nothing,enemy,wall": {
        "up": -40.04483498735193,
        "right": -1.9243717838424181,
        "down": -23.021629459674564,
        "left": -3.186625,
        "nothing": -3.0017927036729715
    },
    "enemy,wall,coin,nothing": {
        "up": -22.96969627181067,
        "right": -1,
        "down": 5.8882789567353555,
        "left": -0.9888330826812541,
        "nothing": -0.5
    },
    "wall,wall,nothing,nothing": {
        "up": -4.0214774070887875,
        "right": -3.8815947575634384,
        "down": -3.1745580126850843,
        "left": -3.2031184915164177,
        "nothing": -3.1797533764429224
    },
    "nothing,nothing,wall,coin": {
        "up": -0.2853841029109375,
        "right": -2.49498705980278,
        "down": 0.2275028649802573,
        "left": 5.800602022902442,
        "nothing": 1.9943988628621394
    },
    "wall,coin,enemy,nothing": {
        "up": -1.5,
        "right": 5.743464878777697,
        "down": -22.999527993043696,
        "left": -1.2143655595898353,
        "nothing": -0.5
    },
    "enemy,wall,enemy,nothing": {
        "up": -22.94407460121356,
        "right": -1.5,
        "down": -22.889696729656915,
        "left": -1.507953734652959,
        "nothing": -1.466875
    },
    "wall,nothing,nothing,enemy": {
        "up": -3.8007480156974136,
        "right": -2.617065400424682,
        "down": -2.577512965598787,
        "left": -45.76692993250923,
        "nothing": -3.198311393970938
    },
    "nothing,enemy,wall,wall": {
        "up": -3.0685275058915886,
        "right": -40.06044395068277,
        "down": -3.513874137726878,
        "left": -3.1601582465857043,
        "nothing": -3.106073394184422
    },
    "nothing,nothing,enemy,wall": {
        "up": -1.9002846688839934,
        "right": -3.135568890080176,
        "down": -45.53362032256037,
        "left": -3.878521657612831,
        "nothing": -2.9694512138793465
    },
    "coin,nothing,wall,enemy": {
        "up": 5.612455775911126,
        "right": -0.4206101335152612,
        "down": -0.17705635630396355,
        "left": -22.900021686037956,
        "nothing": -0.5
    },
    "enemy,nothing,nothing,wall": {
        "up": -45.83144765233024,
        "right": -2.423087236944549,
        "down": -3.146656142016405,
        "left": -3.949855125511546,
        "nothing": -2.5888984560075468
    },
    "nothing,wall,enemy,nothing": {
        "up": -3.173224691758474,
        "right": -3.769510559099041,
        "down": -45.72061817419418,
        "left": -3.087891483487749,
        "nothing": -3.093142336995361
    },
    "enemy,wall,nothing,nothing": {
        "up": -45.67895075652546,
        "right": -3.88373063174443,
        "down": -2.777921973442948,
        "left": -3.1148612716569897,
        "nothing": -3.1381370834068933
    },
    "enemy,wall,wall,nothing": {
        "up": -45.137813273043704,
        "right": -3.9503685246263425,
        "down": -3.848008441418866,
        "left": -3.2026587135428315,
        "nothing": -3.193464451539497
    },
    "nothing,wall,enemy,coin": {
        "up": -0.9216495794358502,
        "right": -0.08514160630369844,
        "down": -44.32684505814871,
        "left": 0.5171178037748372,
        "nothing": 0.8433254036697656
    },
    "nothing,wall,coin,enemy": {
        "up": -2.5817324784947564,
        "right": 2.151654053682601,
        "down": 3.0381324460589414,
        "left": -45.07340463267242,
        "nothing": 2.9834845417202898
    },
    "enemy,coin,nothing,wall": {
        "up": -34.28982016540575,
        "right": 3.251628979023382,
        "down": -1.0447496954629216,
        "left": 1.1459139478063147,
        "nothing": 1.2352462560183313
    },
    "nothing,nothing,wall,enemy": {
        "up": -3.033304642991112,
        "right": -2.3782762178833305,
        "down": -3.626696225651555,
        "left": -45.00521336430865,
        "nothing": -2.973211538278054
    },
    "nothing,wall,big_coin,enemy": {
        "up": -1.4048821380028085,
        "right": -0.032435901322560134,
        "down": 2.3281454912412736,
        "left": -44.283059788191835,
        "nothing": 0.9084757238880962
    },
    "nothing,wall,big_coin,nothing": {
        "up": -2.403039624521868,
        "right": 0,
        "down": 2.1339625841657455,
        "left": -2.5099521101136064,
        "nothing": 0.30085155050298895
    },
    "nothing,wall,wall,enemy": {
        "up": -2.9878994704620947,
        "right": -3.8754901001770454,
        "down": -3.788751071949326,
        "left": -44.98008983163243,
        "nothing": -3.117550436950295
    },
    "wall,wall,enemy,nothing": {
        "up": -3.5813761590592184,
        "right": -3.2819591981800587,
        "down": -45.681163329777405,
        "left": -1.8575134934541322,
        "nothing": -2.655568168866774
    },
    "nothing,coin,wall,enemy": {
        "up": -0.42843999639396513,
        "right": 0.9821437888870106,
        "down": -0.9675512711310176,
        "left": -23.088500389650005,
        "nothing": 0
    },
    "enemy,nothing,wall,nothing": {
        "up": -45.405026758873476,
        "right": -2.789305241960145,
        "down": -3.627961217212075,
        "left": -3.002529273917655,
        "nothing": -2.8595826917090625
    },
    "nothing,wall,big_coin,coin": {
        "up": -2.6052788274095002,
        "right": -0.2328937231297007,
        "down": 3.2130446780777753,
        "left": 1.0207986759917855,
        "nothing": 1.0636180151566244
    },
    "wall,enemy,coin,nothing": {
        "up": -1.494181245403134,
        "right": -22.976247609571487,
        "down": 2.8895560005951753,
        "left": -1.1240241544918554,
        "nothing": 1.3461610069352057
    },
    "wall,wall,nothing,enemy": {
        "up": -3.87149905972374,
        "right": -4.167272177154077,
        "down": -1.9391878014490889,
        "left": -45.40603317572354,
        "nothing": -3.0577702031052287
    },
    "coin,wall,nothing,enemy": {
        "up": 3.754779257602414,
        "right": 1.3061150593683593,
        "down": -1.7672256872921568,
        "left": -22.89784448253288,
        "nothing": 1.912799802017489
    },
    "wall,nothing,coin,enemy": {
        "up": 0.5162973114576284,
        "right": -2.1480368737493682,
        "down": 1.0697386543721201,
        "left": -40.12736187985389,
        "nothing": 0.693335960859154
    },
    "enemy,coin,wall,nothing": {
        "up": -23.091582620494243,
        "right": 5.589928050999017,
        "down": -1,
        "left": -1.625282055036657,
        "nothing": -0.5
    },
    "nothing,wall,coin,nothing": {
        "up": 0.7955254369328757,
        "right": 1.0314585064371546,
        "down": 5.414494005935893,
        "left": -1.842290965041523,
        "nothing": 1.788292429865448
    },
    "enemy,nothing,wall,coin": {
        "up": -34.242250788005705,
        "right": 0,
        "down": -1,
        "left": 5.12124876152155,
        "nothing": 0
    },
    "enemy,coin,wall,wall": {
        "up": -22.92288176142707,
        "right": 5.872029895167907,
        "down": 0,
        "left": 1.2568824396506422,
        "nothing": 1.4559851687944783
    },
    "coin,nothing,enemy,wall": {
        "up": 4.952199502561685,
        "right": -0.4988167725160854,
        "down": -34.22869304665261,
        "left": 1.180305131413364,
        "nothing": 0.6339459563460923
    },
    "wall,nothing,enemy,wall": {
        "up": -3.9952845561385546,
        "right": -2.7715878858747858,
        "down": -45.727232595788564,
        "left": -3.5542258239075677,
        "nothing": -3.091014175899466
    },
    "nothing,wall,nothing,enemy": {
        "up": -3.147449039410695,
        "right": -3.8344724800970016,
        "down": -2.955154984101341,
        "left": -45.67733015137037,
        "nothing": -3.14509608366775
    },
    "enemy,nothing,coin,wall": {
        "up": -39.950166250756155,
        "right": -1.8002745682438364,
        "down": 5.781336965181745,
        "left": 1.1759657790918392,
        "nothing": -0.5913969052318877
    },
    "wall,nothing,enemy,nothing": {
        "up": -3.465758096470646,
        "right": -2.7613001046272165,
        "down": -44.29217836662659,
        "left": -3.082243766111583,
        "nothing": -2.8408612661035555
    },
    "enemy,nothing,big_coin,wall": {
        "up": -22.94319328337787,
        "right": -2.275936776622596,
        "down": 2.0539272427284287,
        "left": -0.3962197266414308,
        "nothing": 0.4989877386655336
    },
    "coin,enemy,wall,nothing": {
        "up": 5.91817023144217,
        "right": 0,
        "down": 0,
        "left": -2.359486760259587,
        "nothing": 0
    },
    "coin,wall,enemy,wall": {
        "up": 5.105959011225083,
        "right": -1.5,
        "down": -22.82375390950905,
        "left": -1,
        "nothing": 0.6349286967231154
    },
    "enemy,wall,nothing,enemy": {
        "up": -34.22746524546987,
        "right": -2.5725,
        "down": -2.7118246466607427,
        "left": -34.29409588215769,
        "nothing": -2.6770853188642576
    },
    "wall,enemy,wall,enemy": {
        "up": -3.9426072634059497,
        "right": -45.057103253037866,
        "down": -4.016335103432484,
        "left": -39.9405764266443,
        "nothing": -3.3329615083344724
    },
    "enemy,wall,nothing,coin": {
        "up": -34.26939803951043,
        "right": 0.3157161604622327,
        "down": -0.44859978814649115,
        "left": 5.943172748621666,
        "nothing": 1.8814445048188635
    },
    "nothing,enemy,coin,wall": {
        "up": -2.6426987348890605,
        "right": -42.812571447975934,
        "down": 5.8216964429550035,
        "left": 1.8991990942522388,
        "nothing": 2.580191024129706
    },
    "enemy,wall,enemy,wall": {
        "up": -40.00722897512877,
        "right": -3.186625,
        "down": -34.30341502889396,
        "left": -2.859375,
        "nothing": -2.6770853188642576
    },
    "enemy,wall,wall,wall": {
        "up": -45.417447235074675,
        "right": -4.332832823334597,
        "down": -4.313804704536487,
        "left": -4.333175135633388,
        "nothing": -3.3333333333333313
    },
    "nothing,nothing,big_coin,wall": {
        "up": -1.9595379326749887,
        "right": -1.8494143366833449,
        "down": 3.4890277348066703,
        "left": -0.6760827836211188,
        "nothing": 0
    },
    "wall,nothing,enemy,enemy": {
        "up": -3.0111352509870772,
        "right": -2.2753037816175774,
        "down": -22.796269794515105,
        "left": -22.91630690236073,
        "nothing": -2.421370268109038
    },
    "nothing,enemy,wall,enemy": {
        "up": -2.4199684951558007,
        "right": -22.980895479820234,
        "down": -2.3751875,
        "left": -22.852812436746913,
        "nothing": -1.28625
    },
    "wall,enemy,enemy,nothing": {
        "up": -3.5645108113090576,
        "right": -22.838628727925396,
        "down": -34.211755412696796,
        "left": -2.7184631252570925,
        "nothing": -2.9903561798076423
    },
    "enemy,enemy,wall,nothing": {
        "up": 0,
        "right": 0,
        "down": 0,
        "left": 2.658919224987955,
        "nothing": 0.05647147494724469
    },
    "wall,wall,enemy,enemy": {
        "up": -1,
        "right": -1.5,
        "down": -22.90230595767489,
        "left": -22.79707346502668,
        "nothing": -0.5
    },
    "nothing,enemy,enemy,wall": {
        "up": -1.6090272674213824,
        "right": -22.81298626067423,
        "down": -23.00806996229249,
        "left": -1,
        "nothing": -0.5
    },
    "nothing,enemy,wall,coin": {
        "up": -1.5899914186765234,
        "right": -22.880647402555756,
        "down": 0,
        "left": 5.470363381025491,
        "nothing": 1.395433749346939
    },
    "wall,coin,wall,enemy": {
        "up": 0,
        "right": 5.178664346215378,
        "down": -1,
        "left": 0,
        "nothing": -0.5
    },
    "enemy,enemy,nothing,wall": {
        "up": -34.336318231454804,
        "right": -22.823967933149248,
        "down": -2.46144234033871,
        "left": -3.0129088984375,
        "nothing": -2.6770853188642576
    },
    "wall,enemy,nothing,enemy": {
        "up": -1,
        "right": -34.249295093004775,
        "down": -1.203255446933919,
        "left": -22.99091094104886,
        "nothing": -0.5
    },
    "enemy,nothing,wall,enemy": {
        "up": 0,
        "right": 0,
        "down": 0,
        "left": -22.972239785500147,
        "nothing": 0
    },
    "wall,enemy,enemy,wall": {
        "up": -1,
        "right": 0,
        "down": -22.931233534049174,
        "left": 0,
        "nothing": 0
    },
    "coin,coin,enemy,wall": {
        "up": 0.06653049477733364,
        "right": 0,
        "down": 0,
        "left": -1,
        "nothing": 0
    }
}`;

let data_disc = `{
    "wall,coin,wall,coin": {
        "up": 2.378247376144714,
        "right": 5.74548935081079,
        "down": 2.3849864169378043,
        "left": 6.278688422950276,
        "nothing": 3.3963414804307344
    },
    "coin,coin,wall,nothing": {
        "up": 5.831837290148409,
        "right": 4.794909035697616,
        "down": 2.158748960206962,
        "left": 1.9603519757018912,
        "nothing": 3.6277429823753167
    },
    "coin,wall,nothing,wall": {
        "up": 5.652639457805714,
        "right": 2.359054490913328,
        "down": 1.3658943268207528,
        "left": 2.0991936082782976,
        "nothing": 2.9541819972428414
    },
    "nothing,coin,wall,nothing": {
        "up": -0.3157527965642313,
        "right": 6.055855078046063,
        "down": 1.814160042433853,
        "left": -0.22735074421480866,
        "nothing": 1.1138070723697968
    },
    "wall,nothing,wall,coin": {
        "up": 2.079736962769168,
        "right": 1.9063652787345453,
        "down": 2.245255410268223,
        "left": 5.975259227388092,
        "nothing": 2.9018788652439285
    },
    "coin,nothing,wall,coin": {
        "up": 5.519546400315477,
        "right": 3.1371674128748435,
        "down": 2.3308320063496737,
        "left": 6.301976235370905,
        "nothing": 3.327235771057988
    },
    "wall,nothing,wall,nothing": {
        "up": -3.7123016873469843,
        "right": -2.983703625669204,
        "down": -3.307873315413022,
        "left": -0.5156646204187736,
        "nothing": -2.9858785689090377
    },
    "wall,enemy,nothing,wall": {
        "up": -4.537323760401143,
        "right": -39.559742205736015,
        "down": -1.2182743190496501,
        "left": -3.901513662790319,
        "nothing": -3.222138020454605
    },
    "wall,coin,nothing,wall": {
        "up": 0.7507556759331262,
        "right": 4.804779737278709,
        "down": -1.593148798833719,
        "left": 0.496196915495206,
        "nothing": 0.5309088417964122
    },
    "nothing,wall,nothing,wall": {
        "up": -2.1621620335483813,
        "right": -3.416711555050845,
        "down": -1.8858737102806042,
        "left": -2.8221211162321773,
        "nothing": -2.471080730231706
    },
    "wall,coin,coin,nothing": {
        "up": 2.2419317985710303,
        "right": 5.746833910254629,
        "down": 5.244770634901144,
        "left": -1.4374060587481365,
        "nothing": 3.086950622547816
    },
    "wall,coin,wall,nothing": {
        "up": 1.4084230588898383,
        "right": 6.027545664064218,
        "down": 2.1754557904709917,
        "left": 0.6518981726530213,
        "nothing": 1.562848296449221
    },
    "wall,nothing,coin,nothing": {
        "up": 0.3863433636272827,
        "right": -0.20389393118560406,
        "down": 4.800662640481174,
        "left": 0.20408907394426112,
        "nothing": 1.8993465162793002
    },
    "nothing,wall,coin,wall": {
        "up": -0.6230770532331058,
        "right": 2.351222411640908,
        "down": 6.288694369022476,
        "left": 2.349525682943364,
        "nothing": 2.3445101936045853
    },
    "wall,nothing,nothing,nothing": {
        "up": -2.7298070797022467,
        "right": -1.2860349014857375,
        "down": -2.3103884927892273,
        "left": -2.3251191855970057,
        "nothing": -2.4053135046101204
    },
    "coin,wall,coin,nothing": {
        "up": 3.1747685135673898,
        "right": 1.9836635065034747,
        "down": 5.704646272941459,
        "left": 2.0453047131479805,
        "nothing": 3.24997894286869
    },
    "wall,coin,nothing,coin": {
        "up": 1.8248301841475438,
        "right": 3.4436415079392346,
        "down": -1.8563719510111953,
        "left": 6.002191202629742,
        "nothing": 2.73544678101276
    },
    "wall,wall,coin,nothing": {
        "up": -0.2401877230678007,
        "right": 0.5506847434732278,
        "down": 4.11093035244928,
        "left": -2.872120560514307,
        "nothing": 0.8334651759810049
    },
    "wall,nothing,nothing,coin": {
        "up": 1.8704114873895623,
        "right": 0.6691224295111187,
        "down": -1.8501541647392976,
        "left": 4.299092208187475,
        "nothing": 3.0138429893431673
    },
    "wall,nothing,nothing,enemy": {
        "up": -4.271315918158246,
        "right": 1.5358034534971994,
        "down": -3.860728909662708,
        "left": -43.39326043039812,
        "nothing": -3.9045422214951326
    },
    "nothing,wall,big_coin,coin": {
        "up": -0.8244227869774193,
        "right": 1.3916290755461693,
        "down": 1.5260590246253074,
        "left": 3.6435494114909153,
        "nothing": 1.3434630731907704
    },
    "wall,nothing,wall,enemy": {
        "up": -0.9415131052612576,
        "right": -0.08077098592719412,
        "down": -1.884683108575255,
        "left": -44.43904962748712,
        "nothing": -1.2543544932227928
    },
    "nothing,wall,enemy,wall": {
        "up": -0.8599271187455595,
        "right": -4.761580532411584,
        "down": -43.52568810922571,
        "left": -4.104168516906217,
        "nothing": -2.9912194464304864
    },
    "nothing,wall,enemy,coin": {
        "up": -1.6924411519902327,
        "right": 2.303678932843148,
        "down": -29.385004189960448,
        "left": 5.731838937881451,
        "nothing": 2.366705461349631
    },
    "coin,nothing,coin,wall": {
        "up": 4.741436115912262,
        "right": -0.08441517818305644,
        "down": 4.2068933756677245,
        "left": 2.034894083125839,
        "nothing": 2.0119271483371897
    },
    "nothing,nothing,coin,wall": {
        "up": -1.1883980976124022,
        "right": 0.8547445459670027,
        "down": 6.021097974626812,
        "left": 1.5605423284407507,
        "nothing": 1.6259592545116155
    },
    "wall,enemy,wall,nothing": {
        "up": -1.9259148655105585,
        "right": -45.32527133149669,
        "down": -2.9810565507983444,
        "left": -1.5577693626216063,
        "nothing": -1.9150115686559765
    },
    "nothing,wall,wall,coin": {
        "up": 2.0411558370215754,
        "right": 1.7301957435626467,
        "down": 1.680675755609196,
        "left": 5.502085625749318,
        "nothing": 2.049025176348893
    },
    "nothing,nothing,nothing,wall": {
        "up": -2.250590865548533,
        "right": -2.2898759831403694,
        "down": -2.0488440521452027,
        "left": -3.142189881415417,
        "nothing": -2.217452053625575
    },
    "nothing,nothing,wall,nothing": {
        "up": -1.8989318057581468,
        "right": -2.495812452225163,
        "down": -2.876972652489627,
        "left": -2.4141950341903198,
        "nothing": -2.4323377886536637
    },
    "wall,wall,nothing,coin": {
        "up": 0.6241954260341758,
        "right": 1.8600027228108784,
        "down": -3.0262719118047197,
        "left": 5.83918538794903,
        "nothing": 3.162040492446466
    },
    "wall,nothing,nothing,wall": {
        "up": -4.442656566969542,
        "right": -3.4145524665258415,
        "down": 0.6199121294067267,
        "left": -3.639921451260431,
        "nothing": -2.5291907026145166
    },
    "nothing,wall,coin,nothing": {
        "up": 1.4311984529292103,
        "right": 1.192067115291745,
        "down": 5.841379234272557,
        "left": -0.19172325608412977,
        "nothing": 1.8137148916282197
    },
    "nothing,coin,coin,wall": {
        "up": -0.6247820489453508,
        "right": 5.5935581763954545,
        "down": 5.859016210172804,
        "left": 2.273509845342737,
        "nothing": 3.2718548185659064
    },
    "coin,wall,nothing,coin": {
        "up": 5.380731054244381,
        "right": 1.9889739820964203,
        "down": -0.6871091536977636,
        "left": 4.833030020199798,
        "nothing": 3.1049843242096515
    },
    "nothing,wall,nothing,coin": {
        "up": -1.9080672462845991,
        "right": -0.1728120286161713,
        "down": -0.40963358214741535,
        "left": 4.825786729231691,
        "nothing": 0.45159256768770895
    },
    "nothing,nothing,wall,coin": {
        "up": -2.052340869645021,
        "right": -0.6455228416888328,
        "down": -0.032359417683919756,
        "left": 4.72347976677033,
        "nothing": 2.3977650609305288
    },
    "nothing,wall,wall,nothing": {
        "up": -1.9804869789859594,
        "right": -3.7290448794420548,
        "down": -3.1823719250303073,
        "left": -0.14892110250160462,
        "nothing": -2.2329142840582588
    },
    "nothing,coin,nothing,wall": {
        "up": -1.6207635554096722,
        "right": 5.530631147224522,
        "down": 0.8449771932301524,
        "left": 1.359730345339674,
        "nothing": 0.8695113630291177
    },
    "coin,wall,big_coin,nothing": {
        "up": 0.7880510352112545,
        "right": 0.16862866384978065,
        "down": 3.313851008787705,
        "left": -0.46840612185662045,
        "nothing": 1.1234128308415703
    },
    "nothing,wall,wall,wall": {
        "up": -0.6508907741769792,
        "right": -2.9268191719753522,
        "down": -3.1565086676923815,
        "left": -3.1668087391975512,
        "nothing": -2.478654601746081
    },
    "coin,wall,nothing,nothing": {
        "up": 3.9256038033536567,
        "right": 0.7530299111837847,
        "down": -1.8927349532609232,
        "left": 0.5268134527787405,
        "nothing": 0.2950802422114266
    },
    "enemy,wall,nothing,wall": {
        "up": -44.397351936278824,
        "right": -1.9166840697852827,
        "down": 2.2984903139187507,
        "left": -1.5621826447169291,
        "nothing": 0.03736479231329015
    },
    "wall,nothing,coin,coin": {
        "up": 2.2067587993171713,
        "right": 2.854561639563175,
        "down": 6.400104670974057,
        "left": 5.069950385951472,
        "nothing": 3.2028788354311635
    },
    "coin,nothing,wall,nothing": {
        "up": 5.706379264204319,
        "right": 1.4072784316509295,
        "down": 1.9227649297797003,
        "left": 1.9409884861260822,
        "nothing": 2.8388819164545698
    },
    "wall,wall,nothing,nothing": {
        "up": -4.5360423585206,
        "right": -4.942799726916923,
        "down": -2.883836289132919,
        "left": -1.9280602259880657,
        "nothing": -2.8890259786429118
    },
    "enemy,nothing,wall,nothing": {
        "up": -32.275008958389705,
        "right": -3.0733568722143896,
        "down": -3.447362916075197,
        "left": -1.0715517120259057,
        "nothing": -3.3429988664436174
    },
    "wall,enemy,nothing,coin": {
        "up": 1.1485515834167286,
        "right": -30.87576039222233,
        "down": -0.9870120668467439,
        "left": 6.157551391077837,
        "nothing": 2.010434285851734
    },
    "wall,nothing,coin,wall": {
        "up": 1.8831203300857082,
        "right": -1.5245784991125775,
        "down": 6.077057103289549,
        "left": 1.824676074737185,
        "nothing": 2.012159635124145
    },
    "nothing,wall,coin,coin": {
        "up": -1.8089918320425786,
        "right": 2.2445788007423477,
        "down": 2.8851374368882863,
        "left": 5.727475987730756,
        "nothing": 3.0559266512631367
    },
    "nothing,coin,wall,coin": {
        "up": 2.5665068415869863,
        "right": 3.6028665575025585,
        "down": 2.155403872905783,
        "left": 5.669531764449959,
        "nothing": 2.953834342781918
    },
    "coin,nothing,wall,wall": {
        "up": 6.034546221522664,
        "right": -1.3664545431182042,
        "down": 2.5291009012218666,
        "left": 2.496139508739131,
        "nothing": 3.445921903869769
    },
    "coin,wall,wall,nothing": {
        "up": 6.136325689718037,
        "right": 2.3091362839554987,
        "down": 1.970347080450431,
        "left": 1.2285167468184384,
        "nothing": 2.938534978347266
    },
    "coin,coin,nothing,wall": {
        "up": 3.700082440746173,
        "right": 5.8107640675640155,
        "down": -2.03830854440986,
        "left": 1.3520806398151977,
        "nothing": 2.2975464357771402
    },
    "nothing,wall,big_coin,enemy": {
        "up": -1.340290069351402,
        "right": -0.7321141226535157,
        "down": 1.0315983385771856,
        "left": -38.96875161675189,
        "nothing": 0.1507903605713842
    },
    "nothing,wall,nothing,enemy": {
        "up": -0.8612374627350208,
        "right": -4.698162015685443,
        "down": -3.6429830182089202,
        "left": -44.402369743657815,
        "nothing": -3.8245470974229314
    },
    "nothing,wall,nothing,nothing": {
        "up": -2.027757000951185,
        "right": -4.251822115435473,
        "down": -2.343900694311049,
        "left": -2.0521382760578377,
        "nothing": -2.0987625854673553
    },
    "coin,nothing,enemy,wall": {
        "up": 6.069651200134709,
        "right": -0.6524416396118395,
        "down": -15.636162391091432,
        "left": 0.4440042343362983,
        "nothing": 1.6920263888672906
    },
    "nothing,nothing,enemy,wall": {
        "up": -3.586834569155127,
        "right": -0.07442931672069644,
        "down": -37.979375714623245,
        "left": -3.681393106608909,
        "nothing": -3.553886904663335
    },
    "coin,enemy,wall,nothing": {
        "up": 5.521939694778517,
        "right": -8.691011744913622,
        "down": -0.4,
        "left": -0.43349128909095447,
        "nothing": -0.25749926321040867
    },
    "nothing,enemy,coin,wall": {
        "up": -2.944656410689725,
        "right": -37.572806465201005,
        "down": 5.977968611865947,
        "left": 1.5829842330285937,
        "nothing": 1.612630500895544
    },
    "wall,nothing,coin,enemy": {
        "up": 0.4791784997481553,
        "right": -1.9520116892046324,
        "down": 5.458392923763666,
        "left": -39.518906962320486,
        "nothing": 1.6517401893977999
    },
    "nothing,coin,wall,wall": {
        "up": -0.4592281435484189,
        "right": 5.969217836457684,
        "down": 1.8120032362830343,
        "left": 1.678801063591544,
        "nothing": 3.2050411272224735
    },
    "coin,nothing,big_coin,wall": {
        "up": 3.3863973121054016,
        "right": -2.5697343200601863,
        "down": 2.0085399898635687,
        "left": 1.6112573183253673,
        "nothing": 2.456203986152802
    },
    "coin,nothing,nothing,wall": {
        "up": 5.338469478605399,
        "right": -2.211820715201203,
        "down": -1.7486335747670663,
        "left": -0.15076503386839335,
        "nothing": 1.0846309121898425
    },
    "nothing,coin,big_coin,wall": {
        "up": -1.597062512589217,
        "right": 5.834523674803073,
        "down": 2.7326915925589175,
        "left": 0.05479582086218754,
        "nothing": 0.046484107998693014
    },
    "nothing,enemy,nothing,wall": {
        "up": -0.693391912665311,
        "right": -36.461133765069455,
        "down": -3.119276163477079,
        "left": -4.596003527913653,
        "nothing": -3.9972230046978066
    },
    "nothing,coin,enemy,wall": {
        "up": -0.2730420680256139,
        "right": 6.244515673990761,
        "down": -36.44745266705465,
        "left": -0.18571466756082675,
        "nothing": 0.6038071196814754
    },
    "wall,coin,nothing,enemy": {
        "up": 1.2152376210252762,
        "right": 6.054040525761105,
        "down": -1.606062742269519,
        "left": -36.27919857036396,
        "nothing": 4.259880717222322
    },
    "wall,nothing,enemy,wall": {
        "up": -3.376188458299025,
        "right": -1.9012262958887451,
        "down": -42.42928305523453,
        "left": -4.076264977302705,
        "nothing": -4.063331157065955
    },
    "wall,coin,nothing,nothing": {
        "up": 1.898576333766835,
        "right": 6.253494410308019,
        "down": -0.3949522741895892,
        "left": -1.2103934557415907,
        "nothing": 2.8761306999435727
    },
    "enemy,nothing,big_coin,wall": {
        "up": -21.498485659419565,
        "right": -1.2665901946026117,
        "down": 2.5262070251417486,
        "left": -0.6984626517337844,
        "nothing": -0.19893555610149924
    },
    "nothing,nothing,big_coin,wall": {
        "up": -0.15973241793189585,
        "right": -1.9402489662695008,
        "down": 2.978442635664255,
        "left": -0.22001139465881017,
        "nothing": -0.035345638140280564
    },
    "nothing,nothing,wall,wall": {
        "up": -2.4288321608765964,
        "right": -2.4103723966287856,
        "down": -3.766037909192333,
        "left": -2.4371622711417142,
        "nothing": -2.3892857470307676
    },
    "coin,wall,nothing,enemy": {
        "up": 5.722241613020018,
        "right": 0,
        "down": 0,
        "left": -21.232412615128542,
        "nothing": 2.087073306174237
    },
    "coin,wall,enemy,wall": {
        "up": 6.00376924503758,
        "right": 1.137328340367485,
        "down": 0,
        "left": 1.3511294499987985,
        "nothing": 1.2830687887239374
    },
    "nothing,wall,enemy,nothing": {
        "up": -3.66375559696761,
        "right": -3.350352754609526,
        "down": -32.324233867364406,
        "left": -1.5800395462248917,
        "nothing": -3.576085272840854
    },
    "coin,enemy,nothing,wall": {
        "up": 4.325821275685474,
        "right": -16.014848079863484,
        "down": 0,
        "left": -0.2295439283277665,
        "nothing": 0.3387509587947151
    },
    "nothing,enemy,wall,wall": {
        "up": -0.8917615294285175,
        "right": -21.41746731739204,
        "down": -3.490412917133088,
        "left": -3.5037625480164065,
        "nothing": -3.384507856479027
    },
    "enemy,wall,wall,wall": {
        "up": -33.55463217974126,
        "right": -5.172740102533786,
        "down": -5.257192409230891,
        "left": -5.2211969945762124,
        "nothing": -3.9537453475585
    },
    "wall,nothing,enemy,coin": {
        "up": 0.7699262272803682,
        "right": -0.47738960726025437,
        "down": -25.93578264792901,
        "left": 4.985113321668747,
        "nothing": 0.8328866656977514
    },
    "nothing,coin,wall,enemy": {
        "up": 0,
        "right": 5.9902283517872945,
        "down": -0.3701613283493175,
        "left": 0,
        "nothing": -0.15512527181134142
    },
    "nothing,nothing,wall,enemy": {
        "up": -1.2750230571317278,
        "right": -3.310464668865787,
        "down": -3.634334953291696,
        "left": -32.362241400604944,
        "nothing": -3.2700957590815123
    },
    "nothing,wall,wall,enemy": {
        "up": -3.479400654352515,
        "right": -3.766651815645053,
        "down": -3.8052706593046426,
        "left": -40.009397995729095,
        "nothing": -3.384260517443792
    },
    "enemy,nothing,wall,wall": {
        "up": -40.529133873810466,
        "right": -0.8125474754895994,
        "down": -4.110095269957009,
        "left": -4.328162560366963,
        "nothing": -2.7759340763669007
    },
    "enemy,wall,nothing,coin": {
        "up": -15.70385449841273,
        "right": 1.2609474826853697,
        "down": -0.8763915132083611,
        "left": 3.665704964713566,
        "nothing": 1.925910457055552
    },
    "enemy,nothing,nothing,wall": {
        "up": -42.74524952245004,
        "right": 0.4109011508821747,
        "down": -3.892490054599488,
        "left": -4.617768614136258,
        "nothing": -2.4076093768597966
    },
    "enemy,wall,enemy,nothing": {
        "up": -8.972989990389427,
        "right": -2.276369853510798,
        "down": -15.778712149371927,
        "left": -1.6028377043387356,
        "nothing": -1.5187612927356846
    },
    "nothing,enemy,big_coin,wall": {
        "up": -0.48486627128059717,
        "right": -15.828609337235118,
        "down": 1.3266464994048364,
        "left": 0,
        "nothing": -0.2
    },
    "coin,wall,enemy,nothing": {
        "up": 6.171329604850126,
        "right": 0.07783430716130146,
        "down": -25.906433443774667,
        "left": -0.29926371573904603,
        "nothing": 0.6553772432318361
    },
    "enemy,nothing,coin,wall": {
        "up": -30.76207544292528,
        "right": -1.0894446999737013,
        "down": 5.683424480212319,
        "left": 0.12786488968020682,
        "nothing": -0.2
    },
    "nothing,wall,coin,enemy": {
        "up": -2.390821153331415,
        "right": 2.2085823252239356,
        "down": 6.398206089483462,
        "left": -15.965299187277704,
        "nothing": 3.7228329813623904
    },
    "enemy,coin,nothing,wall": {
        "up": -8.691766971985158,
        "right": 3.8786312571738977,
        "down": -0.9000755021594624,
        "left": 1.2861359931088945,
        "nothing": 1.9451437325248593
    },
    "wall,wall,enemy,nothing": {
        "up": -4.49140361558686,
        "right": -4.1568962442997215,
        "down": -37.89987158280973,
        "left": -1.2864272443854787,
        "nothing": -3.817568038632273
    },
    "enemy,coin,wall,nothing": {
        "up": -33.48532114044792,
        "right": 6.157714733904725,
        "down": -1.4223550919397576,
        "left": -0.9859078154140604,
        "nothing": 1.2620906981780524
    },
    "wall,nothing,enemy,nothing": {
        "up": -4.054620469838686,
        "right": -3.81610414507906,
        "down": -32.26803790125556,
        "left": -1.0836487604959815,
        "nothing": -3.721604982466034
    },
    "nothing,enemy,wall,nothing": {
        "up": 0.006501077666577926,
        "right": -42.75065200219635,
        "down": -3.608518744374425,
        "left": -3.1285090778116755,
        "nothing": -3.08979428472998
    },
    "coin,nothing,wall,enemy": {
        "up": 5.688779115118908,
        "right": 0,
        "down": 0,
        "left": -8.789215755104767,
        "nothing": -0.2
    },
    "wall,wall,nothing,enemy": {
        "up": -4.048960831660588,
        "right": -4.3550408542926595,
        "down": -2.5186911833060703,
        "left": -36.31671951109253,
        "nothing": -3.678995290541042
    },
    "enemy,wall,coin,nothing": {
        "up": -8.866917662114599,
        "right": -0.4,
        "down": 5.701060681013654,
        "left": 0.9574724163930985,
        "nothing": -0.2
    },
    "wall,nothing,enemy,enemy": {
        "up": -1.15264,
        "right": -1.1674775713613004,
        "down": -8.722709184905709,
        "left": -8.700854285511955,
        "nothing": -1.2427626094592001
    },
    "nothing,wall,big_coin,nothing": {
        "up": -0.07233558507879544,
        "right": -0.5863598621492134,
        "down": 2.742388586069791,
        "left": -0.3965341272550915,
        "nothing": 0
    },
    "enemy,nothing,wall,coin": {
        "up": -8.869998803380518,
        "right": -0.761425925533836,
        "down": 0.11200397081276414,
        "left": 6.088554156320038,
        "nothing": 0.3136718214369348
    },
    "nothing,enemy,wall,coin": {
        "up": 0,
        "right": -22.761309441295488,
        "down": 0.10059364263070024,
        "left": 5.399861158235254,
        "nothing": 0
    },
    "wall,enemy,nothing,enemy": {
        "up": -1.9797440000000002,
        "right": -8.6648467639068,
        "down": -1.368023700843077,
        "left": -8.659079238020325,
        "nothing": -1.2846660352000001
    },
    "enemy,wall,wall,nothing": {
        "up": -25.885214417990785,
        "right": -4.254872500107696,
        "down": -4.2168861480786575,
        "left": -3.802567440313186,
        "nothing": -3.3911270967498064
    },
    "wall,enemy,coin,nothing": {
        "up": -0.6534857811775764,
        "right": -29.212834556683546,
        "down": 5.436711895275374,
        "left": -1.034118560420711,
        "nothing": -0.2
    },
    "enemy,wall,nothing,nothing": {
        "up": -34.60659345182776,
        "right": -4.308286017489448,
        "down": -3.783132751824145,
        "left": -0.8882078676895266,
        "nothing": -2.805009782213581
    },
    "wall,enemy,wall,coin": {
        "up": -0.4,
        "right": -8.840169424080743,
        "down": 0,
        "left": 5.711761856153481,
        "nothing": 1.6489898020807638
    },
    "wall,enemy,nothing,nothing": {
        "up": -3.9464210914260534,
        "right": -15.85557570144767,
        "down": -2.3725387588748497,
        "left": -2.559813057712807,
        "nothing": -3.1062939176682156
    },
    "nothing,enemy,wall,enemy": {
        "up": -2.091992265815178,
        "right": -15.649191928213131,
        "down": -1.15264,
        "left": -15.910390167881232,
        "nothing": -0.923136512
    },
    "nothing,enemy,enemy,wall": {
        "up": 0,
        "right": 0,
        "down": 0,
        "left": 0,
        "nothing": 0
    },
    "enemy,nothing,enemy,wall": {
        "up": -15.602632832514999,
        "right": -1.7677444296505933,
        "down": -8.651677317524141,
        "left": -1.7961044504028871,
        "nothing": -1.929881786536731
    },
    "coin,enemy,wall,enemy": {
        "up": 3.1136435387598995,
        "right": 0,
        "down": 0,
        "left": 0,
        "nothing": 0
    },
    "wall,coin,enemy,nothing": {
        "up": 0.15186200170831154,
        "right": 3.3037178440442907,
        "down": -27.184342130109567,
        "left": -1.8395534913436808,
        "nothing": 0.9762235258518026
    },
    "wall,coin,wall,enemy": {
        "up": 0.08886968370539522,
        "right": 5.695664229605279,
        "down": 0.7934824803618473,
        "left": -36.41434406574412,
        "nothing": 0
    },
    "enemy,wall,big_coin,nothing": {
        "up": -8.666509313495732,
        "right": -0.6618111478396573,
        "down": 2.3881403519477455,
        "left": -1.2114313397580716,
        "nothing": 0
    },
    "enemy,wall,enemy,wall": {
        "up": -30.682559129056287,
        "right": -3.11269643608064,
        "down": -21.317550504633914,
        "left": -2.716788155022312,
        "nothing": -2.657544434642367
    },
    "enemy,enemy,wall,wall": {
        "up": -8.670498793357735,
        "right": -8.656007967871743,
        "down": -0.4,
        "left": -0.7200000000000001,
        "nothing": -0.6699999999999999
    },
    "wall,enemy,wall,enemy": {
        "up": -1.4209689600000002,
        "right": -25.5611022203757,
        "down": -1.6663999999999999,
        "left": -30.614381105706933,
        "nothing": -1.59196612992
    },
    "wall,enemy,enemy,nothing": {
        "up": -0.7840000000000001,
        "right": -8.666692094744418,
        "down": -8.739175711333667,
        "left": -1.1312710239058665,
        "nothing": -0.7237760000000001
    },
    "enemy,wall,coin,wall": {
        "up": 0,
        "right": 1.05670624527568,
        "down": 6.030811078136267,
        "left": 0,
        "nothing": 2.3767904545732974
    },
    "enemy,wall,nothing,enemy": {
        "up": -8.715860701611804,
        "right": -1.86096,
        "down": -0.7331305623377194,
        "left": -15.681980323122522,
        "nothing": -0.5456000000000001
    },
    "enemy,enemy,nothing,wall": {
        "up": -8.75744779527678,
        "right": 0,
        "down": -0.44058960252329094,
        "left": -0.4,
        "nothing": -0.5
    },
    "enemy,nothing,wall,enemy": {
        "up": -8.83385131309154,
        "right": -0.7381018922702204,
        "down": -1,
        "left": 0,
        "nothing": 0
    },
    "enemy,coin,wall,wall": {
        "up": 0,
        "right": 5.721900302188491,
        "down": -0.4,
        "left": -0.4,
        "nothing": 0
    },
    "nothing,wall,enemy,enemy": {
        "up": 0,
        "right": 0,
        "down": -8.661144662317978,
        "left": 0,
        "nothing": -0.5
    },
    "wall,wall,coin,enemy": {
        "up": -1,
        "right": 0,
        "down": 0,
        "left": 0,
        "nothing": -0.5
    },
    "wall,wall,enemy,enemy": {
        "up": 0,
        "right": -1,
        "down": -22.924468801506563,
        "left": 0,
        "nothing": 0
    },
    "coin,wall,big_coin,enemy": {
        "up": 0,
        "right": 0,
        "down": 2.0890377155490145,
        "left": 0,
        "nothing": 0
    },
    "coin,wall,enemy,enemy": {
        "up": 0,
        "right": 0,
        "down": 0,
        "left": -22.812243142735532,
        "nothing": -0.5
    },
    "wall,coin,coin,enemy": {
        "up": 1.468858849242751,
        "right": 3.2530572902706147,
        "down": 5.602158961218408,
        "left": -22.739810731216085,
        "nothing": 2.1376432632797213
    },
    "enemy,wall,wall,coin": {
        "up": -22.748171609460293,
        "right": -1,
        "down": -1,
        "left": 0,
        "nothing": -0.5
    },
    "wall,enemy,coin,coin": {
        "up": -1,
        "right": -22.754383805883254,
        "down": 5.68574398635975,
        "left": 3.1147735743118563,
        "nothing": 0
    },
    "coin,wall,wall,enemy": {
        "up": 5.447244426535853,
        "right": 0,
        "down": 0,
        "left": -34.19901000371818,
        "nothing": 0
    },
    "coin,enemy,big_coin,wall": {
        "up": 0,
        "right": 0,
        "down": 0,
        "left": -1,
        "nothing": 0
    },
    "enemy,coin,coin,wall": {
        "up": 0,
        "right": 4.03621440694443,
        "down": 0,
        "left": -1,
        "nothing": 0
    },
    "enemy,coin,wall,coin": {
        "up": 0,
        "right": 0,
        "down": 0,
        "left": 1.6852343213987229,
        "nothing": -0.5
    },
    "coin,wall,coin,enemy": {
        "up": 0,
        "right": -1,
        "down": 0,
        "left": 0,
        "nothing": 0
    },
    "coin,wall,enemy,coin": {
        "up": 4.520188725219679,
        "right": 0,
        "down": 0,
        "left": 0,
        "nothing": 0
    },
    "wall,coin,enemy,coin": {
        "up": 0,
        "right": 0,
        "down": 0,
        "left": 5.443169132065105,
        "nothing": 0
    },
    "enemy,enemy,wall,nothing": {
        "up": -22.763822087556754,
        "right": 0,
        "down": 0,
        "left": 0,
        "nothing": 0
    },
    "wall,enemy,coin,wall": {
        "up": -1,
        "right": 0,
        "down": 0,
        "left": -1,
        "nothing": -0.5
    },
    "wall,wall,enemy,coin": {
        "up": 0,
        "right": 0,
        "down": 0,
        "left": 2.6944032353943452,
        "nothing": 0
    },
    "wall,enemy,coin,enemy": {
        "up": 0,
        "right": 0,
        "down": 0,
        "left": 0,
        "nothing": -0.5
    },
    "coin,coin,enemy,wall": {
        "up": 2.783550445472522,
        "right": 0,
        "down": -22.75626112244461,
        "left": 0,
        "nothing": 0
    },
    "enemy,wall,coin,coin": {
        "up": 0,
        "right": -1,
        "down": 0,
        "left": 3.1543969881578326,
        "nothing": 0
    },
    "coin,enemy,coin,wall": {
        "up": 3.2081736716804836,
        "right": 0,
        "down": 0,
        "left": 0,
        "nothing": 0
    },
    "coin,enemy,enemy,wall": {
        "up": 0,
        "right": -22.79929998116187,
        "down": 0,
        "left": 0,
        "nothing": 0
    }
}`;
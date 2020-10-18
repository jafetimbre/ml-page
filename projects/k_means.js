export default class test {
    constructor() {
        
    }
    scetch = p => {
        p.setup = () => {
            p.frameRate(30);
            this.canvas = p.createCanvas(800, 500);
        };
        p.draw = () => {
            p.rect(20, 20, 100, 100)
            p.background(220);
        };
    };
}
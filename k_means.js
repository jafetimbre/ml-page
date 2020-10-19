class k_means {
    constructor() {
        this.view = {
            width: 900,
            height: 600,
            backgroundColor: 255,
            padding: 40,
            canvas: null,
            p: null,
            running: false,
            hovered: false,
            offsetY: Math.floor(this.height / 2),
        };
        this.clusterColors = {
            0: 'black',
            1: 'blue',
            2: 'red',
            3: 'green',
            4: 'magenta',
        };
        this.defaultParams = {
            nr_points: 50,
            k_value: 2,
            dist_f: 'euclid'
        };

        this.k = 2;
        this.dist_f = 'euclid';
        this.points = [];
        this.centroids = [];

        this.next_step = -1;
        this.exit = false;
        this.text = '';

        this.init(this.defaultParams);
    };

    init(params = this.defaultParams) {
        if (params.nr_points) this.points = this.generatePoints(params.nr_points);

        if (!params.k_value) this.k = this.defaultParams.k_value;
        else this.k = params.k_value;

        if (!params.dist_f) this.dist_f = this.defaultParams.dist_f;
        else this.dist_f = params.dist_f;

        this.next_step = -1;
        this.dist_f = 'euclid';
        this.centroids = [];
        this.exit = false;
        this.text = '';
    };
    start() {
        this.view.p.loop();
    };
    stop() {
        this.view.p.noLoop();
    };

    sketch = p => {
        p.setup = () => {
            p.frameRate(30);
            this.view.canvas = p.createCanvas(this.view.width, this.view.height);
            this.view.p = p;
            p.background(this.view.backgroundColor);
        };
        p.draw = () => {
            p.background(this.view.backgroundColor);
            this.drawClusters();
            this.drawPoints(this.points, this.centroids);
            this.drawScales();
            this.drawText(this.text);
            this.stop();
        };
    };

    drawPoints(points, centroids) {
        points.forEach(point => {
            this.view.p.strokeWeight(10);
            this.view.p.stroke(this.clusterColors[point.cluster])
            this.view.p.point(this.transX(point.x), this.transY(point.y));
        })
        if (centroids) {
            centroids.forEach(centroid => {
                this.view.p.strokeWeight(3);
                this.view.p.stroke('black')
                this.view.p.rectMode(this.view.p.CENTER);
                this.view.p.fill(this.clusterColors[centroid.cluster])
                this.view.p.square(this.transX(centroid.x), this.transY(centroid.y), 13)
            })
        }
    };

    generatePoints(nrPoints) {
        let result = []
        for (let i = 0; i < nrPoints; ++i) {
            let newX = (Math.random() * 16) + 0.1;
            let newY = (Math.random() * 10) + 0.1;
            result[i] = { x: newX, y: newY, cluster: 0 }
        }
        return result
    };

    drawScales() {
        var step = 5;
        this.view.p.stroke(10);
        this.view.p.fill(10);
        this.view.p.textSize(12);
        this.view.p.strokeWeight(1);
        //  vertical axis
        this.view.p.textAlign(this.view.p.RIGHT, this.view.p.CENTER);
        this.view.p.line(this.view.padding, this.view.padding, this.view.padding, this.view.height - this.view.padding);
        this.view.p.line(this.view.padding, this.view.padding, this.view.padding - 5, this.view.padding + 5);
        this.view.p.line(this.view.padding, this.view.padding, this.view.padding + 5, this.view.padding + 5);
        for (var i = this.view.height - this.view.padding; i >= this.view.padding + 20; i -= step) {
            if ((i - 10) % 50 == 0) {
                this.view.p.line(this.view.padding, i, this.view.padding - 12, i);
                this.view.p.text(Math.abs(i - (this.view.height - this.view.padding)) / 50, this.view.padding - 15, i);
            } else {
                this.view.p.line(this.view.padding, i, this.view.padding - 5, i);
            }
        };
        //  horizontal axis
        this.view.p.textAlign(this.view.p.CENTER, this.view.p.CENTER);
        this.view.p.line(this.view.padding, this.view.height - this.view.padding, this.view.width - this.view.padding, this.view.height - this.view.padding);
        this.view.p.line(this.view.width - this.view.padding, this.view.height - this.view.padding, this.view.width - this.view.padding - 5, this.view.height - this.view.padding - 5);
        this.view.p.line(this.view.width - this.view.padding, this.view.height - this.view.padding, this.view.width - this.view.padding - 5, this.view.height - this.view.padding + 5);
        for (var i = this.view.padding; i < this.view.width - this.view.padding - 15; i += step) {
            if ((i - this.view.padding) % 50 == 0) {
                this.view.p.line(i, this.view.height - this.view.padding, i, this.view.height - this.view.padding + 12);
                this.view.p.text((i - this.view.padding) / 50, i, this.view.height - this.view.padding + 20);
            } else {
                this.view.p.line(i, this.view.height - this.view.padding, i, this.view.height - this.view.padding + 5);
            }
        };
    };

    drawText(text) {
        this.view.p.textSize(20);
        this.view.p.text(text, this.view.width/2, 12);
    };

    drawMouse(x, y) {
        this.view.p.strokeWeight(2);
        this.view.p.stroke(255, 0, 0);
        var cX = this.view.p.constrain(x, this.view.padding, this.view.width - 60);
        var cY = this.view.p.constrain(y, 60, this.view.height - this.view.padding);
        this.view.p.line(this.view.padding, cY, this.view.width - this.view.padding, cY);
        this.view.p.line(cX, this.view.height - this.view.padding, cX, this.view.padding);
    };

    transX = x => this.view.p.map(x, 0, 16, this.view.padding, this.view.width - (this.view.padding * 1.5));
    transXInv = x => this.setPrec(this.p.map(x, this.view.padding, this.width - 60, 0, 50), 1);
    transY = y => this.view.p.map(y, 0, 10, this.view.height - this.view.padding, this.view.padding + this.view.padding / 2);
    transYInv = y => this.setPrec(this.p.map(y, this.view.height - this.view.padding, this.view.padding + this.view.padding / 2, 0, 30), 1);
    setPrec = (nr, prec) => Number.parseFloat(nr).toFixed(prec);

    getCentroids(k, initial = false) {
        if (initial) {
            this.centroids = [];
            for (let i = 0; i < k; ++i) {
                let randPoint = Math.floor(Math.random() * this.points.length);
                this.centroids[i] = {
                    x: this.points[randPoint].x,
                    y: this.points[randPoint].y,
                    cluster: i + 1
                }
            }
        }
        else {
            let clusterPointsX = [];
            let clusterPointsY = [];
            let pointCount = [];
            for (let i = 1; i < this.k + 1; ++i) {
                clusterPointsX[i] = 0;
                clusterPointsY[i] = 0;
                pointCount[i] = 0;
            }
            this.points.forEach( point => {
                clusterPointsX[point.cluster] += point.x;
                clusterPointsY[point.cluster] += point.y;
                pointCount[point.cluster] += 1;
            })
            this.centroids.forEach( centroid => {
                centroid.x = clusterPointsX[centroid.cluster] / pointCount[centroid.cluster];
                centroid.y = clusterPointsY[centroid.cluster] / pointCount[centroid.cluster];
            })
        }
    }

    assignClusters() {
        let clusterChange = false;
        this.points.forEach( point => {
            let initCluster = point.cluster;
            let minDist = 9999;
            if (this.dist_f == 'euclid') {
                this.centroids.forEach( centroid => {
                    let dist = Math.sqrt(
                        Math.pow(centroid.x - point.x, 2) +
                        Math.pow(centroid.y - point.y, 2));
                    if (dist < minDist) {
                        minDist = dist;
                        point.cluster = centroid.cluster;
                    }
                });
            }
            else {
                this.centroids.forEach( centroid => {
                    let dist = Math.abs(centroid.x - point.x) + Math.abs(centroid.y - point.y);
                    if (dist < minDist) {
                        minDist = dist;
                        point.cluster = centroid.cluster;
                    }
                });
            }
            if (point.cluster != initCluster) {
                clusterChange = true;
            }
        });
        return !clusterChange;
    }

    drawClusters() {
        let maxX = [], maxY = [], minX = [], minY = [];
        this.points.forEach( point => {
            if (!(maxX[point.cluster] > point.x)) maxX[point.cluster] = point.x;
            if (!(maxY[point.cluster] > point.y)) maxY[point.cluster] = point.y;
            if (!(minX[point.cluster] < point.x)) minX[point.cluster] = point.x;
            if (!(minY[point.cluster] < point.y)) minY[point.cluster] = point.y;
        });
        this.centroids.forEach( centroid => {
            let width = maxX[centroid.cluster] - minX[centroid.cluster];
            let height = maxY[centroid.cluster] - minY[centroid.cluster];
            this.view.p.strokeWeight(2);
            this.view.p.stroke(this.clusterColors[centroid.cluster]);
            this.view.p.ellipseMode(this.view.p.CENTER);
            this.view.p.noFill();
            this.view.p.ellipse(this.transX(centroid.x), this.transY(centroid.y), width*60, height*60);
        });
    }

    step() {
        
        if (this.exit) {
            this.text = "Oprire: Nu se observă nici o schimbare a centroidelor";
            this.start();
            return;
        };
        if (this.next_step == -1) {
            this.text = "Pasul 1: Inițializarea centroidelor din setul de puncte";
            this.getCentroids(this.k, true);
        }
        else if ((this.next_step % 2) == 0) {
            this.text = "Pasul 2: Atribuirea punctelor la un anumit centroid";
            this.exit = this.assignClusters();
        }
        else if ((this.next_step % 2) != 0) {
            this.text = "Pasul 3: Actualizarea centroidelor în funcție de puncte";
            this.getCentroids(this.k, false);
        }
        this.next_step += 1;
        this.start();
    }

    fullKMeans() {
        this.getCentroids(this.k, true);
        while(!this.exit) {
            this.exit = this.assignClusters();
            this.getCentroids(this.k, false);
        }
        this.start();
    }
}

let k_means_inst = new k_means();
new p5(k_means_inst.sketch, 'k_means');

let number_control = document.getElementById('numberControl');
let k_select = document.getElementById("k_select");
let dist_select = document.getElementById("dist_select");
let btn_exec_k_means = document.getElementById("execute_k_means");
let btn_step_k_means = document.getElementById("step_k_means");
let btn_reset_k_means = document.getElementById("reset_k_means");

number_control.addEventListener('input', e => {
    k_means_inst.init({ 
        nr_points: e.target.value, 
        k_value: k_select.value,
        dist_f: dist_select.value
    });
    reset();
    k_means_inst.start();
}, false);

k_select.addEventListener("change", e => {
    if (btn_exec_k_means.disabled) {
        k_means_inst.init({
            nr_points: number_control.value,
            k_value: e.target.value,
            dist_f: dist_select.value
        });
    }
    else {
        k_means_inst.init({
            k_value: e.target.value,
            dist_f: dist_select.value
        });
    }
    reset();
});

dist_select.addEventListener("change", e => {
    if (btn_exec_k_means.disabled) {
        k_means_inst.init({
            nr_points: number_control.value,
            k_value: k_select.value,
            dist_f: e.target.value
        });
    }
    else {
        k_means_inst.init({ 
            k_value: k_select.value,
            dist_f: e.target.value
        });
    }
    reset();
});

btn_exec_k_means.addEventListener("click", e => {
    k_means_inst.fullKMeans();
    btn_exec_k_means.disabled = true;
    btn_step_k_means.disabled = true;
});
document.getElementById("step_k_means").addEventListener("click", e => {
    k_means_inst.step();
    btn_exec_k_means.disabled = true;
});
btn_reset_k_means.addEventListener("click", e => {
    k_means_inst.init({
        nr_points: number_control.value, 
        k_value: k_select.value,
        dist_f: dist_select.value
    });
    reset();
});

function reset() {
    btn_exec_k_means.disabled = false;
    btn_step_k_means.disabled = false;
    k_means_inst.start();
}

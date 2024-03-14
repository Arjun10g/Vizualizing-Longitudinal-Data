document.addEventListener("DOMContentLoaded", function() {
    let outer = document.querySelector(".inner"),
        outerWidth = parseInt(window.getComputedStyle(outer).width),
        outerHeight = parseInt(window.getComputedStyle(outer).height),
        margin = { top: 20, right: 30, bottom: 30, left: 70 },
        width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;

    const svg = d3.select(".graph").append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("https://raw.githubusercontent.com/Arjun10g/csv-file/main/health_cleaned.csv", d => {
        return {
            ...d,
            ref_date: d3.timeParse("%Y")(d.ref_date),
            value: +d.value
        };
    }).then(data => {
        const indicators = [...new Set(data.map(d => d.indicators))];
        const characteristics = [...new Set(data.map(d => d.characteristics))];
        const selectIndicator = document.getElementById('indicatorSelect');
        const selectCharacteristics = document.getElementById('characteristicsSelect');

        indicators.forEach(indicator => {
            let option = new Option(indicator, indicator);
            selectIndicator.add(option);
        });

        characteristics.forEach(characteristic => {
            let option = new Option(characteristic, characteristic);
            selectCharacteristics.add(option);
        });

        function updateVisualization(selectedIndicator, selectedCharacteristic) {
            const filteredData = data.filter(d => d.indicators === selectedIndicator && d.characteristics === selectedCharacteristic && d['age.group'] === '12 to 17 years');

            const x = d3.scaleTime()
                .domain(d3.extent(filteredData, d => d.ref_date))
                .range([0, width]);
        
            const maxValue = d3.max(filteredData, d => d.value);
            const buffer = maxValue * 0.05;
        
            const y = d3.scaleLinear()
                .domain([d3.min(filteredData, d => d.value), maxValue + buffer])
                .range([height, 0]);

            svg.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', width)
                .attr('height', height)
                .attr('fill', 'pink')
                .attr('opacity', 0.1);

            const xAxis = svg.select(".x-axis").call(d3.axisBottom(x));
            const yAxis = svg.select(".y-axis").call(d3.axisLeft(y));

            // Append x-axis if it doesn't exist
            if (xAxis.empty()) {
                svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", `translate(0,${height})`)
                    .call(d3.axisBottom(x));
            }

            // Append y-axis if it doesn't exist
            if (yAxis.empty()) {
                svg.append("g")
                    .attr("class", "y-axis")
                    .call(d3.axisLeft(y));
            }

            const line = d3.line()
                .x(d => x(d.ref_date))
                .y(d => y(d.value));

            let path = svg.selectAll(".line-path")
                .data([filteredData]);

            path.enter().append("path")
                .attr("class", "line-path")
                .merge(path)
                .transition().duration(1000)
                .attr("d", line)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 5.5);
        }

        // Initial update
        updateVisualization(selectIndicator.value, selectCharacteristics.value);

        // Update on user interaction
        selectIndicator.addEventListener('change', () => {
            updateVisualization(selectIndicator.value, selectCharacteristics.value);
        });

        selectCharacteristics.addEventListener('change', () => {
            updateVisualization(selectIndicator.value, selectCharacteristics.value);
        });
    });
});


let cont = document.querySelector("#heart");
let intro = document.querySelector(".intro");
let content = document.querySelector(".content");

// Write function to close cont
function closeCont() {
    cont.style.display = "none";
    intro.style.display = "none";
}


console.log(cont);

let tl = gsap.timeline();

tl.from(cont, {duration: 8,  ease: "steps(12)", repeat:4, yoyo:true, repeatDelay: 0.25})
.to(cont, {duration:3, opacity:0, ease: "power1.in", onComplete: closeCont})
.fromTo(content, {opacity: 0}, {opacity: 1,duration: 1, ease: "power1.in"});

window.requestAnimationFrame =
    window.__requestAnimationFrame ||
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        (function () {
            return function (callback, element) {
                var lastTime = element.__lastTime;
                if (lastTime === undefined) {
                    lastTime = 0;
                }
                var currTime = Date.now();
                var timeToCall = Math.max(1, 33 - (currTime - lastTime));
                window.setTimeout(callback, timeToCall);
                element.__lastTime = currTime + timeToCall;
            };
        })();
window.isDevice = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(((navigator.userAgent || navigator.vendor || window.opera)).toLowerCase()));
var loaded = false;
var init = function () {
    if (loaded) return;
    loaded = true;
    var mobile = window.isDevice;
    var koef = mobile ? 0.5 : 1;
    var canvas = document.getElementById('heart');
    var ctx = canvas.getContext('2d');
    var width = canvas.width = koef * innerWidth;
    var height = canvas.height = koef * innerHeight;
    var rand = Math.random;
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);

    var heartPosition = function (rad) {
        //return [Math.sin(rad), Math.cos(rad)];
        return [Math.pow(Math.sin(rad), 3), -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))];
    };
    var scaleAndTranslate = function (pos, sx, sy, dx, dy) {
        return [dx + pos[0] * sx, dy + pos[1] * sy];
    };

    window.addEventListener('resize', function () {
        width = canvas.width = koef * innerWidth;
        height = canvas.height = koef * innerHeight;
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, 0, width, height);
    });

    var traceCount = mobile ? 20 : 50;
    var pointsOrigin = [];
    var i;
    var dr = mobile ? 0.3 : 0.1;
    for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
    for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
    for (i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
    var heartPointsCount = pointsOrigin.length;

    var targetPoints = [];
    var pulse = function (kx, ky) {
        for (i = 0; i < pointsOrigin.length; i++) {
            targetPoints[i] = [];
            targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
            targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
        }
    };

    var e = [];
    for (i = 0; i < heartPointsCount; i++) {
        var x = rand() * width;
        var y = rand() * height;
        e[i] = {
            vx: 0,
            vy: 0,
            R: 2,
            speed: rand() + 5,
            q: ~~(rand() * heartPointsCount),
            D: 2 * (i % 2) - 1,
            force: 0.2 * rand() + 0.7,
            f: "hsla(0," + ~~(40 * rand() + 60) + "%," + ~~(60 * rand() + 20) + "%,.3)",
            trace: []
        };
        for (var k = 0; k < traceCount; k++) e[i].trace[k] = {x: x, y: y};
    }

    var config = {
        traceK: 0.4,
        timeDelta: 0.01
    };

    var time = 0;
    var loop = function () {
        var n = -Math.cos(time);
        pulse((1 + n) * .5, (1 + n) * .5);
        time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? .2 : 1) * config.timeDelta;
        ctx.fillStyle = "rgba(0,0,0,.1)";
        ctx.fillRect(0, 0, width, height);
        for (i = e.length; i--;) {
            var u = e[i];
            var q = targetPoints[u.q];
            var dx = u.trace[0].x - q[0];
            var dy = u.trace[0].y - q[1];
            var length = Math.sqrt(dx * dx + dy * dy);
            if (10 > length) {
                if (0.95 < rand()) {
                    u.q = ~~(rand() * heartPointsCount);
                }
                else {
                    if (0.99 < rand()) {
                        u.D *= -1;
                    }
                    u.q += u.D;
                    u.q %= heartPointsCount;
                    if (0 > u.q) {
                        u.q += heartPointsCount;
                    }
                }
            }
            u.vx += -dx / length * u.speed;
            u.vy += -dy / length * u.speed;
            u.trace[0].x += u.vx;
            u.trace[0].y += u.vy;
            u.vx *= u.force;
            u.vy *= u.force;
            for (k = 0; k < u.trace.length - 1;) {
                var T = u.trace[k];
                var N = u.trace[++k];
                N.x -= config.traceK * (N.x - T.x);
                N.y -= config.traceK * (N.y - T.y);
            }
            ctx.fillStyle = u.f;
            for (k = 0; k < u.trace.length; k++) {
                ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
            }
        }
        //ctx.fillStyle = "rgba(255,255,255,1)";
        //for (i = u.trace.length; i--;) ctx.fillRect(targetPoints[i][0], targetPoints[i][1], 2, 2);

        window.requestAnimationFrame(loop, canvas);
    };
    loop();
};

var s = document.readyState;
if (s === 'complete' || s === 'loaded' || s === 'interactive') init();
else document.addEventListener('DOMContentLoaded', init, false);



let lists = document.querySelectorAll('.info');

lists.forEach(list => {
    list.addEventListener('click', () => {
        gsap.to(list, {opacity: 0,duration: 1});
        gsap.set(list, {display: 'none', delay: 1});
    })
});
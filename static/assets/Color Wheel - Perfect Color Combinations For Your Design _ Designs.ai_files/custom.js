var deg = [];
var radii = [];
var all_divs = [];

wheel_colors.push("#ffffff");
var len = wheel_colors.length;

drawCircle();
if (len > 1) {

    while (len < 5) {
        wheel_colors.push("#ffffff");
        len = len + 1;
    }
    for (var i = 0; i < len; i++) {
        var rgb = chroma(wheel_colors[i]).rgb();
        var hsv = rgb2hsv(rgb[0], rgb[1], rgb[2]);
        values[i] = hsv[2];
        div = new Div(0, 0);
        [div.x, div.y] = polar2xy(radius * hsv[1], deg2rad(hsv[0]));
        div.x += radius;
        div.y += radius;
        all_divs.push(div);
        essential1(i, rgb);

    }
    wheel_colors = [];
} else {
    deg = [0, 72, 144, 216, 288];
    radii = [100, 100, 100, 100, 100];
    setup();
}

function setup() {
    $('.circles').show();
    $(".circles").css("border", "3px solid white");
    ctx2.clearRect(0, 0, width, height);
    for (var i = 0; i < num_divs; i++) {
        div = new Div(0, 0);
        [div.x, div.y] = analogous1(initial_x, initial_y, deg[i], radii[i]);
        all_divs.push(div);
        essential(i);
    }
    wheel_colors = [];
}

$(document).unbind("mousemove");

$(document).mousemove(function(e) {

    canvasOffset = $("#mycanvas").offset();
    offsetX = canvasOffset.left;
    offsetY = canvasOffset.top;

    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);
    mouseY += $(document).scrollTop();

    var actualX = mouseX - div_radius;
    var actualY = mouseY - div_radius;
    var x = Math.abs(radius - mouseX);
    var y = Math.abs(radius - mouseY);
    var r = Math.sqrt(x * x + y * y);

    if (mover != 0) {

        if (r > radius) {
            [mouseX, mouseY] = analogous1(mouseX, mouseY, 0, 150);
        }

        if (flag == 1) {
            mouseX = xslider;
            mouseY = yslider;
        }

        ctx2.clearRect(0, 0, width, height);
        all_divs[mover - 1].x = mouseX;
        all_divs[mover - 1].y = mouseY;
        for (var i = 0; i < num_divs; i++) {
            if ((i + 1) == mover) {
                essential(i);
            }
            drawLine(all_divs[i].x - div_radius, all_divs[i].y - div_radius);
        }

    }

}); // call the handler immediately

$(document).unbind("touchmove");
$(document).bind('touchmove', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    var x = touch.pageX,
        y = touch.pageY;

    canvasOffset = $("#mycanvas").offset();
    offsetX = canvasOffset.left;
    offsetY = canvasOffset.top;

    mouseX = parseInt(x - offsetX);
    mouseY = parseInt(y - offsetY);

    console.log("x " + mouseX);
    console.log("y " + mouseY);

    var actualX = mouseX - div_radius;
    var actualY = mouseY - div_radius;
    var x = Math.abs(radius - mouseX);
    var y = Math.abs(radius - mouseY);
    var r = Math.sqrt(x * x + y * y);

    if (mover != 0) {

        if (r > radius) {
            [mouseX, mouseY] = analogous1(mouseX, mouseY, 0, 150);
        }

        if (flag == 1) {
            mouseX = xslider;
            mouseY = yslider;
            console.log("x " + mouseX);
            console.log("y " + mouseY);
        }

        ctx2.clearRect(0, 0, width, height);
        all_divs[mover - 1].x = mouseX;
        all_divs[mover - 1].y = mouseY;
        for (var i = 0; i < num_divs; i++) {
            if ((i + 1) == mover) {
                essential(i);
            }
            drawLine(all_divs[i].x - div_radius, all_divs[i].y - div_radius);
        }

    }

}); // call the handler immediately

function manualSetup(hexColor, ind) {
    var rgb = chroma(hexColor).rgb();
    var hsv = rgb2hsv(rgb[0], rgb[1], rgb[2]);
    values[i] = hsv[2];
    [newX, newY] = polar2xy(radius * hsv[1], deg2rad(hsv[0]));
    newX += radius;
    newY += radius;

    mover = ind;

    ctx2.clearRect(0, 0, width, height);

    all_divs[mover - 1].x = newX;
    all_divs[mover - 1].y = newY;

    for (var i = 0; i < num_divs; i++) {
        if ((i + 1) == mover) {
            essential1(i, rgb);
        }
        drawLine(all_divs[i].x - div_radius, all_divs[i].y - div_radius);
    }

    mover = 0;

}
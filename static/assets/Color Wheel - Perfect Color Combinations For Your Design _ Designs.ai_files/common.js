//variables start

var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext("2d");

var canvas2 = document.getElementById('controlcanvas');
var ctx2 = canvas2.getContext("2d");
ctx2.strokeStyle = "white";

var centerC = 150;
var radius = 150;
var width = 300;
var height = 300;
var div_radius = 15;
var num_divs = 5;
var canvasOffset = $("#mycanvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var centerX = offsetX + radius;
var centerY = offsetY + radius;
var initial_x = 50;
var initial_y = 50;
var value = 1;
var mode = "rgba";
var flag = 0;
var xslider = 0;
var yslider = 0;
var mover = 0;
var values = [1, 1, 1, 1, 1];

var Div = function(x, y) {
    this.x = x;
    this.y = y;
};

//variables end

//functions start

function drawLine(x, y) {
    ctx2.beginPath();
    ctx2.moveTo(centerC, centerC);
    ctx2.lineTo(x + div_radius, y + div_radius);
    ctx2.stroke();

}

function drawCircle() {
    var image = ctx.createImageData(2 * radius, 2 * radius);
    var data = image.data;

    for (var x = -radius; x < radius; x++) {
        for (var y = -radius; y < radius; y++) {

            var [r, phi] = xy2polar(x, y);

            if (r > radius) {
                // skip all (x,y) coordinates that are outside of the circle
                continue;
            }

            var deg = rad2deg(phi);

            // Figure out the starting index of this pixel in the image data array.
            var rowLength = 2 * radius;
            var adjustedX = x + radius; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
            var adjustedY = y + radius; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
            var pixelWidth = 4; // each pixel requires 4 slots in the data array
            var index = (adjustedX + (adjustedY * rowLength)) * pixelWidth;

            var hue = deg;
            var saturation = r / radius;

            var [red, green, blue] = hsv2rgb(hue, saturation, value);
            var alpha = 255;

            data[index] = red;
            data[index + 1] = green;
            data[index + 2] = blue;
            data[index + 3] = alpha;
        }
    }

    ctx.putImageData(image, 0, 0);
}

function xy2polar(x, y) {
    var r = Math.sqrt(x * x + y * y);
    var phi = Math.atan2(y, x);
    return [r, phi];
}

// rad in [-π, π] range
// return degree in [0, 360] range
function rad2deg(rad) {
    return ((rad + Math.PI) / (2 * Math.PI)) * 360;
}

function polar2xy(r, phi) {
    var x = parseInt(r * Math.cos(phi));
    var y = parseInt(r * Math.sin(phi));
    return [x, y];
}

function deg2rad(degrees) {
    var pi = Math.PI;
    return (degrees * (pi / 180)) - Math.PI;
}

function xy2rgb(x, y, val) {
    [s, h] = xy2polar(all_divs[move].x - radius, all_divs[move].y - radius);
    h = rad2deg(h);
    s = parseFloat(s) / radius;
    rbg = hsv2rgb(h, s, val);
    return rgb;
}

// hue in range [0, 360]
// saturation, value in range [0,1]
// return [r,g,b] each in range [0,255]
// See: https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
function hsv2rgb(hue, saturation, value) {
    var chroma = value * saturation;
    var hue1 = hue / 60;
    var x = chroma * (1 - Math.abs((hue1 % 2) - 1));
    var r1, g1, b1;
    if (hue1 >= 0 && hue1 <= 1) {
        ([r1, g1, b1] = [chroma, x, 0]);
    } else if (hue1 >= 1 && hue1 <= 2) {
        ([r1, g1, b1] = [x, chroma, 0]);
    } else if (hue1 >= 2 && hue1 <= 3) {
        ([r1, g1, b1] = [0, chroma, x]);
    } else if (hue1 >= 3 && hue1 <= 4) {
        ([r1, g1, b1] = [0, x, chroma]);
    } else if (hue1 >= 4 && hue1 <= 5) {
        ([r1, g1, b1] = [x, 0, chroma]);
    } else if (hue1 >= 5 && hue1 <= 6) {
        ([r1, g1, b1] = [chroma, 0, x]);
    }

    var m = value - chroma;
    var [r, g, b] = [r1 + m, g1 + m, b1 + m];

    // Change r,g,b values from [0,1] to [0,255]
    return [255 * r, 255 * g, 255 * b];
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgb2hex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function rgb2hsv(r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
        diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }
    return [
        Math.round(h * 360),
        percentRoundFn(s),
        percentRoundFn(v)
    ];
}

function analogous(x, y, degree) {
    var [r, phi] = xy2polar(x - radius, y - radius);
    var rad = rad2deg(phi);
    rad = rad + degree;
    phi = deg2rad(rad);
    var [x1, y1] = polar2xy(r, phi);
    return [x1 + radius, y1 + radius];

}

function analogous1(x, y, degree, newr) {
    var [r, phi] = xy2polar(x - radius, y - radius);

    var rad = rad2deg(phi);

    rad = rad + degree;
    phi = deg2rad(rad);

    var [x1, y1] = polar2xy(newr, phi);
    return [x1 + radius, y1 + radius];

}

function analogous2(x, y, degree, x1, y1) {
    var [rn, phin] = xy2polar(x1 - radius, y1 - radius);

    var [r, phi] = xy2polar(x - radius, y - radius);
    var rad = rad2deg(phi);
    rad = rad + degree;
    phi = deg2rad(rad);

    var [x1, y1] = polar2xy(rn, phi);
    return [x1 + radius, y1 + radius];

}

function getrad(x, y) {
    var [r, phi] = xy2polar(x - radius, y - radius);
    return Math.ceil(r);
}

function getdeg(x, y) {
    var [r, phi] = xy2polar(x - radius, y - radius);
    var rad = rad2deg(phi);
    return parseInt(rad);
}

function essential(move) {

    [s, h] = xy2polar(all_divs[move].x - radius, all_divs[move].y - radius);
    h = rad2deg(h);
    s = parseFloat(s) / radius;
    
    [red, green, blue] = hsv2rgb(h, s, values[move]);
    red = Math.ceil(red);
    blue = Math.ceil(blue);
    green = Math.ceil(green);
    var vals = [red, green, blue];
    $("#c" + (move + 1)).css({
        "top": (all_divs[move].y - div_radius) + "px",
        "left": (all_divs[move].x - div_radius) + "px"
    });
    $("#c" + (move + 1)).css("background-color", "rgb(" + red + "," + green + "," + blue + ")");
    $("#pal" + (move + 1)).css("background-color", "rgb(" + red + "," + green + "," + blue + ")");

    drawLine(all_divs[move].x - div_radius, all_divs[move].y - div_radius);
    $("#hex" + (move + 1) + " input").val(chroma(red, green, blue).hex());

    ss = move + 1;

    if (flag === 0) {
        for (var i = 1; i <= 3; i++) {
            var slidy = "#c" + ss + "_" + i;
            $(slidy + " input").val(vals[i - 1]);
            $(slidy + " input").next().html(vals[i - 1]);

        }

        var vals = rgb2hsv(red, green, blue);

        for (var i = 1; i <= 3; i++) {
            var slidy = "#c" + ss + "_" + i + "h";
            $(slidy + " input").val(vals[i - 1]);
            $(slidy + " input").next().html(vals[i - 1]);

        }

        var vals = chroma.rgb(red, green, blue).cmyk();
        for (var i = 1; i <= 4; i++) {
            var slidy = "#c" + ss + "_" + i + "c";
            $(slidy + " input").val((vals[i - 1] * 100).toFixed(2));
            $(slidy + " input").next().html((vals[i - 1] * 100).toFixed(0));

        }
    } else if (flag === 1) {
        if ((mover - 1) != move) {
            for (var i = 1; i <= 3; i++) {
                var slidy = "#c" + ss + "_" + i;
                $(slidy + " input").val(vals[i - 1]);
                $(slidy + " input").next().html(vals[i - 1]);

            }

            var vals = rgb2hsv(red, green, blue);

            for (var i = 1; i <= 3; i++) {
                var slidy = "#c" + ss + "_" + i + "h";
                $(slidy + " input").val(vals[i - 1]);
                $(slidy + " input").next().html(vals[i - 1]);

            }

            var vals = chroma.rgb(red, green, blue).cmyk();
            for (var i = 1; i <= 4; i++) {
                var slidy = "#c" + ss + "_" + i + "c";
                $(slidy + " input").val((vals[i - 1] * 100).toFixed(2));
                $(slidy + " input").next().html((vals[i - 1] * 100).toFixed(2));

            }
        }

    }

}

function essential1(move, rgb) {

    
    [red, green, blue] = rgb;
    var vals = [red, green, blue];
    $("#c" + (move + 1)).css({
        "top": (all_divs[move].y - div_radius) + "px",
        "left": (all_divs[move].x - div_radius) + "px"
    });
    $("#c" + (move + 1)).css("background-color", "rgb(" + red + "," + green + "," + blue + ")");
    $("#pal" + (move + 1)).css("background-color", "rgb(" + red + "," + green + "," + blue + ")");

    drawLine(all_divs[move].x - div_radius, all_divs[move].y - div_radius);
    $("#hex" + (move + 1) + " input").val(chroma(red, green, blue).hex());

    ss = move + 1;

    if (flag === 0) {
        for (var i = 1; i <= 3; i++) {
            var slidy = "#c" + ss + "_" + i;
            $(slidy + " input").val(vals[i - 1]);
            $(slidy + " input").next().html(vals[i - 1]);

        }

        var vals = rgb2hsv(red, green, blue);

        for (var i = 1; i <= 3; i++) {
            var slidy = "#c" + ss + "_" + i + "h";
            $(slidy + " input").val(vals[i - 1]);
            $(slidy + " input").next().html(vals[i - 1]);

        }

        var vals = chroma.rgb(red, green, blue).cmyk();
        for (var i = 1; i <= 4; i++) {
            var slidy = "#c" + ss + "_" + i + "c";
            $(slidy + " input").val((vals[i - 1] * 100).toFixed(2));
            $(slidy + " input").next().html((vals[i - 1] * 100).toFixed(0));

        }
    } else if (flag === 1) {
        if ((mover - 1) != move) {
            for (var i = 1; i <= 3; i++) {
                var slidy = "#c" + ss + "_" + i;
                $(slidy + " input").val(vals[i - 1]);
                $(slidy + " input").next().html(vals[i - 1]);

            }

            var vals = rgb2hsv(red, green, blue);

            for (var i = 1; i <= 3; i++) {
                var slidy = "#c" + ss + "_" + i + "h";
                $(slidy + " input").val(vals[i - 1]);
                $(slidy + " input").next().html(vals[i - 1]);

            }

            var vals = chroma.rgb(red, green, blue).cmyk();
            for (var i = 1; i <= 4; i++) {
                var slidy = "#c" + ss + "_" + i + "c";
                $(slidy + " input").val((vals[i - 1] * 100).toFixed(2));
                $(slidy + " input").next().html((vals[i - 1] * 100).toFixed(2));

            }
        }

    }

}

function essential2(move) {
    [s, h] = xy2polar(all_divs[move].x - radius, all_divs[move].y - radius);
    h = rad2deg(h);
    s = parseFloat(s) / radius;
    [red, green, blue] = hsv2rgb(h, s, values[move]);
    red = Math.ceil(red);
    blue = Math.ceil(blue);
    green = Math.ceil(green);
    var vals = [red, green, blue];
    $("#c" + (move + 1)).css({
        "top": (all_divs[move].y - div_radius) + "px",
        "left": (all_divs[move].x - div_radius) + "px"
    });
    $("#c" + (move + 1)).css("background-color", "rgb(" + red + "," + green + "," + blue + ")");
    $("#pal" + (move + 1)).css("background-color", "rgb(" + red + "," + green + "," + blue + ")");

    drawLine(all_divs[0].x - div_radius, all_divs[0].y - div_radius);
    $("#hex" + (move + 1) + " input").val(chroma(red, green, blue).hex());

    ss = move + 1;

    if (flag === 0) {
        for (var i = 1; i <= 3; i++) {
            var slidy = "#c" + ss + "_" + i;
            $(slidy + " input").val(vals[i - 1]);
            $(slidy + " input").next().html(vals[i - 1]);

        }

        var vals = rgb2hsv(red, green, blue);

        for (var i = 1; i <= 3; i++) {
            var slidy = "#c" + ss + "_" + i + "h";
            $(slidy + " input").val(vals[i - 1]);
            $(slidy + " input").next().html(vals[i - 1]);

        }

        var vals = chroma.rgb(red, green, blue).cmyk();
        for (var i = 1; i <= 4; i++) {
            var slidy = "#c" + ss + "_" + i + "c";
            $(slidy + " input").val((vals[i - 1] * 100).toFixed(2));
            $(slidy + " input").next().html((vals[i - 1] * 100).toFixed(2));

        }
    } else if (flag === 1) {
        if ((mover - 1) != move) {
            for (var i = 1; i <= 3; i++) {
                var slidy = "#c" + ss + "_" + i;
                $(slidy + " input").val(vals[i - 1]);
                $(slidy + " input").next().html(vals[i - 1]);

            }

            var vals = rgb2hsv(red, green, blue);

            for (var i = 1; i <= 3; i++) {
                var slidy = "#c" + ss + "_" + i + "h";
                $(slidy + " input").val(vals[i - 1]);
                $(slidy + " input").next().html(vals[i - 1]);

            }

            var vals = chroma.rgb(red, green, blue).cmyk();
            for (var i = 1; i <= 4; i++) {
                var slidy = "#c" + ss + "_" + i + "c";
                $(slidy + " input").val((vals[i - 1] * 100).toFixed(2));
                $(slidy + " input").next().html((vals[i - 1] * 100).toFixed(2));

            }
        }

    }

}

function essential3(move, rgb) {

    [red, green, blue] = rgb;
    red = Math.ceil(red);
    blue = Math.ceil(blue);
    green = Math.ceil(green);
    var vals = [red, green, blue];
    $("#c" + (move + 1)).css({
        "top": (all_divs[move].y - div_radius) + "px",
        "left": (all_divs[move].x - div_radius) + "px"
    });
    $("#c" + (move + 1)).css("background-color", "rgb(" + red + "," + green + "," + blue + ")");
    $("#pal" + (move + 1)).css("background-color", "rgb(" + red + "," + green + "," + blue + ")");

    drawLine(all_divs[0].x - div_radius, all_divs[0].y - div_radius);
    $("#hex" + (move + 1) + " input").val(chroma(red, green, blue).hex());

    ss = move + 1;

    if (flag === 0) {
        for (var i = 1; i <= 3; i++) {
            var slidy = "#c" + ss + "_" + i;
            $(slidy + " input").val(vals[i - 1]);
            $(slidy + " input").next().html(vals[i - 1]);

        }

        var vals = rgb2hsv(red, green, blue);

        for (var i = 1; i <= 3; i++) {
            var slidy = "#c" + ss + "_" + i + "h";
            $(slidy + " input").val(vals[i - 1]);
            $(slidy + " input").next().html(vals[i - 1]);

        }

        var vals = chroma.rgb(red, green, blue).cmyk();
        for (var i = 1; i <= 4; i++) {
            var slidy = "#c" + ss + "_" + i + "c";
            $(slidy + " input").val((vals[i - 1] * 100).toFixed(2));
            $(slidy + " input").next().html((vals[i - 1] * 100).toFixed(2));

        }
    } else if (flag === 1) {
        if ((mover - 1) != move) {
            for (var i = 1; i <= 3; i++) {
                var slidy = "#c" + ss + "_" + i;
                $(slidy + " input").val(vals[i - 1]);
                $(slidy + " input").next().html(vals[i - 1]);

            }

            var vals = rgb2hsv(red, green, blue);

            for (var i = 1; i <= 3; i++) {
                var slidy = "#c" + ss + "_" + i + "h";
                $(slidy + " input").val(vals[i - 1]);
                $(slidy + " input").next().html(vals[i - 1]);

            }

            var vals = chroma.rgb(red, green, blue).cmyk();
            for (var i = 1; i <= 4; i++) {
                var slidy = "#c" + ss + "_" + i + "c";
                $(slidy + " input").val((vals[i - 1] * 100).toFixed(2));
                $(slidy + " input").next().html((vals[i - 1] * 100).toFixed(2));

            }
        }

    }

}

function loadJS(file) {
    // DOM: Create the script element
    var jsElm = document.createElement("script");
    // set the type attribute
    jsElm.type = "text/javascript";
    // make the script element load file
    jsElm.src = file;
    // finally insert the element to the body element in order to load the script
    document.getElementById("script_con").appendChild(jsElm);
}

//functions end

$(".circles").each(function(index, element) {

    $(element).mousedown(function(e) {
        mover = index + 1;
        //values[index] = 1;
    });
    $(element).mouseup(function(e) {
        mover = 0;
    });

    $(element).bind('touchstart', function(e) {
        mover = index + 1;
        //values[index] = 1;
        $("body").addClass("lock-screen");
    });
    $(element).bind('touchend', function(e) {
        mover = 0;
        $("body").removeClass("lock-screen");
    });

});

$(document).mouseup(function(e) {
    mover = 0;
    flag = 0;
});

$(document).bind('touchend', function(e) {
    mover = 0;
    flag = 0;

    $("body").removeClass("lock-screen");
});

$("#slidy").roundSlider({
    sliderType: "default",
    width: "12",
    editableTooltip: "false",
    handleSize: "+8",
    max: "200",
    min: "0",
    radius: 170,
    showTooltip: "false",
    value: 100,
    mouseScrollAction: true
});

$("#slidy").roundSlider({
    drag: function(e) {
        value = parseFloat(e.value) / 100;
        if (e.value > 100) {
            var di = value - 1.0;
            value = 1.0 - di;
        }
        values = [value, value, value, value, value];
        var selected = $("input[type=radio]:checked").val();
        drawCircle();
        if (selected === "shades") {
            for (var i = 0; i < 3; i++) {
                essential2(i);
            }
            var [r1, g1, b1] = getdarker(all_divs[1].x, all_divs[1].y);
            var [r2, g2, b2] = getdarker(all_divs[2].x, all_divs[2].y);

            $("#pal" + (4)).css("background-color", "rgb(" + r1 + "," + g1 + "," + b1 + ")");
            $("#pal" + (5)).css("background-color", "rgb(" + r2 + "," + g2 + "," + b2 + ")");
        } else {
            for (var i = 0; i < num_divs; i++) {
                essential(i);

            }
        }

    },

    change: function(e) {
        value = parseFloat(e.value) / 100;
        if (e.value > 100) {
            var di = value - 1.0;
            value = 1.0 - di;
        }
        values = [value, value, value, value, value];
        
        var selected = $("input[type=radio]:checked").val();
        drawCircle();
        if (selected === "shades") {
            for (var i = 0; i < 3; i++) {
                essential2(i);
            }
            var [r1, g1, b1] = getdarker(all_divs[1].x, all_divs[1].y);
            var [r2, g2, b2] = getdarker(all_divs[2].x, all_divs[2].y);

            $("#pal" + (4)).css("background-color", "rgb(" + r1 + "," + g1 + "," + b1 + ")");
            $("#pal" + (5)).css("background-color", "rgb(" + r2 + "," + g2 + "," + b2 + ")");
        } else {
            for (var i = 0; i < num_divs; i++) {
                essential(i);

            }
        }

    }

});

$("#color_con li").click(function() {
    
    $("input[type=radio]").prop('checked', false);
    $(this).find("input[type=radio]").prop('checked', true);
    var file = $(this).find("input[type=radio]").val();
    var body = document.getElementById("script_con");
    var scripts = body.getElementsByTagName('script');
    body.removeChild(scripts[0]);
    loadJS('/'+base_url+"/colorpicker/js/" + file + ".js?n=" + Math.floor(Math.random() * 1000));

})

$('#mselect').on('change', function() {
    var file = this.value;
    var body = document.getElementById("script_con");
    var scripts = body.getElementsByTagName('script');
    body.removeChild(scripts[0]);
    loadJS('/'+base_url+"/colorpicker/js/" + file + ".js?n=" + Math.floor(Math.random() * 1000));
});

$("#sliders > div").hide();
$("#" + mode + "_slider").show();
$('#mode').on('change', function() {
    mode = $(this).val();
    $("#sliders > div").hide();
    $("#" + mode + "_slider").show();
});

$(document).on('input', '.slider', function() {
    flag = 1;
    if (mode === "rgba") {

        $(this).next().html($(this).val());
        var vals = new Array(4);
        var id = $(this).parent().attr('id');
        id = id.substr(0, 2);
        var index = id.charAt(1);
        for (var i = 0; i < 4; i++) {
            vals[i] = $("#" + id + "_" + (i + 1) + " input").val();
        }

        [h, s, v] = rgb2hsv(vals[0], vals[1], vals[2]);
        h = deg2rad(h);
        s = radius * s;
        [x, y] = polar2xy(s, h);
        x = x + radius;
        y = y + radius;
        values[index - 1] = v;

    } else if (mode === "hsv") {

        $(this).next().html($(this).val());
        var vals = new Array(3);
        var id = $(this).parent().attr('id');
        id = id.substr(0, 2);
        var index = id.charAt(1);
        for (var i = 0; i < 3; i++) {
            vals[i] = $("#" + id + "_" + (i + 1) + "h input").val();
        }
        
        [h, s, v] = vals;
        var hh = deg2rad(h);
        var ss = radius * s;
        [x, y] = polar2xy(ss, hh);
        x = x + radius;
        y = y + radius;
        values[index - 1] = v;

    } else if (mode === "cmyk") {
        $(this).next().html($(this).val());
        var vals = new Array(4);
        var id = $(this).parent().attr('id');
        id = id.substr(0, 2);
        var index = id.charAt(1);
        for (var i = 0; i < 4; i++) {
            vals[i] = $("#" + id + "_" + (i + 1) + "c" + " input").val();
            vals[i] = (parseFloat(vals[i]) / 100).toFixed(2);
            vals[i] = parseFloat(vals[i]);

            if (vals[i] > parseFloat("0.97"))
                vals[i] = parseFloat("0.97");
        }

        

        [h, s, v] = chroma.cmyk(vals[0], vals[1], vals[2], vals[3]).hsv();

        h = parseFloat(h.toFixed(0));
        s = parseFloat(s.toFixed(2));
        v = parseFloat(v.toFixed(2));
        h = deg2rad(h);
        s = radius * s;
        [x, y] = polar2xy(s, h);
        x = x + radius;
        y = y + radius;
        values[index - 1] = v;
    }

    mover = index;
    xslider = x;
    yslider = y;
    

});

$(window).resize(function() {
    canvasOffset = $("#mycanvas").offset();
    offsetX = canvasOffset.left;
    offsetY = canvasOffset.top;
});

function contrast2() {
    var c1 = "%23" + $("#hex1 input").val().substr(1, 6);
    var c2 = "%23" + $("#hex2 input").val().substr(1, 6);
    var c3 = "%23" + $("#hex3 input").val().substr(1, 6);
    var c4 = "%23" + $("#hex4 input").val().substr(1, 6);
    var c5 = "%23" + $("#hex5 input").val().substr(1, 6);
    url = ('/'+base_url+"/contrast?colors=" + c1 + "," + c2 + "," + c3 + "," + c4 + "," + c5);
    //window.location.href = url;
    window.open(url, '_blank');
}

function text2() {
    var c1 = "%23" + $("#hex1 input").val().substr(1, 6);
    var c2 = "%23" + $("#hex2 input").val().substr(1, 6);
    var c3 = "%23" + $("#hex3 input").val().substr(1, 6);
    var c4 = "%23" + $("#hex4 input").val().substr(1, 6);
    var c5 = "%23" + $("#hex5 input").val().substr(1, 6);
    url = ('/'+base_url+"/text?colors=" + c1 + "," + c2 + "," + c3 + "," + c4 + "," + c5);
    //window.location.href = url;
    window.open(url, '_blank');
}

function wheel2() {
    var c1 = "%23" + $("#hex1 input").val().substr(1, 6);
    var c2 = "%23" + $("#hex2 input").val().substr(1, 6);
    var c3 = "%23" + $("#hex3 input").val().substr(1, 6);
    var c4 = "%23" + $("#hex4 input").val().substr(1, 6);
    var c5 = "%23" + $("#hex5 input").val().substr(1, 6);
    url = ('/'+base_url+"/color-wheel?colors=" + c1 + "," + c2 + "," + c3 + "," + c4 + "," + c5);
    //window.location.href = url;
    window.open(url, '_blank');
}

function gradient2() {
    var c1 = "%23" + $("#hex1 input").val().substr(1, 6);
    var c2 = "%23" + $("#hex2 input").val().substr(1, 6);
    var c3 = "%23" + $("#hex3 input").val().substr(1, 6);
    var c4 = "%23" + $("#hex4 input").val().substr(1, 6);
    var c5 = "%23" + $("#hex5 input").val().substr(1, 6);
    url = ('/'+base_url+"/gradient?colors=" + c1 + "," + c2 + "," + c3 + "," + c4 + "," + c5);
    //window.location.href = url;
    window.open(url, '_blank');
}
var spatter = {
    images: [],
    index: 0,
    time: 2000,
    size: 4
};

for(var i = 0; i < spatter.size; i++) {
    spatter.images[i] = new Image();
    spatter.images[i].src = 'images/blood/spatter' + i + '.png';
}

doSpatter();

function doSpatter() {
    setInterval(function() {
        drawSpatter(spatter.index);
        spatter.index++;
        if(spatter.index >= spatter.images.length)
            spatter.index = 0; 
    }, spatter.time);
}

function chooseLocation() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    var x = Math.floor(Math.random()*w);
    var y = Math.floor(Math.random()*h);

    return {
        x: x,
        y: y
    }
}

function drawSpatter(imageIndex) { 
    $('body').append(spatter.images[imageIndex]);
    
    var s = $(spatter.images[imageIndex]);

    s.show();

    var loc = chooseLocation();
    var width = Math.floor(Math.random()*100+100);

    if(loc.x + width > window.innerWidth)
        loc.x = window.innerWidth - width;

    if(loc.y + width > window.innerHeight)
        loc.y = window.innerHeight - width;

    s.css('position', 'absolute');
    s.css('pointer-events', 'none');
    s.css('width', width);
    s.css('top', loc.y + 'px');
    s.css('left', loc.x + 'px');
    s.css('opacity', '.8');

    s.fadeOut(spatter.time);
}

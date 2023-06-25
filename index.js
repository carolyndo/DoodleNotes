var cursor = document.querySelector(".cursor");
document.addEventListener("mousemove",function(x){
    cursor.style.cssText = "left: " + x.clienX + "px; top: " + x.clientY + "px;";
});

const initCanvas = (id) => {
    return new fabric.Canvas(id, {
        width: 750,
        height: 750,
        backgroundColor: 'white',
        selection: false
    });
}

const setBackground = (url, canvas) => {
    fabric.Image.fromURL(url, (img) => {
        canvas.backgroundImage = img
        canvas.renderAll()
    })
}

const toggleMode = (mode) => {
    if (mode === modes.pan) {
        if (currentMode === modes.pan) {
            currentMode = ''
        } else {
            currentMode = modes.pan
            canvas.isDrawingMode = false
            canvas.renderAll()
        }
    } else if (mode === modes.drawing) {
        if (currentMode === modes.drawing) {
            currentMode = ''
            canvas.isDrawingMode = false
            canvas.setCursor('crosshair')
            canvas.renderAll()
        } else {
            currentMode = modes.drawing
            canvas.freeDrawingBrush.color = color
            canvas.isDrawingMode = true
            canvas.renderAll()
        } 
    }
}

const setPanEvents = (canvas) => {
    // mouse:over
    canvas.on('mouse:move', (event) => {
        // console.log(e)
        if (mousePressed && currentMode === modes.pan) {
            canvas.setCursor('grab')
            canvas.renderAll()
            const mEvent = event.e;
            const delta = fabric.Point(mEvent.movementX, mEvent.movementY)
            canvas.relativePan(delta)
        } 
    })

    canvas.on('mouse:down', (event) => {
        mousePressed = true;
        if (currentMode === modes.pan) {
            canvas.setCursor('grab')
            canvas.renderAll()
        }
    })
    canvas.on('mouse:up', (event) => { 
        mousePressed = false;
        canvas.setCursor('default')
        canvas.renderAll()
    })
}

const setColorListener = () => {
    const picker = document.getElementById('colorPicker')
    picker.addEventListener('change', (event) => {
        console.log(event.target.value)
        color = event.target.value
        canvas.freeDrawingBrush.color = color
        canvas.renderAll()
    })
}

const clearCanvas = (canvas) => {
    canvas.getObjects().forEach((o) => {
        if (o !== canvas.backgroundImage) {
            canvas.remove(o)
        }
    })
}

const canvas = initCanvas('canvas');
let mousePressed = false;
let color = '#000000'

let currentMode;
const modes = {
    pan: 'pan',
    drawing: 'drawing'
}

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);


function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
            var imgInstance = new fabric.Image(img, {
               selectable: 1
            })
            canvas.add(imgInstance);
            canvas.deactivateAll().renderAll();
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}



var imageSaver = document.getElementById('lnkDownload');
imageSaver.addEventListener('click', saveImage, false);

function saveImage(e) {
    this.href = canvas.toDataURL({
        format: 'png',
        quality: 0.8
    });
    this.download = 'canvas.png'
}
// setBackground('https://pixabay.com/photos/wisteria-flower-plants-8071924/', canvas);

setPanEvents(canvas)

setColorListener()
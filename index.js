var cursor = document.querySelector(".cursor");
document.addEventListener("mousemove",function(x){
    cursor.style.cssText = "left: " + x.clienX + "px; top: " + x.clientY + "px;";
});

const initCanvas = (id) => {
    return new fabric.Canvas(id, {
        width: 500,
        height: 500,
        backgroundColor: 'lightgray',
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

// setBackground('https://pixabay.com/photos/wisteria-flower-plants-8071924/', canvas);

setPanEvents(canvas)

setColorListener()
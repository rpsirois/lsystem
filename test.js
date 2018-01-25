const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const VIEW_ANGLE = 60;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 1;
const FAR = 20000;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( WIDTH, HEIGHT );
document.body.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
camera.position.z = 380;
camera.position.y = 100;

var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.enablePan = false;

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );

scene.add( camera );

//
// BEGIN MAIN PROGRAM
//

var instruction = new Instruction()
var segments = []

var system = new LSystem({
    axiom: 'F',
    productions: {
        'F': 'F[-&<F][<++&F]\F[-&>F][+&F]'
    },
    finals: {
        '+': () => { instruction.turn( -12 ) },
        '-': () => { instruction.turn( 12 ) },
        '|': () => { instruction.turn( 180 ) },
        '^': () => { instruction.pitch( 12 ) },
        '&': () => { instruction.pitch( -12 ) },
        '<': () => { instruction.roll( -12 ) },
        '\\': () => { instruction.roll( -12 ) },
        '>': () => { instruction.roll( 12 ) },
        'F': () => {
            instruction.startDrawing()
            instruction.move( 10, function( segment ) {
                if ( segment ) segments.push( segment )
            })
        },
        '[': () => { instruction.save() },
        ']': () => { instruction.restore() }
    }
})

console.log( system.iterate( 3 ) )
system.final()

var wikiExample4 = new LSystem({
    axiom: 'F',
    productions: {
        'F': 'F+F-F-F+F'
    },
    finals: {
        '+': () => { instruction.turn( 90 ) },
        '-': () => { instruction.turn( -90 ) },
        'F': () => {
            instruction.move( 10, function( segment ) {
                if ( segment ) segments.push( segment )
            })
        }
    }
})

console.log( wikiExample4.iterate( 5 ) )
wikiExample4.final()


segments.forEach( function( segment ) {
    scene.add( segment )
    //console.log( segment.geometry.vertices[0], ' - ', segment.geometry.vertices[1] )
})

//
// END MAIN PROGRAM
//

var mouse = new THREE.Vector2()
function onMouseMove( e ) {
    mouse.x = ( e.clientX / WIDTH ) * 2 - 1
    mouse.y = - ( e.clientY / HEIGHT ) * 2 + 1
}

function animate() {
    // Prepare next render frame
    requestAnimationFrame( animate )

    // CONTROLS
    controls.update()

    // SCENE
    renderer.render( scene, camera );
}

animate();


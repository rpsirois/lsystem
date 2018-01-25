// based strongly on the work of Nathan Walters
// http://new.math.uiuc.edu/math198/MA198-2015/nwalter2/index.html

var material = new THREE.LineBasicMaterial({ color: 0x000000 })

function dToR( d ) { return d * ( Math.PI / 180 ) }

class Instruction {
    constructor() {
        this.savedState = null
        this.position = new THREE.Vector3( 0, 0, 0 )
        this.heading = new THREE.Vector3( 1, 0, 0 )
        this.normal = new THREE.Vector3( 0, 0, 1 )
        this.drawing = true
    }

    move( distance, cb ) {
        var endPosition = new THREE.Vector3()
                                        .copy( this.heading )
                                        .normalize()
                                        .multiplyScalar( distance )
                                        .add( this.position )

        if ( this.drawing ) {
            //var line = segment.clone()
            var line = new THREE.Line( new THREE.Geometry(), material )
            line.frustumCulled = false
            line.geometry.vertices[0] = this.position
            line.geometry.vertices[1] = endPosition
            cb( line )
        }

        this.position = endPosition
    }

    turn( angle ) {
        angle = dToR( angle )
        var endHeading = this.heading.clone()
                                        .applyAxisAngle( this.normal, angle )
                                        .normalize()

        this.heading = endHeading
    }

    roll( angle ) {
        angle = dToR( angle )
        var endNormal = this.normal.clone()
                                        .applyAxisAngle( this.heading, angle )
                                        .normalize()

        this.normal = endNormal
    }

    pitch( angle ) {
        angle = dToR( angle )
        var pitchAxis = this.heading.clone()
                                        .cross( this.normal )
                                        .normalize()
        var endHeading = this.heading.clone()
                                        .applyAxisAngle( pitchAxis, angle )
                                        .normalize()
        var endNormal = this.normal.clone()
                                        .applyAxisAngle( pitchAxis, angle )
                                        .normalize()

        this.heading = endHeading
        this.normal = endNormal
    }

    moveTo( position, y, z ) {
        if ( typeof y != 'undefined' && typeof z != 'undefined' ) {
            position = new THREE.Vector3( position, y, z )
        }
        this.position = position
    }

    startDrawing() { this.drawing = true }

    stopDrawing() { this.drawing = false }

    save() {
        this.savedState = {
            position: this.position,
            heading: this.heading,
            normal: this.normal
        }
    }

    restore() {
        if ( this.savedState ) {
            this.position = this.savedState.position
            this.heading = this.savedState.heading
            this.normal = this.savedState.normal
        }
    }
}

if ( typeof module != 'undefined' ) {
    module.exports = {
        Instruction
    }
}

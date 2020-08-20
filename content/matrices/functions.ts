// =============================================================================
// Matrices
// (c) Mathigon
// =============================================================================

/// <reference types="THREE"/>

import {Step, Geopad} from '../shared/types';
import {ElementView} from '@mathigon/boost';
import {Point} from '@mathigon/fermat';
import {Solid} from '../shared/components/solid';

/**
 *
 * @param A 2x2 matrix
 * @param v 2x1 vector
 */
function applyTransform(A: number[][], v: number[]): number[] {

  return [
    A[0][0]*v[0] + A[0][1]*v[1],
    A[1][0]*v[0] + A[1][1]*v[1]
  ];
}

/**
 * Okay looks like I have a general idea of how this should work, but I need to work out some details.
 * How???
 * @param $step
 */
export function translations($step: Step) {

  const $polygons = $step.$('svg')?.$$('polygon') as ElementView[];
  const origin = {x: -40, y: -30}; // center polygon on "origin" (top left)
  const center = {x: 110, y: 110};
  const cascade = {x: origin.x + center.x, y: origin.y + center.y};

  $polygons[0].setTransform(cascade);
  $polygons[1].setTransform(cascade);

  $step.model.watch((state: any) => {
    console.log(state.a);

    const _scale = {x: cascade.x * state.a, y: cascade.y * 1};
    $polygons[1].setTransform(cascade, 0, state.a);
  });
}

/**
 * Rotate (how??)
 * @param $step
 */
export function rotations($step: Step) {

  const $polygons = $step.$('svg')?.$$('polygon') as ElementView[];
  const center = {x: 50, y: 50};
  console.log($polygons[1]);

  $step.model.watch((state: any) => {
    console.log(state.angle);
    // yeah, so this isn't doing what I want!
    $polygons[1].setTransform(center, Math.PI * state.angle / 360);
  });
}

/**
 * Very cool.
 * NEXT: center on theorigin and make it reflect about
 * NEXT: make the origin thicker
 *
 * @param $step
 */
export function scale($step: Step) {

  $step.model.polygonScale = (xscale: number, yscale: number) => {
    console.log(xscale, yscale);

    // here's where we have to do that p5js strategy where we push and pop translates to display it
    // (1) center polygon along the origin (0,0)
    // (2) apply transformation shown in matrix
    // (3) move it to center (110, 110)

    const points = [[30, 10], [10, 70], [70, 70], [50, 10]];

    // let's try some d3 style formatting
    const pointString = points.map(p => [p[0]-40, p[1]-40])         // (1) center shape along origin (0,0)
        .map(p => applyTransform([            // (2) apply transformation from matrix
          [xscale, 0],
          [0, yscale]
        ], p))
        .map(p => [p[0]+110, [p[1]+110]])     // (3) move to center of SVG
        .map(point => point.join(','))        // commas between xy coords
        .join(' ');                            // spaces between coord pairs

    const poly = `<polygon points="${pointString}" fill="#ff941f" opacity="0.5" />`;

    return poly;
  };
}

/**
 * Also very cool.
 *
 * @param $step
 */
export function skew($step: Step) {

  // here's where we have to do that p5js strategy where we push and pop translates to display it
  // (1) center polygon along the origin (0,0)
  // (2) apply transformation shown in matrix
  // (3) move it to center (110, 110)

  $step.model.polygonSkew = (xskew: number, yskew: number) => {
    console.log(xskew, yskew);

    const points = [[30, 10], [10, 70], [70, 70], [50, 10]];

    // let's try some d3 style formatting
    const pointString = points.map(p => [p[0]-40, p[1]-40])         // (1) center shape along origin (0,0)
        .map(p => applyTransform([
          [1, - xskew],  // why is this negative?
          [-yskew, 1]   // is this the right direction?
        ], p)) // (2) apply transformation from matrix
        .map(p => [p[0]+110, [p[1]+110]])     // (3) move to center of SVG
        .map(point => point.join(','))        // commas between xy coords
        .join(' ');                            // spaces between coord pairs

    const poly = `<polygon points="${pointString}" fill="#ff941f" opacity="0.5" />`;

    return poly;
  };

  console.log('inside of skew');
  console.log('here is the model');
  console.log($step.model);
}

// NEXT: figure out why the heck this ain't workin'
export function rotate($step: Step) {

  $step.model.polygonRotate = (angle: number) => {
    console.log('rotate', angle);

    const rads = Math.PI * angle / 360;
    const cos = Math.cos(rads);
    const sin = Math.sin(rads);

    const points = [[30, 10], [10, 70], [70, 70], [50, 10]];

    // let's try some d3 style formatting
    const pointString = points.map(p => [p[0]-40, p[1]-40])         // (1) center shape along origin (0,0)
        .map(p => applyTransform([ // apply transformation from matrix
          [cos, -sin], // why is this negative?
          [sin, cos] // is this the right direction?
        ], p))
        .map(p => [p[0]+110, [p[1]+110]])     // (3) move to center of SVG
        .map(point => point.join(','))        // commas between xy coords
        .join(' ');                            // spaces between coord pairs

    /* const transformedPoints = points.map(p =>
        [cos * p[0] - sin * p[1],
        sin * p[0] + cos * p[1]]
      );
      const pointString = transformedPoints.map(point => + point[0] + "," + point[1]).join(' ');*/
    const poly0 = `<polygon points="${pointString}" fill="#ff941f" opacity="0.5" />`;

    return poly0;
  };

  console.log('inside of rotate');
  console.log('here is the model');
  console.log($step.model);

}

export function playWithMe($step: Step) {

  console.log($step.model);

  const $geopad = $step.$('x-geopad') as Geopad;

  // buttons
  const buttons = $step.$$('.button');

  // paths
  const _fabric = $step.$$('.fabric');

  // identity
  buttons[0].on('click', () => {
    $geopad.animatePoint('ipoint', new Point(1, 0), 1000);
    $geopad.animatePoint('jpoint', new Point(0, 1), 1000);
  });

  // skew
  buttons[1].on('click', () => {
    $geopad.animatePoint('ipoint', new Point(1, 0), 1000);
    $geopad.animatePoint('jpoint', new Point(1, 1), 1000);
  });

  // scale
  buttons[2].on('click', () => {
    $geopad.animatePoint('ipoint', new Point(2, 0), 1000);
    $geopad.animatePoint('jpoint', new Point(0, 2), 1000);
  });

  // rotate
  buttons[3].on('click', () => {
    $geopad.animatePoint('ipoint', new Point(0, 1), 1000);
    $geopad.animatePoint('jpoint', new Point(-1, 0), 1000);
  });

  // determinant = 0
  buttons[4].on('click', () => {
    $geopad.animatePoint('ipoint', new Point(1, 1), 1000);
    $geopad.animatePoint('jpoint', new Point(-1, -1), 1000);

  });
}

/**
 * Show determinant as area.
 */
export function determinants($step:Step) {
  $step.model.watch((state: any) => {
    const i = state.ipoint;
    const j = state.jpoint;
    $step.model.determinant = i.x * j.y - i.y * j.x;
  });

  const $geopad = $step.$('x-geopad') as Geopad;

  // buttons
  const buttons = $step.$$('.button');

  // paths
  const _fabric = $step.$$('.fabric');

  // identity
  buttons[0].on('click', () => {
    console.log('button');
    $geopad.animatePoint('ipoint', new Point(1, 0), 1000);
    $geopad.animatePoint('jpoint', new Point(0, 1), 1000);
  });

  // skew
  buttons[1].on('click', () => {
    $geopad.animatePoint('ipoint', new Point(1, 0), 1000);
    $geopad.animatePoint('jpoint', new Point(1, 1), 1000);
  });

  // scale
  buttons[2].on('click', () => {
    $geopad.animatePoint('ipoint', new Point(2, 0), 1000);
    $geopad.animatePoint('jpoint', new Point(0, 2), 1000);
  });

  // rotate
  buttons[3].on('click', () => {
    $geopad.animatePoint('ipoint', new Point(0, 1), 1000);
    $geopad.animatePoint('jpoint', new Point(-1, 0), 1000);
  });

  // determinant = 0
  buttons[4].on('click', () => {
    $geopad.animatePoint('ipoint', new Point(1, 1), 1000);
    $geopad.animatePoint('jpoint', new Point(-1, -1), 1000);

  });
}


export function threeDimensions($step: Step) {
  const $solids = $step.$$('x-solid') as Solid[];

  // scrap this guy for parts
  $solids[0].addMesh(() => {
    $solids[0].addArrow([0, -1.4, 0], [1.4, -1.4, 0], 0xcd0e66);
    $solids[0].addLabel('r', [0.7, -1.4, 0], 0xcd0e66, '-1px 0 0 -3px');

    $solids[0].addArrow([0, -1.4, 0], [0, 1.35, 0], 0x0f82f2);
    $solids[0].addLabel('h', [0, 0, 0], 0x0f82f2, '-10px 0 0 4px');

    $solids[0].addPoint([0, 1.4, 0], 0x22ab24);
    $solids[0].addWireframe(new THREE.ConeGeometry(1.4, 2.8, 128, 1, true));

    const bottomMaterial = Solid.translucentMaterial(0xcd0e66, 0.3);
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(1.4, 32),
        bottomMaterial);
    bottom.rotateX(Math.PI / 2);
    bottom.position.y = -1.4;
    return [bottom];
  });

  $solids[1].addMesh((scene) => {
    // $solids[1].addWireframe(new THREE.Line)

    // DRAW PLANES
    const PLANE_SIZE = 4;
    const zPlaneMaterial = Solid.translucentMaterial(0xcd0e66, 0.3);
    const zPlane = new THREE.Mesh(new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, 10, 10), zPlaneMaterial);
    zPlane.rotateX(Math.PI/2);
    $solids[1].addArrow([0, 0, 0], [0, 0, 1], 0xcd0e66);

    const yPlaneMaterial = Solid.translucentMaterial(0x0f82f2, 0.3);
    const yPlane = new THREE.Mesh(new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, 10, 10), yPlaneMaterial);
    yPlane.rotateY(Math.PI/2);
    $solids[1].addArrow([0, 0, 0], [0, 1, 0], 0x0f82f2);

    const xPlaneMaterial = Solid.translucentMaterial(0x22ab24, 0.3);
    const xPlane = new THREE.Mesh(new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, 10, 10), xPlaneMaterial);
    xPlane.rotateZ(Math.PI/2);
    $solids[1].addArrow([0, 0, 0], [1, 0, 0], 0x22ab24);

    const vectorArrow = $solids[1].addArrow([0, 0, 0], [$step.model.x, $step.model.y, $step.model.z], 0x000000);

    $step.model.watch((state: any) => {
      // A-HA! This doesn't work, and there's even a TODO to go with it
      // "TODO Support changing the height of the arrow."
      vectorArrow.updateEnds!([0, 0, 0], [state.x, state.y, state.z]);
      scene.draw();
    });

    return [xPlane, yPlane, zPlane];
  });
}

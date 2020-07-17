import * as THREE from 'three';

import { GUI } from './jsm/libs/dat.gui.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { NRRDLoader } from './jsm/loaders/NRRDLoader.js';
import { VolumeRenderShader1 } from './jsm/shaders/VolumeShader.js';
import { WEBGL } from './jsm/WebGL.js';

if ( WEBGL.isWebGL2Available() === false ) {

  document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );

}

var renderer,
  scene,
  camera,
  controls,
  material,
  volconfig,
  cmtextures;

init();

function init() {

  scene = new THREE.Scene();
  // scene.background = new THREE.Color( 0xff0000 );

  // Create renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // Create camera (The volume renderer does not work very well with perspective yet)
  var h = 512; // frustum height
  var aspect = window.innerWidth / window.innerHeight;
  // TODO: Set the camera frustrum far plane programatically (without magic number) 
  camera = new THREE.OrthographicCamera( - h * aspect / 2, h * aspect / 2, h / 2, - h / 2, 1, 5000 );
  camera.position.set( 0, 0, 128 );
  camera.up.set( 0, 0, 1); // In our data, z is up

  // Create controls
  controls = new OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render );
  // TODO: Programatically set these to the center of the volume
  controls.target.set( 768, 768, 100 );

  // Arbitrarily chosen zoom levels to ensure the whole model can be seen
  controls.minZoom = 0.05;
  controls.maxZoom = 8;
  controls.update();

  // scene.add( new AxesHelper( 128 ) );

  // Lighting is baked into the shader a.t.m.
  // var dirLight = new DirectionalLight( 0xffffff );

  // The gui for interaction
  volconfig = { clim1: 0, clim2: 1, renderstyle: 'iso', isothreshold: 0.15, colormap: 'viridis' };
  var gui = new GUI();
  gui.add( volconfig, 'clim1', 0, 1, 0.01 ).onChange( updateUniforms );
  gui.add( volconfig, 'clim2', 0, 1, 0.01 ).onChange( updateUniforms );
  gui.add( volconfig, 'colormap', { gray: 'gray', viridis: 'viridis' } ).onChange( updateUniforms );
  gui.add( volconfig, 'renderstyle', { mip: 'mip', iso: 'iso' } ).onChange( updateUniforms );
  gui.add( volconfig, 'isothreshold', 0, 1, 0.01 ).onChange( updateUniforms );

  // Load the data ...
  const model = require('./models/8bit.nrrd');
  new NRRDLoader().load( model, function ( volume ) {

    // Texture to hold the volume. We have scalars, so we put our data in the red channel.
    // Also see https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
    // TODO: look the dtype up in the volume metadata
    var texture = new THREE.DataTexture3D( volume.data, volume.xLength, volume.yLength, volume.zLength );
    texture.format = THREE.RedFormat;
    texture.minFilter = texture.magFilter = THREE.LinearFilter;
    texture.unpackAlignment = 1;

    // Colormap textures
    const viridis = require('./textures/cm_viridis.png');
    const gray = require('./textures/cm_gray.png');
    cmtextures = {
      viridis: new THREE.TextureLoader().load( viridis, render ),
      gray: new THREE.TextureLoader().load( gray, render )
    };

    // Material
    var shader = VolumeRenderShader1;

    var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    uniforms[ "u_data" ].value = texture;
    uniforms[ "u_size" ].value.set( volume.xLength, volume.yLength, volume.zLength );
    uniforms[ "u_clim" ].value.set( volconfig.clim1, volconfig.clim2 );
    uniforms[ "u_renderstyle" ].value = volconfig.renderstyle == 'mip' ? 0 : 1; // 0: MIP, 1: ISO
    uniforms[ "u_renderthreshold" ].value = volconfig.isothreshold; // For ISO renderstyle
    uniforms[ "u_cmdata" ].value = cmtextures[ volconfig.colormap ];

    material = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      side: THREE.BackSide // The volume shader uses the backface as its "reference point"
    } );

    // THREE.Mesh
    var geometry = new THREE.BoxBufferGeometry( volume.xLength, volume.yLength, volume.zLength );
    geometry.translate( volume.xLength / 2 - 0.5, volume.yLength / 2 - 0.5, volume.zLength / 2 - 0.5 );

    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    render();

  } );

  window.addEventListener( 'resize', onWindowResize, false );

}

function updateUniforms() {

  material.uniforms[ "u_clim" ].value.set( volconfig.clim1, volconfig.clim2 );
  material.uniforms[ "u_renderstyle" ].value = volconfig.renderstyle == 'mip' ? 0 : 1; // 0: MIP, 1: ISO
  material.uniforms[ "u_renderthreshold" ].value = volconfig.isothreshold; // For ISO renderstyle
  material.uniforms[ "u_cmdata" ].value = cmtextures[ volconfig.colormap ];

  render();

}

function onWindowResize() {

  renderer.setSize( window.innerWidth, window.innerHeight );

  var aspect = window.innerWidth / window.innerHeight;

  var frustumHeight = camera.top - camera.bottom;

  camera.left = - frustumHeight * aspect / 2;
  camera.right = frustumHeight * aspect / 2;

  camera.updateProjectionMatrix();

  render();

}

function render() {

  renderer.render( scene, camera );

}
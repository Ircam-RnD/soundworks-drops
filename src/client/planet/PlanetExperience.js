import * as soundworks from 'soundworks/client';
import * as d3 from 'd3';
import PlanetRenderer from './PlanetRenderer';
import Looper from '../shared/Looper';

function dbToLin(val) {
  return Math.exp(0.11512925464970229 * val); // pow(10, val / 20)
};

const audioContext = soundworks.audioContext;

const viewTemplate = `
  <canvas class="background"></canvas>
  <div class="foreground">
    <div class="section-top flex-middle"></div>
    <div class="section-center flex-center"></div>
    <div class="section-bottom flex-middle"></div>
  </div>
`;

class PlanetExperience extends soundworks.Experience {
  constructor() {
    super();

    this.sharedParams = this.require('shared-params');

    this.audioBufferManager = this.require('audio-buffer-manager', {
      files: { topology: 'data/world-110m-withlakes.json' },
    });

    this.geolocation = this.require('geolocation', {
      debug: false,
    });

    this.scheduler = this.require('scheduler', { lookahead: 0.050 });

    // bindings
    this.initView = this.initView.bind(this);
    this.triggerLoop = this.triggerLoop.bind(this);
    this.triggerDrop = this.triggerDrop.bind(this);
  }

  init() {
    this.viewTemplate = viewTemplate;
    this.viewContent = {};
    this.viewCtor = soundworks.CanvasView;
    this.viewOptions = { preservePixelRatio: true };
    this.view = this.createView();
  }

  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.show();

    // initialize view
    setTimeout(() => {
      this.initView();

      // looper
      this.looper = new Looper(this.scheduler, () => {}, this.triggerDrop);

      // params
      this.sharedParams.addParamListener('maxDrops', (value) => this.looper.setMaxLocalLoops(value));
      this.sharedParams.addParamListener('loopPeriod', (value) => this.looper.params.period = value);
      this.sharedParams.addParamListener('loopAttenuation', (value) => this.looper.params.attenuation = value);
      this.sharedParams.addParamListener('minGain', (value) => this.looper.params.minGain = dbToLin(value));

      // messages from the server
      this.receive('drop', this.triggerLoop);
      this.receive('echo', this.triggerLoop);

      this.receive('path', (path, coordinates) => {
        this.renderer.setSalesmanCoordinates(coordinates);
      });

      this.receive('proximity-player', (coords) => {
        this.renderer.stateMachine.trigger('goto', coords.reverse());
      });
    }, 0);
  }

  initView() {
    // init rendering - weird to store topology inside audioBufferManager
    const topology = this.audioBufferManager.get('topology');
    const $container = d3.select(this.view.$el);
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;
    const size = Math.max(screenWidth, screenHeight);
    const maxSize = size * 7;
    const minSize = size / 10;
    const scaleExtent = [minSize, maxSize];

    this.renderer = new PlanetRenderer(this.view.ctx, topology, scaleExtent);
    this.view.addRenderer(this.renderer);

    const zoom = d3.zoom()
      .scaleExtent(scaleExtent)
      .on('zoom', () => {
        // weirdest hack ever... see below...
        if (d3.event.sourceEvent instanceof WheelEvent &&
            this.renderer.stateMachine.currentState !== null) {
          this.renderer.stateMachine.suspend();
        }

        this.renderer.stateMachine.lastInteractionTime = audioContext.currentTime;
        this.renderer.zoomProxy.updateZoom(d3.event.transform.k);
      });

    const drag = d3.drag()
      .on('drag', () => {
        if (this.renderer.stateMachine.currentState !== null)
          this.renderer.stateMachine.suspend();

        this.renderer.stateMachine.lastInteractionTime = audioContext.currentTime;
        this.renderer.dragProxy.updateDrag(d3.event.dx, d3.event.dy)
      });

    zoom.scaleTo($container, this.renderer.projection.scale());

    // use zoom to maintain projection and zoom in sync as
    // any other way to reinit the zoom with current projection values failed
    // (aka `$container.call(zoom.transform, zoomTransformValues)`)
    for (let id in this.renderer.stateMachine.states)
      this.renderer.stateMachine.states[id].scaleTo = (value) => zoom.scaleTo($container, value);

    // apply to $container
    $container.call(drag);
    $container.call(zoom);
  }

  triggerLoop(syncTime, coordinates, soundParams) {
    soundParams.coordinates = coordinates;
    this.looper.createLoop(syncTime, soundParams);
  }

  // looper callback
  triggerDrop(audioTime, soundParams, loopCounter) {
    if (loopCounter === 0)
      this.renderer.addPing(soundParams);
  }
}

export default PlanetExperience;

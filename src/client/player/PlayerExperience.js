import * as soundworks from 'soundworks/client';
import SampleSynth from './SampleSynth';
import Looper from './Looper';
import Circles from './Circles';
import audioFiles from './audioFiles';

const client = soundworks.client;

const viewTemplate = `
  <canvas class="background"></canvas>
  <div class="foreground">
    <div class="section-top flex-middle"></div>
    <div class="section-center flex-center">
    <% if (state === 'reset') { %>
      <p>Waiting for<br>everybody<br>getting ready…</p>
    <% } else if (state === 'end') { %>
      <p>That's all.<br>Thanks!</p>
    <% } else { %>
      <p>
      <% if (numAvailable > 0) { %>
        You have<br />
        <% if (numAvailable === maxDrops) { %>
          <span class="huge"><%= numAvailable %></span>
        <% } else { %>
          <span class="huge"><%= numAvailable %> of <%= maxDrops %></span>
        <% } %>
        <br /><%= (numAvailable === 1) ? 'drop' : 'drops' %> to play
      <% } else { %>
        <span class="big">Listen!</span>
      <% } %>
      </p>
    <% } %>
    </div>
    <div class="section-bottom flex-middle"></div>
  </div>
`;

export default class PlayerExperience extends soundworks.Experience {
  constructor() {
    super();

    // configure required services
    this.loader = this.require('loader', { files: audioFiles });
    this.checkin = this.require('checkin');
    this.params = this.require('shared-params');
    this.motionInput = this.require('motion-input', { descriptors: ['accelerationIncludingGravity'] });
    this.scheduler = this.require('scheduler', { lookahead: 0.050 });

    // requires mobile device and web audio
    this.require('platform', { features: ['mobile-device', 'web-audio'] });

    // a simple sample player with a list of samples
    this.synth = new SampleSynth();

    // control parameters
    this.state = 'reset';
    this.maxDrops = 0;

    this.loopParams = {};
    this.loopParams.div = 3;
    this.loopParams.period = 7.5;
    this.loopParams.attenuation = 0.70710678118655;
    this.loopParams.minGain = 0.1;

    this.autoPlay = 'off'; // automatic (random) playing: 'disable', 'off', 'on'
    this.quantize = 0; // quantization step in

    // renderer generating growing circles on touch
    this.renderer = new Circles();

    // each touch starts its own loop generated by the 'looper'
    this.looper = new Looper(this.scheduler, this.synth, this.renderer, this.loopParams, () => this.updateCount());
  }

  init() {
    // setup view (creator, template and content)
    this.viewCtor = soundworks.CanvasView;
    this.viewTemplate = viewTemplate;
    this.viewContent = {
      state: this.state,
      maxDrop: 0,
      numAvailable: 0,
    }

    // create view with the creator, template and content given above
    this.view = this.createView();
  }

  trigger(x, y) {
    const soundParams = {
      index: client.index,
      gain: 1,
      x: x,
      y: y,
    };

    let time = this.scheduler.syncTime;

    // quantize
    if (this.quantize > 0)
      time = Math.ceil(time / this.quantize) * this.quantize;

    this.looper.start(time, soundParams, true);
    this.send('sound', time, soundParams);
  }

  clear() {
    // remove at own looper
    this.looper.remove(client.index, true);

    // remove at other players
    this.send('clear');
  }

  updateCount() {
    this.viewContent.maxDrops = this.maxDrops;
    this.viewContent.message = undefined;

    if (this.state === 'reset') {
      this.viewContent.state = 'reset';
    } else if (this.state === 'end' && this.looper.loops.length === 0) {
      this.viewContent.state = 'end';
    } else {
      this.viewContent.state = this.state;
      this.viewContent.numAvailable = Math.max(0, this.maxDrops - this.looper.numLocalLoops);
    }

    this.view.render('.section-center');
  }

  autoTrigger() {
    if (this.autoPlay === 'on') {
      if (this.state === 'running' && this.looper.numLocalLoops < this.maxDrops)
        this.trigger(Math.random(), Math.random());

      setTimeout(() => {
        this.autoTrigger();
      }, Math.random() * 2000 + 50);
    }
  }

  autoClear() {
    if (this.autoPlay === 'on') {
      if (this.looper.numLocalLoops > 0)
        this.clear(Math.random(), Math.random());

      setTimeout(() => {
        this.autoClear();
      }, Math.random() * 60000 + 60000);
    }
  }

  setState(state) {
    if (state !== this.state) {
      this.state = state;
      this.updateCount();
    }
  }

  setMaxDrops(maxDrops) {
    if (maxDrops !== this.maxDrops) {
      this.maxDrops = maxDrops;
      this.updateCount();
    }
  }

  setAutoPlay(autoPlay) {
    if (this.autoPlay !== 'disable' && autoPlay !== this.autoPlay) {
      this.autoPlay = autoPlay;

      if (autoPlay === 'on') {
        this.autoTrigger();
        this.autoClear();
      }
    }
  }

  start() {
    super.start();

    // just init once
    if (!this.hasStarted)
      this.init();

    // show view
    this.show();

    // setup shared parameter (conductor) listeners
    const params = this.params;
    params.addParamListener('state', (state) => this.setState(state));
    params.addParamListener('maxDrops', (value) => this.setMaxDrops(value));
    params.addParamListener('loopDiv', (value) => this.loopParams.div = value);
    params.addParamListener('loopPeriod', (value) => this.loopParams.period = value);
    params.addParamListener('loopAttenuation', (value) => this.loopParams.attenuation = value);
    params.addParamListener('minGain', (value) => this.loopParams.minGain = value);
    params.addParamListener('autoPlay', (value) => this.setAutoPlay(value));
    params.addParamListener('clear', () => this.looper.removeAll());

    // setup motion input listeners
    if (this.motionInput.isAvailable('accelerationIncludingGravity')) {
      this.motionInput.addListener('accelerationIncludingGravity', (data) => {
        const accX = data[0];
        const accY = data[1];
        const accZ = data[2];
        const mag = Math.sqrt(accX * accX + accY * accY + accZ * accZ);

        // clear screen on shaking
        if (mag > 20) {
          this.clear();
          this.autoPlay = 'disable'; // disable auto play on shake
        }
      });
    }

    // create touch event source referring to our view
    const surface = new soundworks.TouchSurface(this.view.$el);

    // setup touch listeners
    surface.addListener('touchstart', (id, normX, normY) => {
      if (this.state === 'running' && this.looper.numLocalLoops < this.maxDrops)
        this.trigger(normX, normY);

      this.autoPlay = 'disable'; // disable auto play on touch
    });

    // setup listeners for messages from server
    this.receive('echo', (time, soundParams) => this.looper.start(time, soundParams));
    this.receive('clear', (index) => this.looper.remove(index));

    // rederer starts with black screen
    this.view.setPreRender((ctx) => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, ctx.width, ctx.height);
    });

    // add renderer to view
    this.view.addRenderer(this.renderer);

    // set synth audio buffers
    this.synth.audioBuffers = this.loader.buffers;

    // launch autoplay (for testing)
    if (this.autoPlay) {
      this.autoTrigger();
      this.autoClear();
    }
  }
}

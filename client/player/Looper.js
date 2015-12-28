'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _wavesAudio = require('waves-audio');

var _wavesAudio2 = _interopRequireDefault(_wavesAudio);

var scheduler = _wavesAudio2['default'].getScheduler();
scheduler.lookahead = 0.050;

function arrayRemove(array, value) {
  var index = array.indexOf(value);

  if (index >= 0) {
    array.splice(index, 1);
    return true;
  }

  return false;
}

var Loop = (function (_waves$TimeEngine) {
  _inherits(Loop, _waves$TimeEngine);

  function Loop(looper, soundParams) {
    var local = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, Loop);

    _get(Object.getPrototypeOf(Loop.prototype), 'constructor', this).call(this);
    this.looper = looper;

    this.soundParams = soundParams;
    this.local = local;
  }

  _createClass(Loop, [{
    key: 'advanceTime',
    value: function advanceTime(time) {
      return this.looper.advance(time, this);
    }
  }]);

  return Loop;
})(_wavesAudio2['default'].TimeEngine);

var Looper = (function () {
  function Looper(synth, renderer, updateCount) {
    _classCallCheck(this, Looper);

    this.synth = synth;
    this.renderer = renderer;
    this.updateCount = updateCount;
    this.scheduler = scheduler;

    this.loops = [];
    this.numLocalLoops = 0;
  }

  _createClass(Looper, [{
    key: 'start',
    value: function start(time, soundParams) {
      var local = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      var loop = new Loop(this, soundParams, local);
      this.scheduler.add(loop, time);
      this.loops.push(loop);

      if (local) this.numLocalLoops++;

      this.updateCount();
    }
  }, {
    key: 'advance',
    value: function advance(time, loop) {
      var soundParams = loop.soundParams;

      if (soundParams.gain < soundParams.minGain) {
        arrayRemove(this.loops, loop);

        if (loop.local) this.numLocalLoops--;

        this.updateCount();

        return null;
      }

      var duration = this.synth.trigger(time, soundParams, !loop.local);

      this.renderer.createCircle({
        index: soundParams.index,
        x: soundParams.x,
        y: soundParams.y,
        duration: duration,
        velocity: 40 + soundParams.gain * 80,
        opacity: Math.sqrt(soundParams.gain)
      });

      soundParams.gain *= soundParams.loopAttenuation;

      return time + soundParams.loopPeriod;
    }
  }, {
    key: 'remove',
    value: function remove(index) {
      var loops = this.loops;
      var i = 0;

      while (i < loops.length) {
        var loop = loops[i];

        if (loop.soundParams.index === index) {
          loops.splice(i, 1);

          this.scheduler.remove(loop);

          if (loop.local) {
            this.numLocalLoops--;
            this.renderer.remove(index);
          }
        } else {
          i++;
        }
      }

      this.updateCount();
    }
  }, {
    key: 'removeAll',
    value: function removeAll() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(this.loops), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var loop = _step.value;

          this.scheduler.remove(loop);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.loops = [];
      this.numLocalLoops = 0;

      this.updateCount();
    }
  }]);

  return Looper;
})();

exports['default'] = Looper;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvcGxheWVyL0xvb3Blci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQWtCLGFBQWE7Ozs7QUFFL0IsSUFBTSxTQUFTLEdBQUcsd0JBQU0sWUFBWSxFQUFFLENBQUM7QUFDdkMsU0FBUyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7O0FBRTVCLFNBQVMsV0FBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDakMsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFbkMsTUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQ2QsU0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkIsV0FBTyxJQUFJLENBQUM7R0FDYjs7QUFFRCxTQUFPLEtBQUssQ0FBQztDQUNkOztJQUVLLElBQUk7WUFBSixJQUFJOztBQUNHLFdBRFAsSUFBSSxDQUNJLE1BQU0sRUFBRSxXQUFXLEVBQWlCO1FBQWYsS0FBSyx5REFBRyxLQUFLOzswQkFEMUMsSUFBSTs7QUFFTiwrQkFGRSxJQUFJLDZDQUVFO0FBQ1IsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRXJCLFFBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQy9CLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0dBQ3BCOztlQVBHLElBQUk7O1dBU0cscUJBQUMsSUFBSSxFQUFFO0FBQ2hCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3hDOzs7U0FYRyxJQUFJO0dBQVMsd0JBQU0sVUFBVTs7SUFjZCxNQUFNO0FBQ2QsV0FEUSxNQUFNLENBQ2IsS0FBSyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUU7MEJBRHZCLE1BQU07O0FBRXZCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FB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QUFXLEVBQUUsQ0FBQztLQUNwQjs7O1dBRVEscUJBQUc7Ozs7OztBQUNWLDBDQUFpQixJQUFJLENBQUMsS0FBSztjQUFsQixJQUFJOztBQUNYLGNBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFOUIsVUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDaEIsVUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7O0FBRXZCLFVBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUNwQjs7O1NBcEZrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJzcmMvY2xpZW50L3BsYXllci9Mb29wZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgd2F2ZXMgZnJvbSAnd2F2ZXMtYXVkaW8nO1xuXG5jb25zdCBzY2hlZHVsZXIgPSB3YXZlcy5nZXRTY2hlZHVsZXIoKTtcbnNjaGVkdWxlci5sb29rYWhlYWQgPSAwLjA1MDtcblxuZnVuY3Rpb24gYXJyYXlSZW1vdmUoYXJyYXksIHZhbHVlKSB7XG4gIGNvbnN0IGluZGV4ID0gYXJyYXkuaW5kZXhPZih2YWx1ZSk7XG5cbiAgaWYgKGluZGV4ID49IDApIHtcbiAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5jbGFzcyBMb29wIGV4dGVuZHMgd2F2ZXMuVGltZUVuZ2luZSB7XG4gIGNvbnN0cnVjdG9yKGxvb3Blciwgc291bmRQYXJhbXMsIGxvY2FsID0gZmFsc2UpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubG9vcGVyID0gbG9vcGVyO1xuXG4gICAgdGhpcy5zb3VuZFBhcmFtcyA9IHNvdW5kUGFyYW1zO1xuICAgIHRoaXMubG9jYWwgPSBsb2NhbDtcbiAgfVxuXG4gIGFkdmFuY2VUaW1lKHRpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5sb29wZXIuYWR2YW5jZSh0aW1lLCB0aGlzKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb29wZXIge1xuICBjb25zdHJ1Y3RvcihzeW50aCwgcmVuZGVyZXIsIHVwZGF0ZUNvdW50KSB7XG4gICAgdGhpcy5zeW50aCA9IHN5bnRoO1xuICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcbiAgICB0aGlzLnVwZGF0ZUNvdW50ID0gdXBkYXRlQ291bnQ7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG5cbiAgICB0aGlzLmxvb3BzID0gW107XG4gICAgdGhpcy5udW1Mb2NhbExvb3BzID0gMDtcbiAgfVxuXG4gIHN0YXJ0KHRpbWUsIHNvdW5kUGFyYW1zLCBsb2NhbCA9IGZhbHNlKSB7XG4gICAgY29uc3QgbG9vcCA9IG5ldyBMb29wKHRoaXMsIHNvdW5kUGFyYW1zLCBsb2NhbCk7XG4gICAgdGhpcy5zY2hlZHVsZXIuYWRkKGxvb3AsIHRpbWUpO1xuICAgIHRoaXMubG9vcHMucHVzaChsb29wKTtcblxuICAgIGlmIChsb2NhbClcbiAgICAgIHRoaXMubnVtTG9jYWxMb29wcysrO1xuXG4gICAgdGhpcy51cGRhdGVDb3VudCgpO1xuICB9XG5cbiAgYWR2YW5jZSh0aW1lLCBsb29wKSB7XG4gICAgY29uc3Qgc291bmRQYXJhbXMgPSBsb29wLnNvdW5kUGFyYW1zO1xuXG4gICAgaWYgKHNvdW5kUGFyYW1zLmdhaW4gPCBzb3VuZFBhcmFtcy5taW5HYWluKSB7XG4gICAgICBhcnJheVJlbW92ZSh0aGlzLmxvb3BzLCBsb29wKTtcblxuICAgICAgaWYgKGxvb3AubG9jYWwpXG4gICAgICAgIHRoaXMubnVtTG9jYWxMb29wcy0tO1xuXG4gICAgICB0aGlzLnVwZGF0ZUNvdW50KCk7XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5zeW50aC50cmlnZ2VyKHRpbWUsIHNvdW5kUGFyYW1zLCAhbG9vcC5sb2NhbCk7XG5cbiAgICB0aGlzLnJlbmRlcmVyLmNyZWF0ZUNpcmNsZSh7XG4gICAgICBpbmRleDogc291bmRQYXJhbXMuaW5kZXgsXG4gICAgICB4OiBzb3VuZFBhcmFtcy54LFxuICAgICAgeTogc291bmRQYXJhbXMueSxcbiAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgIHZlbG9jaXR5OiA0MCArIHNvdW5kUGFyYW1zLmdhaW4gKiA4MCxcbiAgICAgIG9wYWNpdHk6IE1hdGguc3FydChzb3VuZFBhcmFtcy5nYWluKVxuICAgIH0pO1xuXG4gICAgc291bmRQYXJhbXMuZ2FpbiAqPSBzb3VuZFBhcmFtcy5sb29wQXR0ZW51YXRpb247XG5cbiAgICByZXR1cm4gdGltZSArIHNvdW5kUGFyYW1zLmxvb3BQZXJpb2Q7XG4gIH1cblxuICByZW1vdmUoaW5kZXgpIHtcbiAgICBjb25zdCBsb29wcyA9IHRoaXMubG9vcHM7XG4gICAgbGV0IGkgPSAwO1xuXG4gICAgd2hpbGUgKGkgPCBsb29wcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGxvb3AgPSBsb29wc1tpXTtcblxuICAgICAgaWYgKGxvb3Auc291bmRQYXJhbXMuaW5kZXggPT09IGluZGV4KSB7XG4gICAgICAgIGxvb3BzLnNwbGljZShpLCAxKTtcblxuICAgICAgICB0aGlzLnNjaGVkdWxlci5yZW1vdmUobG9vcCk7XG5cbiAgICAgICAgaWYgKGxvb3AubG9jYWwpIHtcbiAgICAgICAgICB0aGlzLm51bUxvY2FsTG9vcHMtLTtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZShpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZUNvdW50KCk7XG4gIH1cblxuICByZW1vdmVBbGwoKSB7XG4gICAgZm9yIChsZXQgbG9vcCBvZiB0aGlzLmxvb3BzKVxuICAgICAgdGhpcy5zY2hlZHVsZXIucmVtb3ZlKGxvb3ApO1xuXG4gICAgdGhpcy5sb29wcyA9IFtdO1xuICAgIHRoaXMubnVtTG9jYWxMb29wcyA9IDA7XG5cbiAgICB0aGlzLnVwZGF0ZUNvdW50KCk7XG4gIH1cbn0iXX0=
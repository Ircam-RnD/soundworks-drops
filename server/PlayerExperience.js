'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _soundworksServer = require('soundworks/server');

var PlayerExperience = (function (_ServerExperience) {
  _inherits(PlayerExperience, _ServerExperience);

  function PlayerExperience(clientType) {
    _classCallCheck(this, PlayerExperience);

    _get(Object.getPrototypeOf(PlayerExperience.prototype), 'constructor', this).call(this, clientType);

    // define services dependencies
    this.sync = this.require('sync');
    this.checkin = this.require('checkin');
    this.sharedParams = this.require('shared-params');
  }

  _createClass(PlayerExperience, [{
    key: 'enter',
    value: function enter(client) {
      var _this = this;

      _get(Object.getPrototypeOf(PlayerExperience.prototype), 'enter', this).call(this, client);

      client.modules[this.id].echoPlayers = [];

      this.receive(client, 'sound', function (time, soundParams) {
        var playerList = _this.clients;
        var playerListLength = playerList.length;
        var numEchoPlayers = soundParams.loopDiv - 1;

        if (numEchoPlayers > playerListLength - 1) numEchoPlayers = playerListLength - 1;

        if (numEchoPlayers > 0) {
          var index = _this.clients.indexOf(client);
          var echoPlayers = client.modules[_this.id].echoPlayers;
          var echoPeriod = soundParams.loopPeriod / soundParams.loopDiv;
          var echoAttenuation = Math.pow(soundParams.loopAttenuation, 1 / soundParams.loopDiv);
          var echoDelay = 0;

          for (var i = 1; i <= numEchoPlayers; i++) {
            var echoPlayerIndex = (index + i) % playerListLength;
            var echoPlayer = playerList[echoPlayerIndex];

            echoPlayers.push(echoPlayer);
            echoDelay += echoPeriod;
            soundParams.gain *= echoAttenuation;

            _this.send(echoPlayer, 'echo', time + echoDelay, soundParams);
          }
        }
      });

      this.receive(client, 'clear', function () {
        _this._clearEchoes(client);
      });

      this.sharedParams.update('numPlayers', this.clients.length);
    }
  }, {
    key: 'exit',
    value: function exit(client) {
      _get(Object.getPrototypeOf(PlayerExperience.prototype), 'exit', this).call(this, client);

      this._clearEchoes(client);
      this.sharedParams.update('numPlayers', this.clients.length);
    }
  }, {
    key: '_clearEchoes',
    value: function _clearEchoes(client) {
      var echoPlayers = client.modules[this.id].echoPlayers;

      for (var i = 0; i < echoPlayers.length; i++) {
        this.send(echoPlayers[i], 'clear', client.uid);
      }client.modules[this.id].echoPlayers = [];
    }
  }]);

  return PlayerExperience;
})(_soundworksServer.ServerExperience);

exports['default'] = PlayerExperience;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3MvZHJvcHMvc3JjL3NlcnZlci9QbGF5ZXJFeHBlcmllbmNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O2dDQUFpQyxtQkFBbUI7O0lBRS9CLGdCQUFnQjtZQUFoQixnQkFBZ0I7O0FBQ3hCLFdBRFEsZ0JBQWdCLENBQ3ZCLFVBQVUsRUFBRTswQkFETCxnQkFBZ0I7O0FBRWpDLCtCQUZpQixnQkFBZ0IsNkNBRTNCLFVBQVUsRUFBRTs7O0FBR2xCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqQyxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0dBQ25EOztlQVJrQixnQkFBZ0I7O1dBVTlCLGVBQUMsTUFBTSxFQUFFOzs7QUFDWixpQ0FYaUIsZ0JBQWdCLHVDQVdyQixNQUFNLEVBQUU7O0FBRXBCLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7O0FBRXpDLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFDLElBQUksRUFBRSxXQUFXLEVBQUs7QUFDbkQsWUFBTSxVQUFVLEdBQUcsTUFBSyxPQUFPLENBQUM7QUFDaEMsWUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO0FBQzNDLFlBQUksY0FBYyxHQUFHLFdBQVcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDOztBQUU3QyxZQUFJLGNBQWMsR0FBRyxnQkFBZ0IsR0FBRyxDQUFDLEVBQ3ZDLGNBQWMsR0FBRyxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7O0FBRXhDLFlBQUksY0FBYyxHQUFHLENBQUMsRUFBRTtBQUN0QixjQUFNLEtBQUssR0FBRyxNQUFLLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0MsY0FBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFLLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQUN4RCxjQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUM7QUFDaEUsY0FBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdkYsY0FBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDOztBQUVsQixlQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksY0FBYyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3hDLGdCQUFNLGVBQWUsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUEsR0FBSSxnQkFBZ0IsQ0FBQztBQUN2RCxnQkFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUUvQyx1QkFBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3QixxQkFBUyxJQUFJLFVBQVUsQ0FBQztBQUN4Qix1QkFBVyxDQUFDLElBQUksSUFBSSxlQUFlLENBQUM7O0FBRXBDLGtCQUFLLElBQUksQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksR0FBRyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7V0FDOUQ7U0FDRjtPQUNGLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsWUFBTTtBQUNsQyxjQUFLLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUMzQixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDN0Q7OztXQUVHLGNBQUMsTUFBTSxFQUFFO0FBQ1gsaUNBbkRpQixnQkFBZ0Isc0NBbUR0QixNQUFNLEVBQUU7O0FBRW5CLFVBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUIsVUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDN0Q7OztXQUVXLHNCQUFDLE1BQU0sRUFBRTtBQUNuQixVQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUM7O0FBRXhELFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtBQUN6QyxZQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQUEsQUFFakQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztLQUMxQzs7O1NBaEVrQixnQkFBZ0I7OztxQkFBaEIsZ0JBQWdCIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3MvZHJvcHMvc3JjL3NlcnZlci9QbGF5ZXJFeHBlcmllbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VydmVyRXhwZXJpZW5jZSB9IGZyb20gJ3NvdW5kd29ya3Mvc2VydmVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyRXhwZXJpZW5jZSBleHRlbmRzIFNlcnZlckV4cGVyaWVuY2Uge1xuICBjb25zdHJ1Y3RvcihjbGllbnRUeXBlKSB7XG4gICAgc3VwZXIoY2xpZW50VHlwZSk7XG5cbiAgICAvLyBkZWZpbmUgc2VydmljZXMgZGVwZW5kZW5jaWVzXG4gICAgdGhpcy5zeW5jID0gdGhpcy5yZXF1aXJlKCdzeW5jJyk7XG4gICAgdGhpcy5jaGVja2luID0gdGhpcy5yZXF1aXJlKCdjaGVja2luJyk7XG4gICAgdGhpcy5zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAgfVxuXG4gIGVudGVyKGNsaWVudCkge1xuICAgIHN1cGVyLmVudGVyKGNsaWVudCk7XG5cbiAgICBjbGllbnQubW9kdWxlc1t0aGlzLmlkXS5lY2hvUGxheWVycyA9IFtdO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3NvdW5kJywgKHRpbWUsIHNvdW5kUGFyYW1zKSA9PiB7XG4gICAgICBjb25zdCBwbGF5ZXJMaXN0ID0gdGhpcy5jbGllbnRzO1xuICAgICAgY29uc3QgcGxheWVyTGlzdExlbmd0aCA9IHBsYXllckxpc3QubGVuZ3RoO1xuICAgICAgbGV0IG51bUVjaG9QbGF5ZXJzID0gc291bmRQYXJhbXMubG9vcERpdiAtIDE7XG5cbiAgICAgIGlmIChudW1FY2hvUGxheWVycyA+IHBsYXllckxpc3RMZW5ndGggLSAxKVxuICAgICAgICBudW1FY2hvUGxheWVycyA9IHBsYXllckxpc3RMZW5ndGggLSAxO1xuXG4gICAgICBpZiAobnVtRWNob1BsYXllcnMgPiAwKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jbGllbnRzLmluZGV4T2YoY2xpZW50KTtcbiAgICAgICAgY29uc3QgZWNob1BsYXllcnMgPSBjbGllbnQubW9kdWxlc1t0aGlzLmlkXS5lY2hvUGxheWVycztcbiAgICAgICAgY29uc3QgZWNob1BlcmlvZCA9IHNvdW5kUGFyYW1zLmxvb3BQZXJpb2QgLyBzb3VuZFBhcmFtcy5sb29wRGl2O1xuICAgICAgICBjb25zdCBlY2hvQXR0ZW51YXRpb24gPSBNYXRoLnBvdyhzb3VuZFBhcmFtcy5sb29wQXR0ZW51YXRpb24sIDEgLyBzb3VuZFBhcmFtcy5sb29wRGl2KTtcbiAgICAgICAgbGV0IGVjaG9EZWxheSA9IDA7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gbnVtRWNob1BsYXllcnM7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGVjaG9QbGF5ZXJJbmRleCA9IChpbmRleCArIGkpICUgcGxheWVyTGlzdExlbmd0aDtcbiAgICAgICAgICBjb25zdCBlY2hvUGxheWVyID0gcGxheWVyTGlzdFtlY2hvUGxheWVySW5kZXhdO1xuXG4gICAgICAgICAgZWNob1BsYXllcnMucHVzaChlY2hvUGxheWVyKTtcbiAgICAgICAgICBlY2hvRGVsYXkgKz0gZWNob1BlcmlvZDtcbiAgICAgICAgICBzb3VuZFBhcmFtcy5nYWluICo9IGVjaG9BdHRlbnVhdGlvbjtcblxuICAgICAgICAgIHRoaXMuc2VuZChlY2hvUGxheWVyLCAnZWNobycsIHRpbWUgKyBlY2hvRGVsYXksIHNvdW5kUGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2NsZWFyJywgKCkgPT4ge1xuICAgICAgdGhpcy5fY2xlYXJFY2hvZXMoY2xpZW50KTtcbiAgICB9KTtcblxuICAgIHRoaXMuc2hhcmVkUGFyYW1zLnVwZGF0ZSgnbnVtUGxheWVycycsIHRoaXMuY2xpZW50cy5sZW5ndGgpO1xuICB9XG5cbiAgZXhpdChjbGllbnQpIHtcbiAgICBzdXBlci5leGl0KGNsaWVudCk7XG5cbiAgICB0aGlzLl9jbGVhckVjaG9lcyhjbGllbnQpO1xuICAgIHRoaXMuc2hhcmVkUGFyYW1zLnVwZGF0ZSgnbnVtUGxheWVycycsIHRoaXMuY2xpZW50cy5sZW5ndGgpO1xuICB9XG5cbiAgX2NsZWFyRWNob2VzKGNsaWVudCkge1xuICAgIGNvbnN0IGVjaG9QbGF5ZXJzID0gY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0uZWNob1BsYXllcnM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVjaG9QbGF5ZXJzLmxlbmd0aDsgaSsrKVxuICAgICAgdGhpcy5zZW5kKGVjaG9QbGF5ZXJzW2ldLCAnY2xlYXInLCBjbGllbnQudWlkKTtcblxuICAgIGNsaWVudC5tb2R1bGVzW3RoaXMuaWRdLmVjaG9QbGF5ZXJzID0gW107XG4gIH1cbn1cbiJdfQ==
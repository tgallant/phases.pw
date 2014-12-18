'use strict';

window.onload = function () {
  document.getElementById('bpm').value = 240;
  document.getElementById('pattern').value = 111011010;
  document.getElementById('measures').value = 2;
  document.getElementById('phase').value = 0;
};

var soundManager;

// set limit to >= 60 bpm else division err
var bpmConvert = function(x) {
  var a = x / 60;
  var b = 1000 / a;
  return b;
};

var phaseState = function(pattern, times, index) {
  var stateObj;
  if (index === 0) {
    var obj = pattern.repeat(times);
    stateObj = {
      'part1': obj,
      'part2': obj
    };
    return stateObj;
  }
  else {
    var cdr = pattern.repeat(times - 1);
    var car = pattern.slice(index, pattern.length);
    var part1 = pattern.repeat(times);
    var part2 = car+cdr+pattern.slice(0,index);
    console.log(part1,part2);
    stateObj = {
      'part1': part1,
      'part2': part2
    };
    return stateObj;
  }
};

var playSound = function(sound1, sound2, pattern, measures, index, interval) {
  console.log(index);
  if (index < pattern.length) {
    var phaseObj = phaseState(pattern, measures, index);
    var inner = function(x) {
      if (x < phaseObj.part1.length) {
        if (phaseObj.part1[x] === '1' && phaseObj.part2[x] === '1') {
          sound1.play();
          setTimeout(function(){ inner(x+1); }, interval);
        }
        else if (phaseObj.part1[x] === '1') {
          sound1.play();
          setTimeout(function(){ inner(x+1); }, interval);
        }
        else if (phaseObj.part2[x] === '1') {
          sound2.play();
          setTimeout(function(){ inner(x+1); }, interval);
        }
        else {
          setTimeout(function(){ inner(x+1); }, interval);
        }
      }
      else {
        playSound(sound1, sound2, pattern, measures, index+1, interval);
      }
    };
    inner(0);
  }
};

soundManager.setup({
  url: '/swf/',
  flashVersion: 9,
  onready: function() {

    var button = document.getElementById('clap');
    var bpm = document.getElementById('bpm');
    var pattern = document.getElementById('pattern');
    var measures = document.getElementById('measures');
    var phaseIter = document.getElementById('phase');

    var clavier = soundManager.createSound({
      id: 'clavier',
      url: '/clavier.mp3'
    });

    var drum = soundManager.createSound({
      id: 'drum',
      url: '/drum.mp3'
    });

    button.addEventListener('click', function() {
      var ms = bpmConvert(bpm.value);
      playSound(clavier, drum, pattern.value, measures.value, Number(phaseIter.value), ms);
    });

  }
});

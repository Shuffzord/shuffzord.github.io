function TextScramble(el, showlogo) {
  this.el = el;
  this.showlogo = showlogo || false;
  this.chars = "!<>-_\\/[]{}—=+*^?#________";
  this.update = this.update.bind(this);
  this.queue = [];
  this.frame = 0;
  this.frameRequest = null;
  this.resolve = null;
}

TextScramble.prototype.setText = function (newText) {
  var self = this;
  if (!this.el) return Promise.resolve(); // Check if the element exists

  var oldText = this.el.innerText || '';
  if (!oldText && !newText) return Promise.resolve();
  var length = Math.max(oldText.length, newText.length);
  var promise = new Promise(function (resolve) {
    self.resolve = resolve;
  });

  this.queue = [];
  for (var i = 0; i < length; i++) {
    var from = oldText[i] || "";
    var to = newText[i] || "";
    var start = Math.floor(Math.random() * 40);
    var end = start + Math.floor(Math.random() * 40);
    this.queue.push({ from: from, to: to, start: start, end: end });
  }

  cancelAnimationFrame(this.frameRequest);
  this.frame = 0;
  this.update();
  return promise;
};

TextScramble.prototype.update = function () {
  var output = "";
  var complete = 0;

  for (var i = 0, n = this.queue.length; i < n; i++) {
    var item = this.queue[i];
    var from = item.from;
    var to = item.to;
    var start = item.start;
    var end = item.end;
    var char = item.char;

    if (this.frame >= end) {
      complete++;
      output += to;
    } else if (this.frame >= start) {
      if (!char || Math.random() < 0.28) {
        char = this.randomChar();
        this.queue[i].char = char;
      }
      output += '<span class="dud">' + char + '</span>';
    } else {
      output += from;
    }
  }
  if (this.showlogo) { output += '<span class="logo__cursor"></span>'; }
  this.el.innerHTML = output;

  if (complete === this.queue.length) {
    this.resolve();
  } else {
    this.frameRequest = requestAnimationFrame(this.update);
    this.frame++;
  }
};

TextScramble.prototype.randomChar = function () {
  return this.chars[Math.floor(Math.random() * this.chars.length)];
};

// ——————————————————————————————————————————————————
// Example for your HTML
// ——————————————————————————————————————————————————

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
  // For the h1 title
  var titleEl = document.querySelector("#title");
  var titleFx = new TextScramble(titleEl, true);
  var titlePhrases = ["Principles", "Intelligence", "Cognition", "Learning", "Adaptation", "Evolution"];
  var paragraphPhrases = ["Structure in life", "Augmented thinking", "Human-AI collaboration", "Cognitive enhancement", "Intelligent assistance", "Symbiotic systems"];
  var titleCounter = 0;

  function nextTitle() {
    titleFx.setText(titlePhrases[titleCounter]).then(function () {
      setTimeout(nextTitle, 2000);
    });
    titleCounter = (titleCounter + 1) % titlePhrases.length;
  }

  // For the paragraph
  var paragraphEl = document.querySelector("#title + p");
  var paragraphFx = new TextScramble(paragraphEl);
  var paragraphCounter = 0;

  function nextParagraph() {
    paragraphFx.setText(paragraphPhrases[paragraphCounter]).then(function () {
      setTimeout(nextParagraph, 2500);
    });
    paragraphCounter = (paragraphCounter + 1) % paragraphPhrases.length;
  }

  // Start both animations
  nextTitle();
  setTimeout(nextParagraph, 1000); // Offset the paragraph by 1 second
});
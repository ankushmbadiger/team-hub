(function () {
  'use strict';
  var root = document.querySelector('.chat');
  if (!root) return;

  var list = document.getElementById('message-list');
  var form = document.getElementById('chat-form');
  var input = document.getElementById('chat-input');
  var statusEl = document.getElementById('conn-status');
  var me = root.dataset.currentUser;

  var STATUS_TEXT = { connecting: 'Connecting…', connected: 'Connected', disconnected: 'Disconnected. Retrying…' };

  /* ------------------------------------------------------------------
     CONNECTION ADAPTER (FAKE). REPLACE THIS WHOLE OBJECT with a real
     WebSocket later, keeping the same four methods:
       var ws = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://')
                              + location.host + root.dataset.wsPath);
       ws.onopen / ws.onclose -> onStatus('connected' | 'disconnected')
       ws.onmessage -> JSON.parse(event.data) -> onMessage(msg)
       send(text)   -> ws.send(JSON.stringify({ message: text }))
     ------------------------------------------------------------------ */
  var connection = {
    handlers: {},
    onStatus: function (fn) { this.handlers.status = fn; },
    onHistory: function (fn) { this.handlers.history = fn; },
    onMessage: function (fn) { this.handlers.message = fn; },
    connect: function () {
      var h = this.handlers;
      h.status('connecting');
      setTimeout(function () {
        h.status('connected');
        h.history([
          { user: 'maya', text: 'Morning all. Draft of the roadmap is in Shared Files.', time: '09:12' },
          { user: 'dev', text: 'Thanks, reading it now.', time: '09:15' }
        ]);
      }, 600);
    },
    send: function (text) {
      var h = this.handlers;
      setTimeout(function () { h.message({ user: me, text: text, time: now() }); }, 100);
    }
  };

  function now() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function render(msg) {
    var wrap = document.createElement('div');
    wrap.className = 'msg' + (msg.user === me ? ' msg--own' : '');

    var avatar = document.createElement('span');
    avatar.className = 'avatar';
    avatar.textContent = msg.user.slice(0, 2).toUpperCase();

    var body = document.createElement('div');
    body.className = 'msg__body';
    var meta = document.createElement('div');
    meta.className = 'msg__meta';
    var name = document.createElement('strong');
    name.textContent = msg.user;
    var time = document.createElement('span');
    time.textContent = msg.time;
    meta.append(name, time);
    var text = document.createElement('p');
    text.className = 'msg__text';
    text.textContent = msg.text; // textContent, never innerHTML: prevents XSS
    body.append(meta, text);

    wrap.append(avatar, body);
    list.appendChild(wrap);
    list.scrollTop = list.scrollHeight;
  }

  connection.onStatus(function (state) {
    statusEl.dataset.state = state;
    statusEl.textContent = STATUS_TEXT[state];
  });
  connection.onHistory(function (messages) {
    list.textContent = '';
    if (!messages.length) {
      var empty = document.createElement('p');
      empty.className = 'state';
      empty.textContent = 'No messages yet. Start the conversation.';
      list.appendChild(empty);
      return;
    }
    messages.forEach(render);
  });
  connection.onMessage(render);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    connection.send(text);
    input.value = '';
  });

  connection.connect();
})();

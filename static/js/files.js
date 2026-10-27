(function () {
  'use strict';
  var form = document.getElementById('upload-form');
  if (!form) return;

  var input = document.getElementById('file-input');
  var nameEl = document.getElementById('file-name');
  var errorEl = document.getElementById('upload-error');
  var maxMb = Number(form.dataset.maxMb) || 25;

  input.addEventListener('change', function () {
    var file = input.files[0];
    errorEl.hidden = true;
    nameEl.textContent = file ? file.name : 'No file selected';
  });

  // Convenience check only. The Django view must validate size and type again.
  form.addEventListener('submit', function (e) {
    var file = input.files[0];
    if (file && file.size > maxMb * 1024 * 1024) {
      e.preventDefault();
      errorEl.textContent = 'That file is larger than ' + maxMb + ' MB. Choose a smaller file.';
      errorEl.hidden = false;
    }
  });
})();

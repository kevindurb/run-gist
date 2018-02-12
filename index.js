const gistId = window.location.hash.substr(1);

if (gistId) {
  loadGistFiles(gistId);
} else {
  console.error('please supply gist id in hash');
}

function loadGistFiles(id) {
  console.log(`fetching gist ${id}`);
  fetch(`https://api.github.com/gists/${id}`)
    .then(response => response.json())
    .then(gist => gist.files)
    .catch(() => console.error('Error loading gist'))
    .then(files => {
      console.log('found gist... loading files...');
      Object.values(files).forEach(loadFile);
    });
}

function loadFile(file) {
  switch(file.type) {
    case 'application/javascript':
      loadIntoElType('script', file);
      break;
    case 'text/css':
      loadIntoElType('style', file);
      break;
    case 'text/html':
      loadHtmlToBody(file);
      break;
    default:
      console.error(`Unknown file type: ${file.type}`);
  }
}

function loadIntoElType(elType, file) {
  console.log(`loading ${file.filename}`);
  fetch(file.raw_url)
    .then(response => response.text())
    .then(text => {
      const el = document.createElement(elType);
      el.innerHTML = text;
      document.body.appendChild(el);
      console.log(`${file.filename} loaded into body in <${elType} />`);
    });
}

function loadHtmlToBody(file) {
  console.log(`loading ${file.filename}`);
  fetch(file.raw_url)
    .then(response => response.text())
    .then(text => {
      document.body.innerHTML += text;
      console.log(`${file.filename} appended to body`);
    });
}

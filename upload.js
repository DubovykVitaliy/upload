function formatBytes(bytes, decimals = 0) {
  if (!bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const element = function (tag, classes = [], content = '') {
  //
  const el = document.createElement(tag);
  if (!Array.isArray(classes)) {
    el.classList.add(classes);
  }
  if (classes.length && Array.isArray(classes)) {
    el.classList.add(...classes);
  }
  if (content) {
    el.textContent = content;
  }
  return el;
};

function noop() {}

export function upload(selector, options = {}) {
  let files = [];
  const input = document.querySelector(selector);
  const openBtn = element('button', 'btn', 'open');
  const preview = element('div', 'preview');
  const uploadBtn = element('button', ['btn', 'primary'], 'upload');
  const onUpload = options.onUpload ?? noop;
  //

  if (options.multi) {
    input.setAttribute('multiple', true);
  }
  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join(','));
  }
  //
  input.insertAdjacentElement('afterend', preview);
  input.insertAdjacentElement('afterend', uploadBtn);
  input.insertAdjacentElement('afterend', openBtn);
  //
  uploadBtn.style.display = 'none';
  const triggerInput = () => {
    input.click();
    input.addEventListener('change', changeHandler);
  };
  //
  const removeHandler = (event) => {
    if (!event.target.dataset.name) {
      return;
    }
    const name = event.target.dataset.name;

    files = files.filter((file) => file.name !== name);

    const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview__image');
    block.classList.add('removing');

    setTimeout(() => {
      block.remove();
    }, 300);

    if (!files.length) {
      uploadBtn.style.display = 'none';
      preview.removeEventListener('click', removeHandler);
      document.removeEventListener('keydown', removeKeyHandler);
      uploadBtn.removeEventListener('click', uploadHandler);
      input.removeEventListener('change', changeHandler);
    }
  };
  //
  const removeKeyHandler = (e) => {
    if (e.key == 'Enter') {
      removeHandler(e);
    }
  };
  //
  const changeHandler = function (event) {
    if (!event.target.files.length) {
      return;
    }
    files = Array.from(event.target.files);

    preview.innerHTML = '';
    files.forEach((file) => {
      if (!file.type.match('image')) {
        return;
      }
      const reader = new FileReader();

      reader.onload = (ev) => {
        const src = ev.target.result;

        preview.insertAdjacentHTML(
          'afterbegin',
          `
          <div class="preview__image" tabindex='0'>
            <div class="preview__remove" tabindex='0' data-name="${file.name}">&times;</div>
            <img src="${src}" alt="${file.name}">
            <div class="preview__info">
              <span>${file.name}</span>
              <span>${formatBytes(file.size)}</span>

            </div>
          </div>
          `
        );
      };

      reader.readAsDataURL(file);
    });
    //
    uploadBtn.style.display = 'inline';
    preview.addEventListener('click', removeHandler);
    document.addEventListener('keydown', removeKeyHandler);
    uploadBtn.addEventListener('click', uploadHandler);
  };
  //

  //
  const clearInfo = (el) => {
    el.style.bottom = '0';
    el.innerHTML = `<div class="preview__info--progress"></div>`;
    //
  };
  //
  const uploadHandler = () => {
    //
    preview.querySelectorAll('.preview__remove').forEach((e) => {
      e.remove();
    });
    const prevInfoBlocks = preview.querySelectorAll('.preview__info');
    prevInfoBlocks.forEach(clearInfo);
    onUpload(files, prevInfoBlocks);
    uploadBtn.style.display = 'none';
    uploadBtn.removeEventListener('click', uploadHandler);
  };
  //
  openBtn.addEventListener('click', triggerInput);
  // input.addEventListener('change', changeHandler);
  // preview.addEventListener('click', removeHandler);
  // document.addEventListener('keydown', (e) => {
  //   if (e.key == 'Enter') {
  //     removeHandler(e);
  //   }
  // });
  // document.addEventListener('keydown', removeKeyHandler);
  // uploadBtn.addEventListener('click', uploadHandler);
}

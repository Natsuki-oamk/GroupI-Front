function showToast(message, type, autoDismissDelay = 5000) {
  const toastTemplate = document.createElement('div');
  toastTemplate.classList.add('toast');
  toastTemplate.classList.add('position-absolute');
  toastTemplate.classList.add('top-0');
  toastTemplate.classList.add('end-0');
  toastTemplate.style.margin = '130px'; 
  toastTemplate.classList.add(`bg-${type}`);
  toastTemplate.setAttribute('role', 'alert');
  toastTemplate.setAttribute('aria-live', 'assertive');
  toastTemplate.setAttribute('aria-atomic', 'true');
  toastTemplate.innerHTML = `
      <div class="toast-header">
          <strong class="me-auto">Notification</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
          ${message}
      </div>
  `;

  document.getElementById('toast-container').appendChild(toastTemplate);

  const toast = new bootstrap.Toast(toastTemplate, {
      autohide: true,
      delay: autoDismissDelay
  });

  toast.show();
}
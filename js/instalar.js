let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBtnTradicional').style.display = 'inline-block';

  document.getElementById('installBtnTradicional').addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        console.log('Ensal\'Armelo instalada');
      }
      deferredPrompt = null;
    });
  });
});
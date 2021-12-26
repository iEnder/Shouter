function disableShoutButton(form) {
  const input = form.querySelector('#shout-input');
  const button = form.querySelector('#shout-submit');
  if (input) {
    input.on('keyup', function() {
      if (input.value.length > 0) {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    });
  }
}

export default disableShoutButton;

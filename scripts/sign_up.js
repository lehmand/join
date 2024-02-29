/**
 * Performs the sign-up process.
 * @returns {Promise<void>} A promise that resolves once the sign-up process is complete.
 */
async function signUp() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let userId = 1;

  let users = await getUsers();
  let contacts = await getContacts();

  if (users.length > 0) {
    userId = users.slice(-1)[0].userId + 1;
  }

  users.push({ userId, name, email, password });
  contacts.push({ userId, name, email, phone: "" });

  if ((await saveUsers(users)) && (await saveContacts(contacts))) {
    showToast("You signed up successfully.");
    setTimeout(() => {
      window.location.href = "index.html?registered=true";
    }, 2500);
  }
}

/**
 * Checks if the password and password confirmation match.
 * @returns {boolean} True if passwords match, false otherwise.
 */
function checkPasswords() {
  let password = document.getElementById("password");
  let passwordConfirm = document.getElementById("password-confirm");

  if (password.value == passwordConfirm.value) {
    passwordConfirm.parentElement.classList.remove("has-error");
    passwordConfirm.setCustomValidity("");
    return true;
  }

  passwordConfirm.parentElement.classList.add("has-error");
  passwordConfirm.setCustomValidity("Passwords do not match.");
  return false;
}

/**
 * Checks if the privacy policy acceptance is checked.
 * @returns {boolean} True if privacy policy is accepted, false otherwise.
 */
function checkPrivacy() {
  var acceptPp = document.getElementById("accept-pp");
  var signupButton = document.getElementById("signup-button");

  if (acceptPp.checked) {
    signupButton.disabled = false;
    return true;
  }

  signupButton.disabled = true;
  return false;
}

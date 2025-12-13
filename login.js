// ------- LOGIN & SIGNUP -------

loginForm.onsubmit = e => {
  e.preventDefault();
  const username = loginForm.loginUsername.value.trim();
  const password = loginForm.loginPassword.value;

  if (!users[username]) {
    loginError.textContent = "User not found.";
    return;
  }
  if (users[username].password !== password) {
    loginError.textContent = "Incorrect password.";
    return;
  }
  currentUser = username;
  saveSession(username);
  loginError.textContent = "";
  loadDashboard();
  showPage(dashboardPage);
};

signupForm.onsubmit = e => {
  e.preventDefault();
  const username = signupForm.signupUsername.value.trim();
  const password = signupForm.signupPassword.value;
  const confirmPassword = signupForm.signupPasswordConfirm.value;

  if (users[username]) {
    signupError.textContent = "Username already exists.";
    return;
  }
  if (password !== confirmPassword) {
    signupError.textContent = "Passwords do not match.";
    return;
  }
  users[username] = {
    password,
    entries: [],       // classes & clubs
    achievements: [],  // earned achievements
    timerSeconds: 0,
  };
  saveUsers();
  signupError.textContent = "";
  alert("Account created! Please log in.");
  showPage(loginPage);
};

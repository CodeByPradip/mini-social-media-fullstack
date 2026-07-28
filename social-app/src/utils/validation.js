export const loginValidation = (usernameOrEmail, password) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

  let errors = {
    usernameOrEmail: "",
    password: "",
  };

  // usernameOrEmail validation
  if (!usernameOrEmail) {
    errors.usernameOrEmail = "Email or Username is required";
  } else if (usernameOrEmail.includes("@")) {
    if (!emailRegex.test(usernameOrEmail)) {
      errors.usernameOrEmail = "Invalid email format";
    }
  } else {
    if (!usernameRegex.test(usernameOrEmail)) {
      errors.usernameOrEmail = "Username must be 3-20 chars, no spaces";
    }
  }

  // password validation
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Minimum 6 characters required";
  } else if (!/[A-Z]/.test(password)) {
    errors.password = "Must include 1 uppercase letter";
  } else if (!/[0-9]/.test(password)) {
    errors.password = "Must include 1 number";
  }

  return errors;
};

// signup validation
export const signupValidation = (data) => {
  let errors = {
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  const mob_rex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;

  const { username, fullName, email, phone, password } = data;

  // username validation
  if (!username) {
    errors.username = "Username is required";
  } else if (!usernameRegex.test(username)) {
    errors.username = "Username must be 3-20 chars, no spaces";
  }

  if (!fullName) {
    errors.fullName = "fullName required";
  } else if (fullName.length < 3 && fullName.length > 20) {
    errors.fullName = "fullName must be 3-20 chars, no spaces";
  }

  // email validation
  if (!email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }

  if (!phone) {
    errors.phone = "Phone number is required";
  } else if (phone.length <= 9) {
    errors.phone = "Numer must be 10 digits";
  } else if (!mob_rex.test(phone)) {
    errors.phone = "Enter a valid number";
  }
  // password validation
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Minimum 6 characters required";
  } else if (!/[A-Z]/.test(password)) {
    errors.password = "Must include 1 uppercase letter";
  } else if (!/[0-9]/.test(password)) {
    errors.password = "Must include 1 number";
  }

  return errors;
};

//  update profile validate
export const updateProfileValidation = (data) => {
  let errors = {
    username: "",
    fullName: "",
    email: "",
    phone: "",
    bio: "",
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  const mob_rex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;

  const { username, fullName, email, phone, bio } = data;
  console.log("username", username);
  console.log("email", email);
  console.log("phone", phone);
  console.log("bio", bio);

  if (fullName.length < 3 && fullName.length > 20) {
    errors.fullName = "fullName must be 3-20 chars, no spaces";
  }

  // username validation
  if (!usernameRegex.test(username)) {
    errors.username = "Username must be 3-20 chars, no spaces";
  }

  if (!emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }

  // if (!bio === undefined && !bio === null && !bio === "") {
  //   if (bio.length <= 150) {
  //     errors.bio = "Bio must less then 150 word";
  //   }
  // }

  if (bio) {
    const wordCount = bio.trim().split(/\s+/).length;

    if (wordCount > 150) {
      errors.bio = "Bio must be less than 150 words.";
    }
  }

  if (phone.length <= 9) {
    errors.phone = "Numer must be 10 digits";
  } else if (!mob_rex.test(phone)) {
    errors.phone = "Enter a valid number";
  }

  return errors;
};

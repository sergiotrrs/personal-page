const contactForm = document.forms["contactForm"];

/**
 * Sends form data via an HTTP POST request using the fetch API.
 * This function handles server communication and expects a JSON response.
 * @async
 * @param {Object} formData An object containing the form's input data
 * @returns {Promise<Object>} The parsed JSON response from the server.
 * @throws Will throw an error if the fetch request fails or if the response cannot be parsed.
 */
const postFormData  = async (formData) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Indicates the request body format
      Accept: "application/json", // Expect JSON response from the server
    },
    body: JSON.stringify({ // Converts form data into a JSON string
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    }),
  };
  // Sends the request to the specified URL and waits for the response
  const response = await fetch(
    "https://formsubmit.co/ajax/your-email@email.com",
    options
  );
  const data = await response.json();
  return data;
};

/**
 * Extracts form data from the form's input elements
 * @param {Object} contactForm reference
 * 
 */
const extractFormData = (contactForm) => {
  const formData = {
    name: contactForm.elements["name"].value,
    email: contactForm.elements["email"].value,
    phone: contactForm.elements["phone"].value,
    message: contactForm.elements["message"].value,
  };
  return formData;
};

/**
 * Shows or hides the loading spinner based on the 'show' parameter
 * @param {boolean} show 
 */
const toggleSpinner = (show) => {
  const spinner = document.getElementById("spinner");
  spinner.classList.toggle("d-none", !show);
};

/**
 * Enables or disables the submit button based on the 'enable' parameter
 * @param {boolean} enable 
 */
const toggleSubmitButton = (enable) => {
  const button = document.getElementById("submitButton");
  button.disabled = !enable;
};

/**
 * Displays a success or error message for 5 seconds
 * @param {Object} refMessage 
 */
const showMessage = (refMessage) => {
  refMessage.classList.remove("d-none");
  setTimeout(() => refMessage.classList.add("d-none"), 5000);
};

/**
 * Displays the success message by referencing the corresponding element
 * 
 */
const showSuccessMessage = () =>
  showMessage(document.getElementById("submitSuccessMessage"));

/**
 * Displays the error message and logs the error to the console
 * @param {string} error 
 */
const showErrorMessage = (error) => {
  console.error(error);
  showMessage(document.getElementById("submitErrorMessage"));
};

/**
 * Handles the form submission process: disables the button, 
 * shows spinner, sends data, and shows a success or error message
 * @param {Object} contactForm reference
 */
const submitForm = async (contactForm) => {
  const formData = extractFormData(contactForm);
  try {
    toggleSubmitButton(false);
    toggleSpinner(true);
    await postFormData(formData);
    showSuccessMessage();
  } catch (error) {
    showErrorMessage(error);
  } finally {
    toggleSpinner(false);
    toggleSubmitButton(true);
  }
};

/**
 * Event listener to handle the form's 'submit' event
 */
contactForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Stops the default browser behavior for that event.
  event.stopPropagation(); // Prevents propagation of the same event from being called.
  contactForm.classList.add("was-validated"); // Adds Bootstrap validation class
  if (contactForm.checkValidity()) {
    submitForm(contactForm);
    contactForm.classList.remove("was-validated"); // Removes the validation class after submission
    contactForm.reset(); // Restores a form element's default values
  }
});

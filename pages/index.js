// Import the Head component from the "next/head" module and the useState hook from the "react" module
import Head from "next/head";
import { useState } from "react";
// Import the CSS styles from the "index.module.css" module
import styles from "../styles/index.module.css";

// Define a function component called Home that serves as the main page of the application
export default function Home() {
  // Define two state variables using the useState hook: animalInput and result
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
  // state variable isLoading using the useState hook
  const [isLoading, setIsLoading] = useState(false);
  // state variable inputError using the useState hook
  const [inputError, setInputError] = useState(null);
  
  // Define an asynchronous function called onSubmit that handles the form submission event
  async function onSubmit(event) {
    event.preventDefault();

    // Call the validateInput function with the current value of the animalInput state variable
    const validationResult = validateInput(animalInput);
    console.log("Validation result:", validationResult ); 
    // Check if the validationResult is not null (i.e. if there was an error with the input validation)
    if (validationResult !== null) {
    
      // Set the inputError state variable to the validation result, which will display an error message to the user
      setInputError(validationResult);
      
      // Return to exit the function and prevent the rest of the onSubmit function from executing
      return;
    }

    //Set isLoading state variable to true to indicate that the application is currently loading or waiting for a response
    setIsLoading(true);

    // sets the inputError state variable to null, effectively clearing any previous error message that may have been displayed to the user.
    setInputError(null);
    try {
      // Send a POST request to the "/api/generate" endpoint with the animalInput value in the request body as a JSON object
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      // Parse the response body as a JSON object
      const data = await response.json();

      // Check the response status code; if it's not 200, throw an error with the message from the server response
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      // Update the result state variable with the generated name, and reset the animalInput state variable to an empty string
      setResult(data.result.join(', '));
      setAnimalInput("");
    } catch(error) {
      // If an error occurs during the process, log the error to the console and display an alert with the error message
      console.error(error);
      alert(error.message);
    } finally {
      // set the isLoading state to true when the API request starts and to false when it completes or if an error occurs:
      setIsLoading(false);
    }
  }


// validation function that accepts the user's input and returns an error message if validation fails, or null if the input is valid:
function validateInput(input) {
  // Check for non-alphabetic characters
  if (!/^[a-zA-Z\s]*$/.test(input)) {
    return 'Please enter only alphabetic characters.';
  }

  // Check for excessively long input (e.g., more than 50 characters)
  if (input.length > 50) {
    return 'Input should not exceed 50 characters.';
  }

  // If the input passes validation, return null
  return null;
}




  // loading indicator component 
  function LoadingIndicator(){
    return <div>Loading...</div>
  }
  // Return the HTML structure of the main page, including a Head component with the page title and icon, a main section with a form and a result section, and CSS classes defined in the "index.module.css" module
  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Name my pet</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form>

        {/* display the validation error message in the Home component if inputError is not null */}
        <div className={styles.errorMessage}>{inputError}</div>
       
        <div className={styles.result}>
          {/* conditionally render the LoadingIndicator component based on the isLoading state */}
          {isLoading ? <LoadingIndicator /> : result }
          </div>
      </main>
    </div>
  );
}

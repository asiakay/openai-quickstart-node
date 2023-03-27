// Import the Configuration and OpenAIApi classes from the "openai" library
import { Configuration, OpenAIApi } from "openai";

// Create a new Configuration object with the OPENAI_API_KEY environment variable as the API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a new OpenAIApi object with the Configuration object as the configuration
const openai = new OpenAIApi(configuration);

// Export an asynchronous function as the default export of the module that handles incoming HTTP requests to the API endpoint
export default async function (req, res) {
  // Check if the OPENAI_API_KEY environment variable is set
  if (!configuration.apiKey) {
    // If it's not set, return a 500 error response with an error message
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  // Check the "animal" field of the HTTP request body to ensure it's not empty
  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    // If it's empty, return a 400 error response with an error message
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
/*     // Create a new OpenAI completion request with the "model", "prompt", and "temperature" parameters set
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
      n: 5,
    }); */
    // Extract the first generated name from the "choices" array in the completion response and return it as the result of the API request in a JSON object
    
    const names = await getUniqueNames(animal, 5);
    res.status(200).json({ result: names});
    console.log(names);

  } catch(error) {
    // If an error occurs, handle it and return a JSON object containing an error message
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

// Define a function that takes an animal parameter and returns a string containing a prompt for generating superhero animal names
function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest a name for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw

Animal: Dog
Names: Ruff the Protector

Animal: ${capitalizedAnimal}
Names:`;
}


async function getUniqueNames(animal, count){
  const uniqueNames = new Set();
  while (uniqueNames.size < count){
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
      n: Math.min(5, count - uniqueNames.size),
    });
 
  const newNames = completion.data.choices
  .map((choice) => choice.text.trim().split('/n')[0]);

  for (const name of newNames){
    uniqueNames.add(name);
  }
 }

return Array.from(uniqueNames);

}
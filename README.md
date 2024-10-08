# Watios

**Watios** is a lightweight Axios wrapper designed for enhanced error handling with real-time WhatsApp integration. It simplifies the process of handling errors in HTTP requests by sending detailed alerts directly to your WhatsApp in case of failures. Watios offers flexibility, detailed error reporting, and a seamless way to stay updated about issues in your API requests.

## Features

- **Axios-based**: Utilizes Axios to make HTTP requests.
- **Error Notifications**: Sends error details to a specified WhatsApp number.
- **Real-time Alerts**: Instantly informs you of issues like failed requests, timeouts, and connection errors.
- **Customizable Configuration**: Easily configure timeout, headers, and more.
- **Duplicate Error Prevention**: Prevents sending the same error message multiple times within 3 minutes.
- **CommonJS and ESM**: Supports both `require` and `import` styles.

## Installation

Install the package using npm:

`npm install watios`


Usage
1. Setting Up Watios
First, you need to import and set up the Watios instance by providing a phone number and a passkey for validation.
You will get the passkey from the watios-dashboard.
```

DO NOT FORGET TO ADD THIS LINE AT THE BOTTOM. THIS IS THE MIDDLEWARE USED.

// Error-handling middleware
app.use(watiosErrorHandler);

// Start the server
app.listen(6000, () => {
  console.log('Server running on port 6000');
});

--------------------------------------------------------------
TO INITIALIZE


import { createWatios, watiosAlert } from 'watios';

const { instance, watiosErrorHandler } = createWatios({
  phonenumber: '919778715634', // Replace with your WhatsApp number
  passkey: , // Replace with your actual passkey
});

const { createWatios, watiosAlert } = require('./node_modules/watios/dist/index.cjs'); // Adjust the import path

const { instance, watiosErrorHandler } = createWatios({
  phonenumber: '919778715634', // Replace with your WhatsApp number
  passkey: , // Replace with your actual passkey
});


The instance can be used to call api just like axios object.

```

2. Making API Requests
Watios uses Axios under the hood, so you can use it to make HTTP requests in the same way. Here’s an example of making a POST request:

```

const requestBody = {
  key: 'value'
};

instance.post('https://api.example.com/data', requestBody)
  .then(response => {
    console.log('Success:', response.data);
  })
  .catch(error => {
    watiosAlert(error); // Sends the error details to WhatsApp
  });
```

## Error Handling
Watios is built to handle errors seamlessly. It will automatically send detailed error information to your specified WhatsApp number if an Axios request fails:


```
try {
  // Trigger an error (e.g., calling an undefined function)
  const result = nonExistentFunction();
} catch (error) {
  watiosAlert(error); // Sends general errors to WhatsApp
}


For async function we should use next()

catch (error) {
    // Forward the error to the error-handling middleware   
    next(error);
  }


```

4. Preventing Duplicate Errors
Watios includes a mechanism to prevent sending the same error multiple times within a 3-minute window. This is useful for avoiding spam if the same error repeatedly occurs in a short span.

5. Handling Axios-Specific and General Errors
Watios can handle both Axios-specific errors (e.g., network issues, server errors) and general JavaScript errors (e.g., reference errors, type errors).

Here’s an example of how it handles multiple types of errors:

```
try {
  // API request that might fail
  await watios.get('https://api.example.com/fail');
} catch (error) {
  watiosAlert(error); // Sends the error to WhatsApp
}
```

## Environment Variables
For security, Watios relies on environment variables to store sensitive information. Make sure to set the following in your .env file:

`PASSKEY=your_secure_passkey`


## Configuration

### Options for `createWatios`

| Option        | Type     | Description                                                   |
|---------------|----------|---------------------------------------------------------------|
| `phonenumber` | `string` | The WhatsApp number where errors will be sent (with country code). |
| `passkey`     | `string` | A passkey used for validation (recommended to set in `.env`).   |


## Rollup Build
Watios is bundled using Rollup, and it supports both CommonJS and ES module formats. You can build the package with:

`npm run build`

This will output the following:

dist/index.cjs.js: CommonJS version
dist/index.esm.js: ES Module version


## Importing and Requiring Watios
You can import Watios in either ES module or CommonJS format:

- ES Module:
  
`import { createWatios, watiosAlert } from 'watios';`

- CommonJS:

`const { createWatios, watiosAlert } = require('./node_modules/watios/dist/index.cjs'); // Adjust the import path`



## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.





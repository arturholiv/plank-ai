
# Plank AI - Code Snippet Refactoring & Explanation Tool




## To install and run the project


Backend

```bash
  cd Backend
  npm install
  npm start
```
The .env file is not included in the repository, so you will need to create it yourself based on the .env.example file in the Backend folder.

Add the OPENAI_API_KEY to the .env file.

Frontend

```bash
  cd Frontend
  npm install
  npm start
```


## Features i would add in this project

- Make the app bilingual to portuguese and english (or any other language), providing the user the option to choose the language with a toggle
  button or a dropdown menu. Then i would send the language to the backend and provide the response in the language chosen by the user;
- Possibility to change the code language. Providing the user with a dropdown menu to choose the desired language or even enabling the user
  to write the  desired language in the code snippet and sending it to the backend;      
- A chat History, making the user able to see the chat history. To make this possible, i could save the conversation 
  in the database (or even local storage when a DB is not available) and then i would be able to display the chat history to the user;

## Code repository

https://github.com/arturholiv/plank-ai

## Deploy
I wanted to make the project available to be accessed from any device so i deployed the project on:

https://plankai.arturholiv.com.br/

And i will be adding some new features to it on:

https://plankaiv2.arturholiv.com.br/

Both versions are mobile responsive and the backend is the same for both versions.

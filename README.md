# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

---

## Full Stack Application Setup (Frontend + Django Backend)

This project now includes a Django backend integrated with the React frontend.
Follow these steps to set up and run both parts of the application.

### Prerequisites

*   Node.js and npm (for the React frontend)
*   Python 3.x and pip (for the Django backend)

### Backend Setup (Django)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a Python virtual environment:**
    (If you don't have `virtualenv` installed, you might need to install it first: `pip install virtualenv`)
    ```bash
    python -m venv venv  # or python3 -m venv venv
    ```

3.  **Activate the virtual environment:**
    *   On macOS and Linux:
        ```bash
        source venv/bin/activate
        ```
    *   On Windows:
        ```bash
        .\venv\Scripts\activate
        ```

4.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Apply database migrations:**
    (This will create the SQLite database file and set up the necessary tables)
    ```bash
    python manage.py migrate
    ```

6.  **Create a superuser (optional but recommended for testing):**
    Follow the prompts to create an admin user.
    ```bash
    python manage.py createsuperuser
    ```
    (Note: A default superuser 'admin' with password 'adminpassword123' was created during the initial setup if you followed the automated steps. You can use this or create your own.)

7.  **Start the Django development server:**
    ```bash
    python manage.py runserver
    ```
    The backend will typically run on [http://localhost:8000](http://localhost:8000).

### Frontend Setup (React)

1.  **Navigate to the project root directory** (if you are in the `backend` directory, go one level up: `cd ..`).

2.  **Install JavaScript dependencies:**
    (If you haven't installed them yet or if `package.json` has changed)
    ```bash
    npm install
    ```

3.  **Start the React development server:**
    ```bash
    npm start
    ```
    The frontend will typically run on [http://localhost:3000](http://localhost:3000) and will open automatically in your browser.

### Running Both Servers

*   You'll need to run the backend Django server and the frontend React server in separate terminal windows.
*   Ensure the backend is running before you try to log in or register from the frontend, as it relies on the backend APIs.

### Default Superuser
During the automated setup, a superuser may have been created with the following credentials:
*   **Username:** `admin`
*   **Password:** `adminpassword123`
*   **Email:** `admin@example.com` (or similar)

You can use these credentials to log into the Django admin interface (usually at `/admin/` on the backend URL, e.g., `http://localhost:8000/admin/`) or to test login on the frontend.

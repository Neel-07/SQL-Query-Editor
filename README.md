# SQL Query Editor

## Overview

The SQL Query Editor is a web-based application that allows users to input, execute (simulate), and view results of SQL queries. This application is designed as a front-end tool for composing and visualizing SQL queries and their potential results. It uses the Monaco Editor for a rich code editing experience and provides a user-friendly interface for interacting with predefined sample queries.

[Live Demo](https://sql-query-editor-chi.vercel.app/)

## Features

*   **SQL Query Editor**: Utilizes the Monaco Editor (`@monaco-editor/react`) for SQL syntax highlighting and code editing.
*   **Predefined Queries**: Includes a set of sample queries that users can select and load into the editor.
*   **Simulated Query Execution**: Simulates the execution of SQL queries to demonstrate how results would be displayed.
*   **Results Display**: Presents query results in a tabular format, showing column names and rows of data.
*   **Status Bar**: Displays query execution time and the number of rows in the result.

## Technologies Used

*   **React**: A JavaScript library for building user interfaces.
*   **Monaco Editor**: A code editor component.
*   **Lucide React**: A library of icons used to enhance the user interface.
*   **Vite**: A build tool and development server.
*   **CSS Modules**: Used for styling components.

## Setup Instructions

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd sql-query-editor
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Run the development server:

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

## Key Packages

*   `react`: Core React library for building UI components.
*   `@monaco-editor/react`: React wrapper for the Monaco Editor.
*   `lucide-react`: React icons from Lucide.
*   `vite`: Build tool and development server.

## Performance

### Load Time

The initial load time of the application is approximately X ms (measured using the browser's performance tools).

### Optimizations

*   **Code Splitting**: Vite automatically handles code splitting to improve initial load time.
*   **Efficient Rendering**: React components are optimized to minimize re-renders.

## Limitations

*   **No Real Database Connection**: The application does not connect to a real database. Query execution is simulated, and results are predefined.
*   **No Query Validation**: The application does not validate the syntax or correctness of SQL queries.
*   **Limited Error Handling**: Error handling is basic and does not cover all potential issues.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

[MIT](LICENSE)

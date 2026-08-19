<div align="center">

# HsOsnabrueckFilterICS

Filter ICS files effectively with ease!


[Usage](#usage)  • [Run Locally](#run-the-project-locally) • [Development](#development) • [Contributing](#contributing) • [License](#license)

</div>

## Features

- 📅 Filters ICS files by user-defined criteria
- 🌐 Simple, intuitive web interface for configuration
- 📱 Fully responsive design for mobile and desktop
- 🚀 Hosted on Google Cloud for seamless deployment

## Usage

Access the tool at https://asahiska.github.io/HS-Calendar

### Steps to Filter ICS Files

1. Provide the original link to the ICS file.
2. Use the guided interface to configure the desired filtering options.
3. Generate a unique URL containing all filter parameters.
4. View and share the filtered calendar

The filtering is powered by a Node.js server hosted as a container on Google Cloud.


## Run the Project Locally

To set up and run the project locally, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [Docker](https://www.docker.com/)

### Setup

1. Clone the repository:
   ```bash
 
   ```

2. Install dependencies:
    - Navigate to the `CalenderFrontend` folder and run:
      ```bash
      npm install
      ```
    - Navigate to the `CalenderBackend` folder and run:
      ```bash
      npm install
      ```

3. Start the frontend:
   ```bash
   npm run dev
   ```

4. Build and run the Docker container for the Node.js server:
   ```bash
   docker build -t calender-backend .
   ```

   Ensure the URL of the Node.js server is properly configured in the frontend settings.
   (.env File)

5. Access the application in your browser at `http://localhost:8080/` (or the configured port).

## Development

This project is open for contributions and improvements. Developers can:

- Fork the repository
- Submit bug fixes or enhancements via pull requests

### Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) format. Examples:

- `feat: Add filtering by event type`
- `fix: Resolve timezone handling issues`
- `docs: Update README with deployment instructions`

## Contributing

Contributions are welcome! Follow these steps to get started:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -am 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

<div align="center">
  <strong>Filter SemPlan</strong> - Simplifying calendar filtering for everyone
</div>

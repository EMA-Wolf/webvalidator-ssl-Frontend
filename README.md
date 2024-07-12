# React + Vite with ACME SSL Certificate Generation

This project demonstrates a full-stack application using React and Vite on the frontend, and Node.js with Express on the backend. The application allows users to add a website and generate an SSL certificate for it by providing a domain name and an email address. The process leverages the ACME protocol to obtain certificates from Let's Encrypt.

Frontend: React + Vite
The frontend is built with React and Vite, providing a fast and modern development environment with Hot Module Replacement (HMR) and linting rules.

Key Features
Add Site: Users can input a domain name and email address to initiate the SSL certificate generation process.
Check Parameters: The application verifies the provided domain name and email address before proceeding.
Generate SSL Certificate: The frontend communicates with the backend to generate and verify SSL certificates.


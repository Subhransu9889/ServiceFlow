# ServiceFlow - Frontend

ServiceFlow is a comprehensive service management platform designed to streamline workflows and enhance productivity. This frontend application is built with React and modern web technologies to provide a seamless user experience.

## 🚀 Features

- **Dashboard:** Real-time overview of service metrics and statuses.
- **Service Management:** Create, update, and track service requests.
- **User Authentication:** Secure login and role-based access control.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Interactive UI:** Built with high-performance components for a smooth feel.

## 🛠️ Tech Stack

- **Framework:** [React](https://reactjs.org/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) / Context API
- **Styling:** Tailwind CSS / Styled Components
- **Routing:** React Router v6
- **API Client:** Axios

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## ⚙️ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/serviceflow.git
   cd serviceflow/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add your backend API URL:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Run the development server:**
   ```bash
   npm start
   ```
   Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 🏗️ Building for Production

To create an optimized build for production:
```bash
npm run build
```
The build folder will contain the static files ready for deployment.

## 🧪 Testing

Run the test suite using:
```bash
npm test
```

## 📄 License

This project is licensed under the MIT License.

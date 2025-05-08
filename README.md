# Group

A group chat application with user authentication, session management, user theme preference, a custom emoji tray, and the Tenor API.

## Technologies Used

- React
- MongoDB
- express-session (npm package)
- socket.io (npm package)
- Tenor GIF API
- Intersection Observer API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Tenor API key

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/gogorya/group.git
   cd group
   ```

2. Install dependencies:

   ```sh
   cd group-chat
   npm install

   cd ../group-chat-server
   npm install
   ```

3. Create a `.env` file in **/group-chat-server** with the following keys:

   ```env
   PORT=8080
   DATABASE_URL=mongodb://localhost:27017/your-db-name
   SESSION_KEY=your-session-key
   SESSION_STORE_KEY=your-session-store-key
   TENOR_KEY=your-tenor-api-key
   ```

4. Run the development server:

   ```sh
   # /group-chat
   npm start
   # /group-chat-server
   npm run start_local
   ```

5. Build the React application and move the **build** folder:

   ```sh
   # /group-chat
   npm run build
   mv build/ ../group-chat-server/
   ```

6. Running the production build:

   ```sh
   # /group-chat-server
   npm run build_local
   ```

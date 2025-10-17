🧩 1. Unzip the project

Download the file: jobboard.zip

Extract it anywhere (for example: Desktop/JobBoard)

After unzipping, you’ll see something like this:

jobboard/
 ├── backend/
 ├── frontend/
 ├── README.md 
 

⚙️ 2. Install Node.js

You need Node.js v18 or higher.

👉 Check if installed:

>>node -v
>>npm -v


If not installed, download from https://nodejs.org/

🧩 MongoDB Setup
Option 1 — Use a real MongoDB (Recommended)

We’ll connect your backend to a real MongoDB, either locally or in the cloud.

👉 Step 1. Create a free MongoDB database

Go to https://www.mongodb.com/cloud/atlas

Sign up (it’s free)

Create a new project → Create cluster

Choose “Free Shared” → AWS / region near you

Once cluster is ready:

Click “Connect”

Choose “Connect using MongoDB Compass”

Copy the connection string (it will look like this):

mongodb+srv://<username>:<password>@cluster0.abcd.mongodb.net/jobboard


👉 Step 2. Add it to your .env file

In your backend folder, create a file named .env if not already there:

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcd.mongodb.net/jobboard
JWT_SECRET=supersecretkey
PORT=4000


(Replace <username> and <password> with your actual credentials)



🧩Then reopen your terminal/VS Code.

🖥️ 3. Run the Backend

Open a terminal inside the backend folder:

cd backend


Install dependencies:

npm install


Start the backend:

npm run dev


or if that fails:

npm start


✅ You should see something like:

Server running on port 4000
MongoDB connected




🌐 4. Run the Frontend

Open a new terminal (keep the backend running).

Navigate to the frontend folder:

cd frontend


Install dependencies:

npm install


Start the React app:

npm run dev


✅ You’ll see:

VITE v5.x.x  ready in 300ms
Local:   http://localhost:5173/


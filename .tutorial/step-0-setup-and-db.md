
**Step 1: Project Setup**

1.  **Create a new Next.js project:**

```bash
npx create-next-app cozy-reads-inventory
cd cozy-reads-inventory
```

2.  **Install dependencies:**

```bash
# Production Dependencies:
npm install mongodb next-auth @next-auth/mongodb-adapter dotenv

✔ Would you like to use TypeScript? … No
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … No 
✔ Would you like your code inside a `src/` directory? … No
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to use Turbopack for `next dev`? … Yes
? Would you like to customize the import alias (`@/*` by default)? › Yes

# Development Dependencies:
npm install -D @eslint/eslintrc @types/node @types/react autoprefixer eslint eslint-config-next postcss tailwindcss @tailwindcss/postcss
```

Add your Google Client ID, Client Secret, and NextAuth Secret to `.env.local`.

```bash
MONGODB_URI=your_mongodb_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
```

3.  **Set up MongoDB:**
* Create a MongoDB database (either local or using MongoDB Atlas).
* Add your MongoDB connection URI to your `.env.local` file:

4.  **Create `lib/mongodb.js`:**

```javascript
import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI;
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MONGODB_URI environment variable');
}

client = new MongoClient(uri, options);
clientPromise = client.connect();
export default clientPromise;
```

**Next Steps**

* We'll create the frontend UI for managing the inventory.
* We'll create styles.
* We'll implement authentication.
* We'll create middleware.js
* We'll seed the database 

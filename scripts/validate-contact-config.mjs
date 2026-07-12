import "dotenv/config";
import { resolveContactProvider } from "../src/api/contactProvider.js";

const provider = resolveContactProvider(process.env);
console.log(`Contact provider validated: ${provider}`);

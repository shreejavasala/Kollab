import { Inngest } from "inngest";
import User from "../models/User.model.js";
import connectDB from "../configs/db.js";

await connectDB()

export const inngest = new Inngest({ id: "kollab-app" });

function getEmail(event) {
  return event.data.email_addresses?.[0]?.email_address ?? null;
}

// Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
  {id: 'sync-user-from-clerk'},
  {event: 'clerk/user.created'},
  async ({event}) => {
    const {id, first_name, last_name, image_url} = event.data

    const email = getEmail(event)
    if(!email) {
      return { error: true, message: "No email provided by Clerk" }
    }

    let username = email.split('@')[0]

    // Check availability of username
    const user = await User.findOne({username})

    if(user) {
      username = username + Math.floor(Math.random() * 10000)
    }

    const userData = {
      _id: id,
      email,
      full_name: first_name + " " + last_name,
      profile_picture: image_url,
      username
    }

    await User.create(userData)
    return { status: "created", userId: id }
  }
)

// Inngest Function to update user data in database
const syncUserUpdation = inngest.createFunction(
  {id: 'update-user-from-clerk'},
  {event: 'clerk/user.updated'},
  async ({event}) => {
    const {id, first_name, last_name, image_url} = event.data

    const email = getEmail(event);
    if (!email) {
      return { error: true, message: "No email provided by Clerk" };
    }

    const updatedUserData = {
      email,
      full_name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      profile_picture: image_url
    }
    
    await User.findByIdAndUpdate(id, updatedUserData)
    return { status: "updated", userId: id }
  }
)

// Inngest Function to delete user from database
const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-from-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event, step }) => {
    try {
      console.log("DELETE EVENT:", event);
      const { id } = event.data;

      const deletedUser = await User.findByIdAndDelete(id);

      console.log("DELETED USER:", deletedUser);

      return { status: "deleted", userId: id };
    } catch (error) {
      console.error("DELETE ERROR:", error);
      return { status: "error", message: error.message };
    }
  }
);


export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion
];

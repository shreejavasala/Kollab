import { Inngest } from "inngest";
import User from "../models/User.model.js";
import connectDB from "../configs/db.js";
import Connection from "../models/Connection.model.js";
import sendEmail from "../configs/nodemailer.js";

export const inngest = new Inngest({ id: "kollab-app" });

function getEmail(event) {
  return event.data.email_addresses?.[0]?.email_address ?? null;
}

// Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      await connectDB();
      const { id, first_name, last_name, image_url } = event.data;
      const email = getEmail(event);
      if (!email) return { error: true, message: "No email provided by Clerk" };

      let username = email.split("@")[0];
      const existingUser = await User.findOne({ username });
      if (existingUser) username += Math.floor(Math.random() * 10000);

      const userData = {
        _id: id,
        email,
        full_name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        profile_picture: image_url,
        username
      };

      await User.create(userData);
      return { status: "created", userId: id };
    } catch (error) {
      console.error("Error in syncUserCreation:", error);
      return { status: "error", message: error.message };
    }
  }
)

// Inngest Function to update user data in database
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    try {
      await connectDB();
      const { id, first_name, last_name, image_url } = event.data;
      const email = getEmail(event);
      if (!email) return { error: true, message: "No email provided by Clerk" };

      const updatedUserData = {
        email,
        full_name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        profile_picture: image_url
      };

      await User.findByIdAndUpdate(id, updatedUserData);
      return { status: "updated", userId: id };
    } catch (error) {
      console.error("Error in syncUserUpdation:", error);
      return { status: "error", message: error.message };
    }
  }
)

// Inngest Function to delete user from database
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      await connectDB();
      const { id } = event.data;
      const deletedUser = await User.findByIdAndDelete(id);
      return { status: "deleted", userId: id };
    } catch (error) {
      console.error("Error in syncUserDeletion:", error);
      return { status: "error", message: error.message };
    }
  }
);


// create Function to send Reminder whena a new connection request is added
const sendNewConnectionRequestReminder = inngest.createFunction(
  { id: 'send-new-connection-request-reminder' },
  { event: 'app/connection-request' },
  async ({ event, step }) => {
    try {
      await connectDB()
      const { connectionId } = event.data;

      await step.run('send-connection-request-mail', async () => {
        const connection = await Connection.findById(connectionId).populate('from_user_id, to_user_id')

        const subject = '👋 New Connection Request'
        const body = `
        <div style='font-family: Arial, sans-serif; padding: 20px;'>
        <h2>Hi ${connection.to_user_id.full_name},</h2>
        <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
        <p>Click <a href='${process.env.FRONTEND_URL}/connections}' style='color:#10b981;'>here</a> to accept or reject the request</p>
        <br />
        <p>Thanks, <br /> Kollab - Stay Connected</p>
        </div>
        `

        await sendEmail({
          to: connection.to_user_id.email,
          subject,
          body
        })

      })

      const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000)
      await step.sleepUntil('wait-for-24-hours', in24Hours)
      await step.run('send-connection-request-reminder', async () => {
        const connection = await Connection.findById(connectionId).populate('from_user_id, to_user_id')
        
        if(connection.status === 'accepted') {
          return { message: 'Already accepted' }
        }

        const subject = 'Pending Connection Request'
        const body = `
        <div style='font-family: Arial, sans-serif; padding: 20px;'>
        <h2>Hi ${connection.to_user_id.full_name},</h2>
        <p>You have a pending connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
        <p>Click <a href='${process.env.FRONTEND_URL}/connections}' style='color:#10b981;'>here</a> to accept or reject the request</p>
        <br />
        <p>Thanks, <br /> Kollab - Stay Connected</p>
        </div>
        `

        await sendEmail({
          to: connection.to_user_id.email,
          subject,
          body
        })
        
        return { message: 'Reminder sent.' }
      })
      
    } catch (error) {
      console.error("Error in sending reminder:", error);
      return { status: "error", message: error.message };
    }
  }

)

export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
  sendNewConnectionRequestReminder
];

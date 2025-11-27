import fs from 'fs'
import imagekit from '../configs/imageKit.js'
import Story from '../models/Story.model.js'
import User from '../models/User.model.js'
import { inngest } from '../Inngest/index.js'

export const addUserStory = async (req, res) => {
  try {
    const { userId } = req.auth()
    const { content, media_type, background_color } = req.body

    const media  = req.file
    let media_url = ''

    // upload media to imagekit
    if(media_type === 'image' || media_type === 'video') {
      const fileBuffer = fs.readFileSync(media.path)
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: media.originalname,
      })
      media_url = response.url
    }

    // create story
    const story = await Story.create({
      user: userId,
      content,
      media_url,
      media_type,
      background_color
    })

    // Schedule story deletion after 24 hours
    await inngest.send({
      name: 'app/story.delete',
      data: { storyId: story._id }
    })

    res.json({ success: true, message: 'Story created successfully' })

  } catch (error) {
    console.log(`Error in adding user story: ${error.message}`)
    res.json({ success: false, message: error.message })
  }
}

export const getStories = async (req, res) => {
  try {
    const { userId } = req.auth()
    const user = await User.findById(userId)

    // user connections and following
    const userIds = [userId, ...user.connections, ...user.following]

    const stories = await Story.find({ user: { $in: userIds }}).populate('user').sort({ createdAt: -1 })

    res.json({ success: true, stories })
  } catch (error) {
    console.log(`Error in fetching stories: ${error.message}`)
    res.json({ success: false, message: error.message })
  }
}
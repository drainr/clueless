const User = require('../models/user');
const { sendLobbyInvite } = require('../services/emailService');

// GET /api/friends — get my friends list
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'username email avatarUrl stats.gamesWon')
    res.json(user.friends)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/friends/requests — get pending incoming requests
const getRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json(user.friendRequests ?? [])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/friends/request/:username — send a friend request
const sendRequest = async (req, res) => {
  try {
    const target = await User.findOne({ username: req.params.username })
    if (!target) return res.status(404).json({ message: 'User not found' })
    if (target._id.equals(req.user._id))
      return res.status(400).json({ message: 'Cannot add yourself' })

    // Check already friends
    if (target.friends.includes(req.user._id))
      return res.status(400).json({ message: 'Already friends' })

    // Check request already sent
    const alreadySent = target.friendRequests?.some(
      (r) => r.from.equals(req.user._id)
    )
    if (alreadySent)
      return res.status(400).json({ message: 'Request already sent' })

    await User.findByIdAndUpdate(target._id, {
      $push: {
        friendRequests: {
          from:     req.user._id,
          username: req.user.username,
        }
      }
    })

    res.json({ message: 'Friend request sent' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/friends/accept/:userId — accept a request
const acceptRequest = async (req, res) => {
  try {
    const fromId = req.params.userId

    // Add each other as friends
    await User.findByIdAndUpdate(req.user._id, {
      $push: { friends: fromId },
      $pull: { friendRequests: { from: fromId } },
    })
    await User.findByIdAndUpdate(fromId, {
      $push: { friends: req.user._id },
    })

    res.json({ message: 'Friend added' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/friends/decline/:userId — decline a request
const declineRequest = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { friendRequests: { from: req.params.userId } }
    })
    res.json({ message: 'Request declined' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/friends/:userId — remove a friend
const removeFriend = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { friends: req.params.userId }
    })
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { friends: req.user._id }
    })
    res.json({ message: 'Friend removed' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/friends/invite-email — send lobby invite email to a friend
const sendInviteEmail = async (req, res) => {
  try {
    const { friendId, roomCode } = req.body
    const friend = await User.findById(friendId).select('email username')
    if (!friend) return res.status(404).json({ message: 'Friend not found' })

    const lobbyUrl = `${process.env.CLIENT_URL}/lobby/${roomCode}`

    await sendLobbyInvite({
      toEmail:      friend.email,
      fromUsername: req.user.username,
      roomCode,
      lobbyUrl,
    })

    res.json({ message: `Invite sent to ${friend.username}` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getFriends,
  getRequests,
  sendRequest,
  acceptRequest,
  declineRequest,
  removeFriend,
  sendInviteEmail,
}
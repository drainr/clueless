const express = require('express')
const router  = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  getFriends,
  getRequests,
  sendRequest,
  acceptRequest,
  declineRequest,
  removeFriend,
  sendInviteEmail,
} = require('../controllers/friendController')

router.get('/',                  protect, getFriends)
router.get('/requests',          protect, getRequests)
router.post('/request/:username',protect, sendRequest)
router.post('/accept/:userId',   protect, acceptRequest)
router.post('/decline/:userId',  protect, declineRequest)
router.delete('/:userId',        protect, removeFriend)
router.post('/invite-email',     protect, sendInviteEmail)

module.exports = router
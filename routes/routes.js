const express = require('express');
const {auth,loginUser,signupUser}= require("../controller/userc");
const {createWeeklist,updateWeeklist,deleteWeeklist,markUnmarkTask,getAllWeeklists } = require('../controller/weeklistc');

const router = express.Router();
router.post('/login', loginUser);
router.post('/signup', signupUser);
// Create a Weeklist
router.post('/creat', auth,createWeeklist);

// Update a Weeklist
router.put('/update/:id', auth, updateWeeklist);

// Delete a Weeklist
router.delete('/delete/:id', auth, deleteWeeklist);

// Mark/Unmark Task in Weeklist
router.put('/:id/task/:taskId', auth, markUnmarkTask);

// Get All Weeklists with Time Left
router.get('/getweklist', auth, getAllWeeklists);

module.exports = router;
 
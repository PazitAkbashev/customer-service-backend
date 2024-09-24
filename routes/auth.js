// מייבא את הספרייה express כדי ליצור נתיבים (routes) עבור האפליקציה
const express = require('express');

// יוצר מופע חדש של Router של Express, המאפשר להגדיר נתיבים (routes) מבודדים
const router = express.Router();

// מייבא את הספרייה bcrypt המשמשת להצפנת סיסמאות והשוואתן בצורה מאובטחת
const bcrypt = require('bcrypt');

// מייבא את הספרייה jsonwebtoken המשמשת ליצירת ואימות טוקנים (JWT) לאימות משתמשים
const jwt = require('jsonwebtoken');

// מייבא את המודל User שמייצג את טבלת המשתמשים בבסיס הנתונים
const User = require('../models/User');

// נתיב להתחברות משתמשים (login)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// נתיב לרישום משתמשים חדשים (register)
router.post('/register', async (req, res) => {
  // חילוץ username, email, ו-password מגוף הבקשה
  const { username, email, password } = req.body;

  try {
    // בדיקה אם המשתמש או כתובת האימייל כבר קיימים במערכת
    const existingUser = await User.findOne({ where: { username } });
    const existingEmail = await User.findOne({ where: { email } });

    // אם שם המשתמש קיים כבר, החזר שגיאה
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // אם כתובת האימייל כבר קיימת, החזר שגיאה
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // הצפנה של הסיסמה לפני שמירתה במסד הנתונים
    const hashedPassword = await bcrypt.hash(password, 10);

    // יצירת משתמש חדש ושמירתו בבסיס הנתונים
    const newUser = await User.create({
      username,
      email, // הוספת שדה האימייל
      password: hashedPassword,
    });

    // יצירת טוקן JWT עבור המשתמש החדש
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // החזרת תגובה ללקוח עם הטוקן והמשתמש החדש שנוצר
    res.status(201).json({ token, newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// מייצא את ה-Router כדי שניתן יהיה להשתמש בו בקובץ הראשי (server.js)
module.exports = router;
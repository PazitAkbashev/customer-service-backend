//middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // חילוץ הטוקן מהכותרת
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user data to the request
        next(); // Proceed to the next middleware
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;

// קובץ זה מכיל את הלוגיקה לבדוק את תקינות טוקן ה
//-JWT
// שנשלח מהלקוח. הוא יוודא שהמשתמש מזוהה לפני שהבקשה תמשיך לנתיב הרצוי.
// 
//	חשיבות: שכבת אבטחה נוספת המגנה על הנתיבים המוגנים בפרויקט שלך.
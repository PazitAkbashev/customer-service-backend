const { DataTypes } = require('sequelize'); 
// מייבא את המחלקה `DataTypes` מתוך ספריית `sequelize`. מחלקה זו מכילה סוגי נתונים לשדות המודל.

const sequelize = require('../config/db'); 
// מייבא את החיבור ל-Sequelize מתוך קובץ ההגדרות `db.js`, שם מוגדר החיבור למסד הנתונים.

const User = sequelize.define('User', { 
  // מגדיר את מודל ה-User באמצעות הפונקציה `define` של Sequelize. המודל מייצג טבלה במסד הנתונים בשם 'User'.

  username: {
    type: DataTypes.STRING, 
    // השדה 'username' מוגדר כטיפוס מחרוזת (STRING).

    allowNull: false, 
    // לא מאפשר ערך ריק בשדה זה (חובה להזין ערך).

    unique: true, 
    // מגדיר את השדה 'username' כשדה ייחודי. כלומר, לא ניתן ליצור משתמש עם שם משתמש שכבר קיים במערכת.
  },

  email: {
    type: DataTypes.STRING, 
    // השדה 'email' מוגדר כטיפוס מחרוזת (STRING).

    allowNull: false, 
    // לא מאפשר ערך ריק בשדה זה (חובה להזין ערך).

    unique: true, 
    // מגדיר את השדה 'email' כשדה ייחודי, כך שלא ניתן לרשום שני משתמשים עם אותו אימייל.
  },

  password: {
    type: DataTypes.STRING, 
    // השדה 'password' מוגדר כטיפוס מחרוזת (STRING) כדי לאחסן את הסיסמה המוצפנת של המשתמש.

    allowNull: false, 
    // לא מאפשר ערך ריק בשדה זה (חובה להזין סיסמה).
  },

  profilePicture: {
    type: DataTypes.STRING, 
    // השדה 'profilePicture' מוגדר כטיפוס מחרוזת (STRING) לאחסון קישור לתמונת הפרופיל של המשתמש.

    defaultValue: 'default-profile.png', 
    // מגדיר ערך ברירת מחדל לשדה 'profilePicture' במקרה והמשתמש לא מעלה תמונה משלו. הערך הוא 'default-profile.png'.
  },
});

module.exports = User; 
// מייצא את מודל ה-User כדי שניתן יהיה להשתמש בו בקבצים אחרים באפליקציה (למשל, בניהול משתמשים או אימות).
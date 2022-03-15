CREATE TABLE IF NOT EXISTS Users (
    userID TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    avatarAddress TEXT DEFAULT 'http://localhost:8000/usersAvatars/pic.jpg',
    passwordHash TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    emailVerified INTEGER DEFAULT 0, -- no boolean datatype in sqlite
    role INTEGER DEFAULT 0, -- default user role
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    bio TEXT DEFAULT 'My Bio isn''t ready yet!'
);

CREATE TABLE IF NOT EXISTS Friends (
    userID TEXT NOT NULL,
    friendID TEXT NOT NULL,
    dateFriended DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(userID, friendID)
);

CREATE TABLE IF NOT EXISTS Projects (
    projectID TEXT PRIMARY KEY,
    userID TEXT NOT NULL,
    projectName TEXT NOT NULL,
    projectType TEXT NOT NULL,
    genre  TEXT NOT NULL,
    projectDescription TEXT NOT NULL,
    public INTEGER DEFAULT 0 -- default not public
);

CREATE TABLE IF NOT EXISTS Characters (
    charID TEXT PRIMARY KEY,
    creator TEXT NOT NULL,    --should be populated at character creation with the userID currently logged in
    name TEXT NOT NULL,
    eyeColor TEXT NOT NULL,
    hairColor TEXT NOT NULL,
    skinColor TEXT NOT NULL,
    feetTall INTEGER NOT NULL CHECK(feetTall >=0), -- can be 0 feet some inches(this allows for 0'0" height)
    inchesTall INTEGER NOT NULL CHECK(inchesTall >= 0 AND inchesTall <= 12),
    gender TEXT CHECK (gender = 'Male' or gender = 'Female'),
    characterTraits TEXT DEFAULT "",
    backstory TEXT DEFAULT "",
    charAvatar TEXT DEFAUlT NULL, -- upload an image, we dont facilitate 3d rendering at this point
    FOREIGN KEY (creator) REFERENCES Users(userID)
        ON DELETE CASCADE   --if a user account is deleted, all their characters should also be deleted
);

CREATE TABLE IF NOT EXISTS StarsIn (
    projectID TEXT,
    charID TEXT,
    FOREIGN KEY (projectID) REFERENCES Projects(projectID)
        ON DELETE CASCADE,   --if a project is deleted, then the character can't be in that project
    FOREIGN KEY (charID) REFERENCES Characters(charID)
        ON DELETE CASCADE,   --if a character is deleted, then it can't be in that project
    PRIMARY KEY(projectID, charID)
);

CREATE TABLE IF NOT EXISTS Favorites (
    userID TEXT,
    charID TEXT,
    FOREIGN KEY (userID) REFERENCES Users(userID)
        ON DELETE CASCADE,   --if the user account doesn't exist anymore, they can't have any favorites
    FOREIGN KEY (charID) REFERENCES Characters(charID)
        ON DELETE CASCADE,   --if a user takes down a character, another user can't have it favorited
    PRIMARY KEY(userID, charID)
);
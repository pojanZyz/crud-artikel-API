const express = require("express");
const jwt = require("jsonwebtoken");
const blacklistToken = new Set();

const adminValidation = (req, res, next) => {
    if (!req.userData || req.userData.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Only admin can access this" });
    }
    next();
};

const accessValidation = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: "Token diperlukan" });
    }

    const token = authorization.split(" ")[1];

    if (blacklistToken.has(token)) {
        return res.status(401).json({ message: "Token sudah logout" });
    }

    try {
        const jwtDecode = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!jwtDecode || !jwtDecode.id || !jwtDecode.username || !jwtDecode.role) {
            return res.status(401).json({ message: "Invalid token data" });
        }

        req.userData = jwtDecode;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized", error });
    }
};

module.exports = { adminValidation, accessValidation };

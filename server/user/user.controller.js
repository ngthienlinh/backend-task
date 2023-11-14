'use strict';

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getUser = async (req, res) => {
  res.json(req.user)
}
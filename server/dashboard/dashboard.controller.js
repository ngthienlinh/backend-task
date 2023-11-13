'use strict';

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.findSessions = async (req, res) => {
  const currentPage = req.query.page || 1;
  const listPerPage = 5;
  const offset = (currentPage - 1) * listPerPage;

  const sessions = await prisma.session.findMany({
    userId: req.user.id,
    // include: { author: true },
    skip: offset,
    take: listPerPage,
  });

  res.json(sessions);
}
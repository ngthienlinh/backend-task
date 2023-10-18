'use strict';

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.findQuotes = async (req, res) => {
    const currentPage = req.query.page || 1;
    const listPerPage = 5;
    const offset = (currentPage - 1) * listPerPage;

    const allQuotes = await prisma.quote.findMany({
        include: { author: true },
        skip: offset,
        take: listPerPage,
    });

    res.json(allQuotes);
}
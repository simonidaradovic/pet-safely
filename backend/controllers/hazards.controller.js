import { prisma } from '../prismaClient.js';

const categories = new Set([
  'TICKS',
  'POISON',
  'AGGRESSIVE_DOG',
  'BROKEN_GLASS',
  'OTHER',
]);

const statuses = new Set(['OPEN', 'IN_PROGRESS', 'RESOLVED']);

const toNumber = (v) => (v === null || v === undefined ? null : Number(v));

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export const createHazard = async (req, res) => {
  try {
    const { title, description, category, lat, lng, address } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      lat === undefined ||
      lng === undefined
    ) {
      return res.status(400).json({
        message: 'title, description, category, lat, lng are required',
      });
    }
    if (!categories.has(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const latN = toNumber(lat);
    const lngN = toNumber(lng);
    if (Number.isNaN(latN) || Number.isNaN(lngN)) {
      return res.status(400).json({ message: 'lat/lng must be numbers' });
    }
    if (latN < -90 || latN > 90 || lngN < -180 || lngN > 180) {
      return res.status(400).json({ message: 'lat/lng out of range' });
    }

    const hazard = await prisma.hazard.create({
      data: {
        title: String(title).trim(),
        description: String(description).trim(),
        category,
        lat: latN,
        lng: lngN,
        address: address ? String(address).trim() : null,
        userId: req.user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        lat: true,
        lng: true,
        address: true,
        reportedAt: true,
        resolvedAt: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return res.status(201).json({ hazard });
  } catch (e) {
    return res.status(500).json({ message: 'Create hazard failed' });
  }
};

export const listHazards = async (req, res) => {
  try {
    const { category, status, minLat, maxLat, minLng, maxLng, days, q, limit } =
      req.query;

    const where = {};

    if (category && categories.has(String(category)))
      where.category = String(category);
    if (status && statuses.has(String(status))) where.status = String(status);

    const minLatN = toNumber(minLat);
    const maxLatN = toNumber(maxLat);
    const minLngN = toNumber(minLng);
    const maxLngN = toNumber(maxLng);

    if (![minLatN, maxLatN, minLngN, maxLngN].some((x) => x === null)) {
      where.lat = {
        gte: clamp(minLatN, -90, 90),
        lte: clamp(maxLatN, -90, 90),
      };
      where.lng = {
        gte: clamp(minLngN, -180, 180),
        lte: clamp(maxLngN, -180, 180),
      };
    }

    const daysN = toNumber(days);
    if (daysN && !Number.isNaN(daysN) && daysN > 0) {
      const from = new Date();
      from.setDate(from.getDate() - Math.min(daysN, 365));
      where.reportedAt = { gte: from };
    }

    if (q) {
      const query = String(q).trim();
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
      ];
    }

    const take = Math.min(toNumber(limit) || 200, 500);

    const hazards = await prisma.hazard.findMany({
      where,
      orderBy: { reportedAt: 'desc' },
      take,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        lat: true,
        lng: true,
        address: true,
        reportedAt: true,
        resolvedAt: true,
        user: { select: { id: true, name: true } },
      },
    });

    return res.json({ hazards });
  } catch {
    return res.status(500).json({ message: 'List hazards failed' });
  }
};

export const getHazardById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
      return res.status(400).json({ message: 'Invalid id' });

    const hazard = await prisma.hazard.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        lat: true,
        lng: true,
        address: true,
        reportedAt: true,
        resolvedAt: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!hazard) return res.status(404).json({ message: 'Not found' });
    return res.json({ hazard });
  } catch {
    return res.status(500).json({ message: 'Get hazard failed' });
  }
};

export const updateHazard = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
      return res.status(400).json({ message: 'Invalid id' });

    const existing = await prisma.hazard.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Not found' });

    if (existing.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { title, description, category, lat, lng, address } = req.body;

    const data = {};

    if (title !== undefined) data.title = String(title).trim();
    if (description !== undefined)
      data.description = String(description).trim();

    if (category !== undefined) {
      if (!categories.has(String(category)))
        return res.status(400).json({ message: 'Invalid category' });
      data.category = String(category);
    }

    if (lat !== undefined) {
      const latN = toNumber(lat);
      if (Number.isNaN(latN) || latN < -90 || latN > 90)
        return res.status(400).json({ message: 'Invalid lat' });
      data.lat = latN;
    }

    if (lng !== undefined) {
      const lngN = toNumber(lng);
      if (Number.isNaN(lngN) || lngN < -180 || lngN > 180)
        return res.status(400).json({ message: 'Invalid lng' });
      data.lng = lngN;
    }

    if (address !== undefined)
      data.address = address ? String(address).trim() : null;

    const hazard = await prisma.hazard.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        lat: true,
        lng: true,
        address: true,
        reportedAt: true,
        resolvedAt: true,
        updatedAt: true,
      },
    });

    return res.json({ hazard });
  } catch {
    return res.status(500).json({ message: 'Update hazard failed' });
  }
};

export const setHazardStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (Number.isNaN(id))
      return res.status(400).json({ message: 'Invalid id' });
    if (!status || !statuses.has(String(status)))
      return res.status(400).json({ message: 'Invalid status' });

    const existing = await prisma.hazard.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Not found' });

    if (existing.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const hazard = await prisma.hazard.update({
      where: { id },
      data: {
        status: String(status),
        resolvedAt: String(status) === 'RESOLVED' ? new Date() : null,
      },
      select: {
        id: true,
        status: true,
        resolvedAt: true,
        updatedAt: true,
      },
    });

    return res.json({ hazard });
  } catch {
    return res.status(500).json({ message: 'Set status failed' });
  }
};

export const deleteHazard = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
      return res.status(400).json({ message: 'Invalid id' });

    const existing = await prisma.hazard.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Not found' });

    if (existing.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await prisma.hazard.delete({ where: { id } });
    return res.json({ message: 'Deleted' });
  } catch {
    return res.status(500).json({ message: 'Delete hazard failed' });
  }
};

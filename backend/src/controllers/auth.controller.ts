import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma.js";
import {
  registerSchema,
  loginSchema,
} from "../schemas/auth.schema.js";

export async function register(
  req: Request,
  res: Response,
): Promise<void> {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Dados inválidos",
      details: result.error.flatten().fieldErrors,
    });
    return;
  }

  const { name, email, password } = result.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    res.status(409).json({
      error: "E-mail já cadastrado",
    });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(201).json({
    user,
  });
}

export async function login(
  req: Request,
  res: Response,
): Promise<void> {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Dados inválidos",
      details: result.error.flatten().fieldErrors,
    });
    return;
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    res.status(401).json({
      error: "Credenciais inválidas",
    });
    return;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password,
  );

  if (!passwordMatches) {
    res.status(401).json({
      error: "Credenciais inválidas",
    });
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não foi definida.");
  }

  const session = jwt.sign(
    {
      userId: user.id,
    },
    secret,
    {
      expiresIn: "1h",
    },
  );

  res.status(200).json({
    session,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}

export async function me(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = (req as Request & { userId?: number }).userId;

  if (!userId) {
    res.status(401).json({
      error: "Não autorizado",
    });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    res.status(401).json({
      error: "Não autorizado",
    });
    return;
  }

  res.status(200).json({
    user,
  });
}

export async function logout(
  req: Request,
  res: Response,
): Promise<void> {
  res.status(200).json({
    message: "Logout realizado com sucesso",
  });
}

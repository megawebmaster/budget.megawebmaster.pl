import type { Account, Note } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Note } from "@prisma/client";

export function getNote({
  id,
  accountId,
}: Pick<Note, "id"> & {
  accountId: Account["id"];
}) {
  return prisma.note.findFirst({
    where: { id, accountId },
  });
}

export function getNoteListItems({ accountId }: { accountId: Account["id"] }) {
  return prisma.note.findMany({
    where: { accountId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createNote({
  body,
  title,
  accountId,
}: Pick<Note, "body" | "title"> & {
  accountId: Account["id"];
}) {
  return prisma.note.create({
    data: {
      title,
      body,
      account: {
        connect: {
          id: accountId,
        },
      },
    },
  });
}

export function deleteNote({
  id,
  accountId,
}: Pick<Note, "id"> & { accountId: Account["id"] }) {
  return prisma.note.deleteMany({
    where: { id, accountId },
  });
}

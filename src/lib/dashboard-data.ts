import type { Document, ObjectId } from "mongodb";
import { getMongoDatabase } from "@/lib/mongodb";

export type DashboardServiceRecord = {
  id: string;
  title: string;
  category: string;
  price: number | null;
  duration: string;
  status: string;
  available: boolean;
  publishedAt: string | null;
  technicianId: string | null;
};

export type DashboardAccountRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string | null;
};

type ServiceDocument = Document & {
  _id?: ObjectId | string;
  id?: string;
  title?: string;
  category?: string;
  price?: number;
  duration?: string;
  status?: string;
  available?: boolean;
  publishedAt?: Date | string;
  technicianId?: string;
};

type AccountDocument = Document & {
  _id: ObjectId | string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: Date | string;
};

function toIsoDate(value: Date | string | undefined) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toDashboardService(record: ServiceDocument): DashboardServiceRecord {
  return {
    id: record.id || (record._id ? String(record._id) : ""),
    title: record.title ?? "Untitled service",
    category: record.category ?? "Uncategorized",
    price: typeof record.price === "number" ? record.price : null,
    duration: record.duration ?? "—",
    status: record.status ?? "unknown",
    available: record.available === true,
    publishedAt: toIsoDate(record.publishedAt),
    technicianId: record.technicianId ?? null,
  };
}

function toDashboardAccount(record: AccountDocument): DashboardAccountRecord {
  return {
    id: record.id || String(record._id),
    name: record.name ?? "",
    email: record.email ?? "",
    role: record.role ?? "customer",
    createdAt: toIsoDate(record.createdAt),
  };
}

export async function getTechnicianServices(technicianId: string) {
  const collection = (await getMongoDatabase()).collection<ServiceDocument>("services");
  const records = await collection
    .find({ technicianId })
    .sort({ publishedAt: -1, _id: -1 })
    .limit(200)
    .toArray();
  return records.map(toDashboardService);
}

export async function getAdminServices() {
  const collection = (await getMongoDatabase()).collection<ServiceDocument>("services");
  const records = await collection
    .find({})
    .sort({ publishedAt: -1, _id: -1 })
    .limit(200)
    .toArray();
  return records.map(toDashboardService);
}

export async function getAdminAccounts() {
  const collection = (await getMongoDatabase()).collection<AccountDocument>("user");
  const records = await collection
    .find({}, { projection: { name: 1, email: 1, role: 1, createdAt: 1 } })
    .sort({ createdAt: -1, _id: -1 })
    .limit(200)
    .toArray();
  return records.map(toDashboardAccount);
}

export async function getAdminDashboardCounts() {
  const database = await getMongoDatabase();
  const [accounts, services, pendingServices] = await Promise.all([
    database.collection("user").countDocuments({}),
    database.collection("services").countDocuments({}),
    database.collection("services").countDocuments({ status: "pending" }),
  ]);
  return { accounts, services, pendingServices };
}

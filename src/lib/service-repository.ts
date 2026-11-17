import { ObjectId, type Document, type Filter, type Sort } from "mongodb";
import {
  serviceCategories,
  type RepairService,
  type ServiceCategory,
} from "@/lib/services";
import { getMongoDatabase } from "@/lib/mongodb";

export type ServiceSort = "newest" | "price-asc" | "price-desc";

export type ServiceListParams = {
  q: string;
  category: ServiceCategory | "";
  serviceMode: string;
  sort: ServiceSort;
  page: number;
  limit: number;
};

export type ServiceListResult = {
  services: RepairService[];
  total: number;
  page: number;
  limit: number;
  serviceModes: string[];
};

type ServiceRecord = Document & {
  _id: ObjectId;
  id?: string;
  title: string;
  category: ServiceCategory;
  shortDescription: string;
  description: string;
  price: number;
  duration: string;
  status: string;
  available: boolean;
  publishedAt: Date | string;
  image: string;
  serviceMode?: string;
};

const publicServiceFilter: Filter<ServiceRecord> = {
  status: "approved",
  available: true,
};

export function parseServiceListParams(
  input: Record<string, string | string[] | undefined>,
): { params: ServiceListParams } | { error: string } {
  const single = (key: string) => {
    const value = input[key];
    if (Array.isArray(value)) return null;
    return value?.trim() ?? "";
  };

  const q = single("q");
  const category = single("category");
  const serviceMode = single("serviceMode");
  const sort = single("sort") || "newest";
  const pageValue = single("page") || "1";
  const limitValue = single("limit") || "6";

  if (q === null || category === null || serviceMode === null || sort === null || pageValue === null || limitValue === null) {
    return { error: "Each query parameter may only be provided once." };
  }
  if (q.length > 100) return { error: "Search text must be 100 characters or fewer." };
  if (category && !serviceCategories.includes(category as ServiceCategory)) {
    return { error: "Choose a valid service category." };
  }
  if (!["newest", "price-asc", "price-desc"].includes(sort)) {
    return { error: "Sort must be newest, price-asc, or price-desc." };
  }
  if (serviceMode.length > 60) return { error: "Service mode must be 60 characters or fewer." };

  const page = Number(pageValue);
  const limit = Number(limitValue);
  if (!Number.isInteger(page) || page < 1) return { error: "Page must be a positive integer." };
  if (!Number.isInteger(limit) || limit < 1 || limit > 24) {
    return { error: "Limit must be an integer between 1 and 24." };
  }

  return {
    params: {
      q,
      category: category as ServiceCategory | "",
      serviceMode,
      sort: sort as ServiceSort,
      page,
      limit,
    },
  };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toRepairService(record: ServiceRecord): RepairService {
  const publishedAt =
    record.publishedAt instanceof Date
      ? record.publishedAt.toISOString()
      : new Date(record.publishedAt).toISOString();

  return {
    id: record.id || record._id.toHexString(),
    title: record.title,
    category: record.category,
    shortDescription: record.shortDescription,
    description: record.description,
    price: record.price,
    duration: record.duration,
    status: "approved",
    available: true,
    publishedAt,
    image: record.image,
    ...(record.serviceMode ? { serviceMode: record.serviceMode } : {}),
  };
}

function createFilter(params: ServiceListParams): Filter<ServiceRecord> {
  const filter: Filter<ServiceRecord> = { ...publicServiceFilter };

  if (params.category) filter.category = params.category;
  if (params.serviceMode) filter.serviceMode = params.serviceMode;
  if (params.q) {
    const search = new RegExp(escapeRegex(params.q), "i");
    filter.$or = [{ title: search }, { category: search }];
  }

  return filter;
}

function sortFor(sort: ServiceSort): Sort {
  if (sort === "price-asc") return { price: 1, _id: 1 };
  if (sort === "price-desc") return { price: -1, _id: -1 };
  return { publishedAt: -1, _id: -1 };
}

export async function getPublicServices(params: ServiceListParams): Promise<ServiceListResult> {
  const collection = (await getMongoDatabase()).collection<ServiceRecord>("services");
  const filter = createFilter(params);
  const [records, total, rawServiceModes] = await Promise.all([
    collection
      .find(filter)
      .sort(sortFor(params.sort))
      .skip((params.page - 1) * params.limit)
      .limit(params.limit)
      .toArray(),
    collection.countDocuments(filter),
    collection.distinct("serviceMode", publicServiceFilter),
  ]);
  const serviceModes = rawServiceModes
    .filter((mode): mode is string => typeof mode === "string" && mode.trim().length > 0)
    .sort((a, b) => a.localeCompare(b));

  return {
    services: records.map(toRepairService),
    total,
    page: params.page,
    limit: params.limit,
    serviceModes,
  };
}

export async function getPublicServiceById(id: string): Promise<RepairService | null> {
  const collection = (await getMongoDatabase()).collection<ServiceRecord>("services");
  const lookup: Filter<ServiceRecord>[] = [{ id }];
  if (ObjectId.isValid(id)) lookup.push({ _id: new ObjectId(id) });

  const record = await collection.findOne({
    ...publicServiceFilter,
    $or: lookup,
  });

  return record ? toRepairService(record) : null;
}

export async function getRelatedPublicServices(service: RepairService, limit = 3) {
  const collection = (await getMongoDatabase()).collection<ServiceRecord>("services");
  const records = await collection
    .find({ ...publicServiceFilter, category: service.category })
    .sort({ publishedAt: -1, _id: -1 })
    .limit(limit + 1)
    .toArray();

  return records
    .map(toRepairService)
    .filter((item) => item.id !== service.id)
    .slice(0, limit);
}

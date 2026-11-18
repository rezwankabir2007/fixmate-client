import { ObjectId, type Filter, type Sort } from "mongodb";

import {
  serviceCategories,
  type RepairService,
  type ServiceCategory,
} from "@/lib/services";

import { getMongoDatabase } from "@/lib/mongodb";

// ---------------------------------------------
// Types
// ---------------------------------------------

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

// Actual MongoDB service document structure
type ServiceRecord = {
  _id: ObjectId;
  title: string;
  category: ServiceCategory;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: "approved" | "pending" | "rejected";
  isAvailable: boolean;
  createdAt: Date | string;
};

// ---------------------------------------------
// Public service filter
// ---------------------------------------------

const publicServiceFilter: Filter<ServiceRecord> = {
  approvalStatus: "approved",
  isAvailable: true,
};

// ---------------------------------------------
// Parse URL search parameters
// ---------------------------------------------

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

  if (
    q === null ||
    category === null ||
    serviceMode === null ||
    sort === null ||
    pageValue === null ||
    limitValue === null
  ) {
    return {
      error: "Each query parameter may only be provided once.",
    };
  }

  if (q.length > 100) {
    return {
      error: "Search text must be 100 characters or fewer.",
    };
  }

  if (
    category &&
    !serviceCategories.includes(category as ServiceCategory)
  ) {
    return {
      error: "Choose a valid service category.",
    };
  }

  if (!["newest", "price-asc", "price-desc"].includes(sort)) {
    return {
      error: "Sort must be newest, price-asc, or price-desc.",
    };
  }

  if (serviceMode.length > 60) {
    return {
      error: "Service mode must be 60 characters or fewer.",
    };
  }

  const page = Number(pageValue);
  const limit = Number(limitValue);

  if (!Number.isInteger(page) || page < 1) {
    return {
      error: "Page must be a positive integer.",
    };
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 24) {
    return {
      error: "Limit must be an integer between 1 and 24.",
    };
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

// ---------------------------------------------
// Escape regular expression characters
// ---------------------------------------------

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ---------------------------------------------
// Convert MongoDB document to frontend service
// ---------------------------------------------

function toRepairService(record: ServiceRecord): RepairService {
  const date =
    record.createdAt instanceof Date
      ? record.createdAt
      : new Date(record.createdAt);

  const publishedAt = Number.isNaN(date.getTime())
    ? new Date(0).toISOString()
    : date.toISOString();

  return {
    id: record._id.toHexString(),
    title: record.title,
    category: record.category,
    shortDescription: (record.description || "").slice(0, 140),
    description: record.description || "",
    price: Number(record.basePrice) || 0,
    duration: record.estimatedDuration || "Not specified",
    status: record.approvalStatus,
    available: record.isAvailable,
    publishedAt,
    image: record.image || "",
    serviceMode: record.serviceMode || "",
    serviceArea: record.serviceArea || "",
    technicianName: record.technicianName || "",
    technicianEmail: record.technicianEmail || "",
  } as RepairService;
}

// ---------------------------------------------
// Create MongoDB search and filter
// ---------------------------------------------

function createFilter(
  params: ServiceListParams,
): Filter<ServiceRecord> {
  const filter: Filter<ServiceRecord> = {
    ...publicServiceFilter,
  };

  if (params.category) {
    filter.category = params.category;
  }

  if (params.serviceMode) {
    filter.serviceMode = params.serviceMode;
  }

  if (params.q) {
    const search = new RegExp(escapeRegex(params.q), "i");

    filter.$or = [
      { title: search },
      { category: search },
      { description: search },
      { technicianName: search },
      { serviceArea: search },
    ];
  }

  return filter;
}

// ---------------------------------------------
// Sort services
// ---------------------------------------------

function sortFor(sort: ServiceSort): Sort {
  if (sort === "price-asc") {
    return {
      basePrice: 1,
      _id: 1,
    };
  }

  if (sort === "price-desc") {
    return {
      basePrice: -1,
      _id: -1,
    };
  }

  return {
    createdAt: -1,
    _id: -1,
  };
}

// ---------------------------------------------
// Get public services
// ---------------------------------------------

export async function getPublicServices(
  params: ServiceListParams,
): Promise<ServiceListResult> {
  const collection = (await getMongoDatabase()).collection<ServiceRecord>(
    "services",
  );

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
    .filter(
      (mode): mode is string =>
        typeof mode === "string" &&
        mode.trim().length > 0,
    )
    .sort((a, b) => a.localeCompare(b));

  return {
    services: records.map(toRepairService),
    total,
    page: params.page,
    limit: params.limit,
    serviceModes,
  };
}

// ---------------------------------------------
// Get one public service by ID
// ---------------------------------------------

export async function getPublicServiceById(
  id: string,
): Promise<RepairService | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = (await getMongoDatabase()).collection<ServiceRecord>(
    "services",
  );

  const record = await collection.findOne({
    ...publicServiceFilter,
    _id: new ObjectId(id),
  });

  return record ? toRepairService(record) : null;
}

// ---------------------------------------------
// Get related public services
// ---------------------------------------------

export async function getRelatedPublicServices(
  service: RepairService,
  limit = 3,
): Promise<RepairService[]> {
  const collection = (await getMongoDatabase()).collection<ServiceRecord>(
    "services",
  );

  const records = await collection
    .find({
      ...publicServiceFilter,
      category: service.category,
      _id: { $ne: new ObjectId(service.id) },
    })
    .sort({
      createdAt: -1,
      _id: -1,
    })
    .limit(limit)
    .toArray();

  return records.map(toRepairService);
}
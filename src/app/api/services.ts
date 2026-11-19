export interface Service {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  price: number;
  duration: string;
  status: string;
  available: boolean;
  publishedAt: string;
  image: string;
  serviceMode: string;
  serviceArea?: string;
  technicianName?: string;
  technicianEmail?: string;
}

export interface ServicesResponse {
  data: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ServiceQueryParams {
  q?: string;
  category?: string;
  serviceMode?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

const API_URL = process.env.FIXMATE_API_URL;

export async function getServicesResponse(
  params: ServiceQueryParams = {},
): Promise<ServicesResponse> {
  if (!API_URL) {
    throw new Error("FIXMATE_API_URL is not configured");
  }

  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.serviceMode) query.set("serviceMode", params.serviceMode);
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const queryString = query.toString();
  const baseUrl = API_URL.replace(/\/+$/, "");
  const url = `${baseUrl}/api/services${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }

  const result: ServicesResponse = await response.json();

  let items = (result.data || []).filter(
    (service) => service.status === "approved" && service.available,
  );

  if (params.category?.trim()) {
    const targetCategory = params.category.trim().toLowerCase();
    items = items.filter(
      (service) => service.category.toLowerCase() === targetCategory,
    );
  }

  if (params.serviceMode?.trim()) {
    const targetMode = params.serviceMode.trim().toLowerCase();
    items = items.filter(
      (service) => (service.serviceMode || "").toLowerCase() === targetMode,
    );
  }

  if (params.q?.trim()) {
    const targetQ = params.q.trim().toLowerCase();
    items = items.filter(
      (service) =>
        service.title.toLowerCase().includes(targetQ) ||
        service.category.toLowerCase().includes(targetQ) ||
        (service.shortDescription || "").toLowerCase().includes(targetQ) ||
        (service.description || "").toLowerCase().includes(targetQ),
    );
  }

  if (params.sort === "price-asc") {
    items.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (params.sort === "price-desc") {
    items.sort((a, b) => Number(b.price) - Number(a.price));
  } else {
    items.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 6;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const paginatedData = items.slice(start, start + limit);

  return {
    data: paginatedData,
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
  };
}

export async function getServices(): Promise<Service[]> {
  if (!API_URL) {
    throw new Error("FIXMATE_API_URL is not configured");
  }

  const response = await fetch(`${API_URL}/api/services`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }

  const result: ServicesResponse = await response.json();

  return (result.data || []).filter(
    (service) => service.status === "approved" && service.available,
  );
}

export async function getFeaturedServices(): Promise<Service[]> {
  const services = await getServices();

  return [...services]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 6);
}
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
}

interface ServicesResponse {
  data: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const API_URL = process.env.FIXMATE_API_URL;

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

  return result.data.filter(
    (service) => service.status === "approved" && service.available
  );
}

export async function getFeaturedServices(): Promise<Service[]> {
  const services = await getServices();

  return [...services]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    )
    .slice(0, 6);
}
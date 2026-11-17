export type ServiceCategory =
  | "Smartphone"
  | "Laptop & PC"
  | "AC"
  | "Refrigerator"
  | "TV"
  | "Washing Machine"
  | "Electrical"

export type ServiceStatus = "approved" | "pending" | "rejected"

export type RepairService = {
  id: string
  title: string
  category: ServiceCategory
  shortDescription: string
  description: string
  price: number
  duration: string
  status: ServiceStatus
  available: boolean
  publishedAt: string
  image: string
}

export const serviceCategories: ServiceCategory[] = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
]

export const services: RepairService[] = [
  {
    id: "smartphone-screen-repair",
    title: "Smartphone Screen Repair",
    category: "Smartphone",
    shortDescription: "Crystal-clear glass replacement for cracked or unresponsive screens.",
    description:
      "Restore device clarity and touch performance with certified display replacement, camera calibration, and a quality check on every repair.",
    price: 129,
    duration: "45-60 mins",
    status: "approved",
    available: true,
    publishedAt: "2026-11-17T09:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "laptop-battery-upgrade",
    title: "Laptop Battery Upgrade",
    category: "Laptop & PC",
    shortDescription: "Boost runtime and reduce charging issues with a premium battery replacement.",
    description:
      "Improve battery health, thermal efficiency, and charging stability with a professional swap and diagnostic test for your laptop.",
    price: 189,
    duration: "1-2 hours",
    status: "approved",
    available: true,
    publishedAt: "2026-11-15T11:15:00.000Z",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ac-servicing",
    title: "AC Maintenance & Gas Top-Up",
    category: "AC",
    shortDescription: "Cooling performance tune-ups for dusty, weak, or leaking air conditioners.",
    description:
      "Includes system check, cooling performance inspection, gas level verification, and safety testing to keep your AC efficient.",
    price: 149,
    duration: "1-3 hours",
    status: "approved",
    available: true,
    publishedAt: "2026-11-12T16:30:00.000Z",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "fridge-compressor-fix",
    title: "Refrigerator Compressor Fix",
    category: "Refrigerator",
    shortDescription: "Resolve cooling loss, odd noises, and unstable temperatures in your fridge.",
    description:
      "Diagnose compressor performance, fan operation, and thermostat behavior to restore consistent cooling and reduce energy waste.",
    price: 219,
    duration: "2-3 hours",
    status: "approved",
    available: true,
    publishedAt: "2026-11-10T13:45:00.000Z",
    image:
      "https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "tv-backlight-repair",
    title: "TV Backlight & Panel Repair",
    category: "TV",
    shortDescription: "Restore brightness, color balance, and screen clarity with panel-level repair.",
    description:
      "Our technicians identify backlight issues, display faults, and HDMI/board failures to bring your screen back to life.",
    price: 179,
    duration: "1-2 hours",
    status: "approved",
    available: true,
    publishedAt: "2026-11-08T10:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "washing-machine-drain-fix",
    title: "Washing Machine Drain Repair",
    category: "Washing Machine",
    shortDescription: "Clear drainage faults, leaks, and noisy spin issues for smooth laundry cycles.",
    description:
      "Includes pump inspection, hose check, leak diagnosis, anti-vibration testing, and a full wash cycle validation after repair.",
    price: 169,
    duration: "1-2 hours",
    status: "approved",
    available: true,
    publishedAt: "2026-11-06T08:45:00.000Z",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "electrical-fault-diagnosis",
    title: "Electrical Fault Diagnosis",
    category: "Electrical",
    shortDescription: "Safe tracing of wiring issues, power failure, and outlet faults.",
    description:
      "Professional electrical diagnostics for switches, sockets, circuits, and safety checks to prevent recurring failures.",
    price: 139,
    duration: "1-2 hours",
    status: "approved",
    available: true,
    publishedAt: "2026-11-04T15:30:00.000Z",
    image:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "pc-performance-optimization",
    title: "PC Performance Optimization",
    category: "Laptop & PC",
    shortDescription: "Tune and upgrade aging desktops for smoother operation and faster startup.",
    description:
      "Clean startup processes, evaluate hardware strain, and optimize the system with practical improvement recommendations.",
    price: 99,
    duration: "1 hour",
    status: "pending",
    available: false,
    publishedAt: "2026-11-03T12:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
  },
]

export function getApprovedAvailableServices() {
  return [...services]
    .filter((service) => service.status === "approved" && service.available)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getServiceById(id: string) {
  return services.find((service) => service.id === id)
}

export function getCategorySummary() {
  const summary = serviceCategories.map((category) => ({
    category,
    count: services.filter((service) => service.category === category && service.status === "approved" && service.available).length,
  }))

  return summary
}

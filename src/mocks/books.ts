import type { Book } from "@/types/book";

const cover = (slug: string): string => `/assets/images/book-cover-${slug}.jpg`;

/**
 * Fake catalog data for Homework 1.
 * Page 1 (popularity 100-93) is the Figma "Default" frame, in frame order.
 * Pages 2-3 add companion titles that share the page-1 cover art so paging is real and no card
 * looks broken. The designed "Cover unavailable" state is reached with ?state=missing-cover or
 * when an image fails to load.
 */
export const MOCK_BOOKS: readonly Book[] = [
  // ---- Page 1: as designed ----
  { id: "clean-code-in-java", title: "Clean Code in Java", author: "Ananya Rao", category: "Java", priceInr: 999, rating: 4.8, ratingCount: 1284, coverUrl: cover("clean-code-in-java"), publishedAt: "2025-11-04", popularity: 100 },
  { id: "mastering-react-19", title: "Mastering React 19", author: "Kabir Mehta", category: "JavaScript", priceInr: 1299, rating: 4.7, ratingCount: 986, coverUrl: cover("mastering-react-19"), publishedAt: "2026-02-18", popularity: 99 },
  { id: "system-design-interview-handbook", title: "System Design Interview Handbook", author: "Maya Srinivasan", category: "System Design", priceInr: 1499, rating: 4.9, ratingCount: 2418, coverUrl: cover("system-design-interview-handbook"), publishedAt: "2025-06-30", popularity: 98 },
  { id: "docker-kubernetes-in-practice", title: "Docker & Kubernetes in Practice", author: "Rohan Iyer", category: "DevOps", priceInr: 1299, rating: 4.6, ratingCount: 742, coverUrl: cover("docker-kubernetes-in-practice"), publishedAt: "2025-09-12", popularity: 97 },
  { id: "python-for-data-engineers", title: "Python for Data Engineers", author: "Neha Kulkarni", category: "Python", priceInr: 999, rating: 4.8, ratingCount: 1106, coverUrl: cover("python-for-data-engineers"), publishedAt: "2026-01-22", popularity: 96 },
  { id: "typescript-patterns-at-scale", title: "TypeScript Patterns at Scale", author: "Arjun Desai", category: "JavaScript", priceInr: 799, rating: 4.5, ratingCount: 628, coverUrl: cover("typescript-patterns-at-scale"), publishedAt: "2025-04-08", popularity: 95 },
  { id: "building-reliable-llm-applications", title: "Building Reliable LLM Applications", author: "Ishita Banerjee", category: "AI/ML", priceInr: 1499, rating: 4.7, ratingCount: 834, coverUrl: cover("building-reliable-llm-applications"), publishedAt: "2026-03-10", popularity: 94 },
  { id: "postgresql-performance-field-guide", title: "PostgreSQL Performance Field Guide", author: "Vikram Shah", category: "Databases", priceInr: 799, rating: 4.6, ratingCount: 519, coverUrl: cover("postgresql-performance-field-guide"), publishedAt: "2025-08-01", popularity: 93 },
  // ---- Page 2: companion volumes that share the same cover art ----
  { id: "clean-code-in-java-workbook", title: "Clean Code in Java: Workbook", author: "Ananya Rao", category: "Java", priceInr: 599, rating: 4.6, ratingCount: 312, coverUrl: cover("clean-code-in-java"), publishedAt: "2026-04-02", popularity: 80 },
  { id: "mastering-react-19-server-components", title: "Mastering React 19: Server Components", author: "Kabir Mehta", category: "JavaScript", priceInr: 1099, rating: 4.6, ratingCount: 401, coverUrl: cover("mastering-react-19"), publishedAt: "2026-05-14", popularity: 79 },
  { id: "system-design-interview-handbook-vol-2", title: "System Design Interview Handbook, Vol. 2", author: "Maya Srinivasan", category: "System Design", priceInr: 1499, rating: 4.8, ratingCount: 1037, coverUrl: cover("system-design-interview-handbook"), publishedAt: "2026-01-09", popularity: 78 },
  { id: "docker-kubernetes-in-practice-labs", title: "Docker & Kubernetes in Practice: Labs", author: "Rohan Iyer", category: "DevOps", priceInr: 899, rating: 4.4, ratingCount: 288, coverUrl: cover("docker-kubernetes-in-practice"), publishedAt: "2025-12-03", popularity: 77 },
  { id: "python-for-data-engineers-exercises", title: "Python for Data Engineers: Exercises", author: "Neha Kulkarni", category: "Python", priceInr: 699, rating: 4.5, ratingCount: 254, coverUrl: cover("python-for-data-engineers"), publishedAt: "2026-02-27", popularity: 76 },
  { id: "typescript-patterns-at-scale-case-studies", title: "TypeScript Patterns at Scale: Case Studies", author: "Arjun Desai", category: "JavaScript", priceInr: 899, rating: 4.4, ratingCount: 197, coverUrl: cover("typescript-patterns-at-scale"), publishedAt: "2025-10-19", popularity: 75 },
  { id: "building-reliable-llm-applications-evaluation", title: "Building Reliable LLM Applications: Evaluation", author: "Ishita Banerjee", category: "AI/ML", priceInr: 1199, rating: 4.6, ratingCount: 366, coverUrl: cover("building-reliable-llm-applications"), publishedAt: "2026-05-28", popularity: 74 },
  { id: "postgresql-performance-field-guide-indexing", title: "PostgreSQL Performance Field Guide: Indexing", author: "Vikram Shah", category: "Databases", priceInr: 699, rating: 4.7, ratingCount: 241, coverUrl: cover("postgresql-performance-field-guide"), publishedAt: "2026-03-21", popularity: 73 },
  // ---- Page 3: more companion titles (every book has cover art; the missing-cover state is reached with ?state=missing-cover) ----
  { id: "clean-code-in-java-refactoring-katas", title: "Clean Code in Java: Refactoring Katas", author: "Devika Nair", category: "Java", priceInr: 1199, rating: 4.5, ratingCount: 173, coverUrl: cover("clean-code-in-java"), publishedAt: "2026-06-05", popularity: 60 },
  { id: "mastering-react-19-testing-playbook", title: "Mastering React 19: Testing Playbook", author: "Farhan Qureshi", category: "JavaScript", priceInr: 999, rating: 4.3, ratingCount: 142, coverUrl: cover("mastering-react-19"), publishedAt: "2026-04-19", popularity: 59 },
  { id: "python-for-data-engineers-pipelines-cookbook", title: "Python for Data Engineers: Pipelines Cookbook", author: "Pooja Menon", category: "Python", priceInr: 899, rating: 4.4, ratingCount: 119, coverUrl: cover("python-for-data-engineers"), publishedAt: "2026-05-02", popularity: 58 },
  { id: "docker-kubernetes-in-practice-security", title: "Docker & Kubernetes in Practice: Security", author: "Siddharth Rao", category: "DevOps", priceInr: 1099, rating: 4.2, ratingCount: 97, coverUrl: cover("docker-kubernetes-in-practice"), publishedAt: "2026-06-21", popularity: 57 },
  { id: "designing-event-driven-systems", title: "Designing Event-Driven Systems", author: "Maya Srinivasan", category: "System Design", priceInr: 1299, rating: 4.7, ratingCount: 388, coverUrl: cover("system-design-interview-handbook"), publishedAt: "2025-05-17", popularity: 56 },
  { id: "kubernetes-operators-explained", title: "Kubernetes Operators Explained", author: "Rohan Iyer", category: "DevOps", priceInr: 1199, rating: 4.5, ratingCount: 156, coverUrl: cover("docker-kubernetes-in-practice"), publishedAt: "2025-07-23", popularity: 55 },
  { id: "practical-retrieval-augmented-generation", title: "Practical Retrieval-Augmented Generation", author: "Ishita Banerjee", category: "AI/ML", priceInr: 1299, rating: 4.5, ratingCount: 203, coverUrl: cover("building-reliable-llm-applications"), publishedAt: "2026-06-30", popularity: 54 },
  { id: "sql-tuning-patterns", title: "SQL Tuning Patterns", author: "Vikram Shah", category: "Databases", priceInr: 699, rating: 4.4, ratingCount: 131, coverUrl: cover("postgresql-performance-field-guide"), publishedAt: "2025-03-14", popularity: 53 },
];

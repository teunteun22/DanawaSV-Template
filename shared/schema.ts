import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const radarModels = pgTable("radar_models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  month: varchar("month", { length: 10 }).notNull(),
  nation: varchar("nation", { length: 10 }).notNull(),
  modelName: text("model_name").notNull(),
  brand: text("brand").notNull(),
  sales: integer("sales").notNull(),
  prevSales: integer("prev_sales").notNull(),
  momAbs: integer("mom_abs").notNull(),
  momPct: real("mom_pct").notNull(),
  currentRank: integer("current_rank").notNull(),
  prevRank: integer("prev_rank"),
  rankChange: integer("rank_change"),
  score: real("score").notNull(),
  danawaUrl: text("danawa_url").notNull(),
});

export const insertRadarModelSchema = createInsertSchema(radarModels).omit({
  id: true,
});

export type InsertRadarModel = z.infer<typeof insertRadarModelSchema>;
export type RadarModel = typeof radarModels.$inferSelect;

export const radarModelSchema = z.object({
  id: z.string(),
  month: z.string(),
  nation: z.enum(["domestic", "import"]),
  modelName: z.string(),
  brand: z.string(),
  sales: z.number(),
  prevSales: z.number(),
  momAbs: z.number(),
  momPct: z.number(),
  currentRank: z.number(),
  prevRank: z.number().nullable(),
  rankChange: z.number().nullable(),
  score: z.number(),
  danawaUrl: z.string(),
});

export type RadarModelData = z.infer<typeof radarModelSchema>;

export const radarQuerySchema = z.object({
  month: z.string().optional(),
  nation: z.enum(["domestic", "import"]).optional(),
  minSales: z.number().optional(),
  excludeNewEntries: z.boolean().optional(),
});

export type RadarQuery = z.infer<typeof radarQuerySchema>;

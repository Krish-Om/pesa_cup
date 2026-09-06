import { eq } from "drizzle-orm";
import { dbSession } from "../../config/database";
import {
  registrations,
  type Registration,
  type RegistrationPayload,
} from "./registrations.schema";

export class RegistrationsRepository {
  async create(data: RegistrationPayload): Promise<Registration> {
    const [result] = await dbSession
      .insert(registrations)
      .values(data)
      .returning();
    if (!result) throw new Error("Failed to create registration");
    return result;
  }

  async getById(id: number): Promise<Registration | null> {
    const [result] = await dbSession
      .select()
      .from(registrations)
      .where(eq(registrations.id, id));
    return result ?? null;
  }

  async getAll(): Promise<Registration[]> {
    return dbSession.select().from(registrations).all();
  }

  async update(
    id: number,
    data: Partial<RegistrationPayload>,
  ): Promise<Registration> {
    const [result] = await dbSession
      .update(registrations)
      .set(data)
      .where(eq(registrations.id, id))
      .returning();
    if (!result) throw new Error("Failed to update registration");
    return result;
  }
}

export const registrationsRepository = new RegistrationsRepository();

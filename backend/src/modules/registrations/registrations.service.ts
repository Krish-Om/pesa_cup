import { eq } from "drizzle-orm";
import { dbSession } from "../../config/database";
import { AppError, NotFoundError } from "../../utils/app-error";
import { registrations, standings, teams } from "../../db/schema";
import {
  approveRegistrationSchema,
  insertRegistrationSchema,
  type Registration,
  type RegistrationInput,
} from "./registrations.schema";
import {
  RegistrationsRepository,
  registrationsRepository,
} from "./registrations.repository";

export class RegistrationsService {
  constructor(
    private readonly repo: RegistrationsRepository = registrationsRepository,
  ) {}

  async create(payload: RegistrationInput): Promise<Registration> {
    const validated = insertRegistrationSchema.parse(payload);
    return this.repo.create({
      ...validated,
      status: "PENDING",
      teamId: null,
      rejectionReason: null,
    });
  }

  async getAll(): Promise<Registration[]> {
    return this.repo.getAll();
  }

  async approve(id: number, payload: unknown): Promise<Registration> {
    const { group } = approveRegistrationSchema.parse(payload ?? {});

    return dbSession.transaction(async (tx) => {
      const [registration] = await tx
        .select()
        .from(registrationsTable)
        .where(eq(registrationsTable.id, id));

      if (!registration)
        throw new NotFoundError(`Registration with ID ${id} not found`);
      if (registration.status !== "PENDING") {
        throw new AppError("Only pending registrations can be approved", 409);
      }

      const [team] = await tx
        .insert(teams)
        .values({
          name: registration.teamName,
          captainName: registration.captainName,
          captainEmail: registration.captainEmail,
          captainPhone: registration.captainPhone,
        })
        .returning();
      if (!team) throw new Error("Failed to create team during approval");

      const [updated] = await tx
        .update(registrationsTable)
        .set({ status: "APPROVED", teamId: team.id, rejectionReason: null })
        .where(eq(registrationsTable.id, id))
        .returning();
      if (!updated) throw new Error("Failed to approve registration");

      await tx.insert(standings).values({
        tournamentId: registration.tournamentId,
        teamId: team.id,
        group,
      });

      return updated;
    });
  }
}

export const registrationsService = new RegistrationsService();

import { count,eq } from "drizzle-orm";
import { dbSession } from "../../config/database";
import { AppError, NotFoundError } from "../../utils/app-error";
import { registrations, standings, teams } from "../../db/schema";
import {
  approveRegistrationSchema,
  insertRegistrationSchema,
  rejectRegistrationSchema,
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
      const [registrationRecord] = await tx
        .select()
        .from(registrations)
        .where(eq(registrations.id, id));

      if (!registrationRecord)
        throw new NotFoundError(`Registration with ID ${id} not found`);
      if (registrationRecord.status !== "PENDING") {
        throw new AppError("Only pending registrations can be approved", 409);
      }

      const [team] = await tx
        .insert(teams)
        .values({
          name: registrationRecord.teamName,
          batchYear: registrationRecord.batchYear,
          captainName: registrationRecord.captainName,
          captainEmail: registrationRecord.captainEmail,
          captainPhone: registrationRecord.captainPhone,
        })
        .returning();
      if (!team) throw new Error("Failed to create team during approval");

      const [updated] = await tx
        .update(registrations)
        .set({ status: "APPROVED", teamId: team.id, rejectionReason: null })
        .where(eq(registrations.id, id))
        .returning();
      if (!updated) throw new Error("Failed to approve registration");

      await tx.insert(standings).values({
        tournamentId: registrationRecord.tournamentId,
        teamId: team.id,
        group,
      });

      return updated;
    });
  }

  async reject(id: number, payload: unknown): Promise<Registration> {
    const { rejectionReason } = rejectRegistrationSchema.parse(payload ?? {});

    const registrationRecord = await this.repo.getById(id);
    if (!registrationRecord)
      throw new NotFoundError(`Registration with ID ${id} not found`);
    if (registrationRecord.status !== "PENDING") {
      throw new AppError("Only pending registrations can be rejected", 409);
    }

    return this.repo.update(id, {
      status: "REJECTED",
      rejectionReason: rejectionReason ?? null,
    });
  }
}

export const registrationsService = new RegistrationsService();

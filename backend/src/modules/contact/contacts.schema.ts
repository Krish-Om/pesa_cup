import {z} from "zod";

const ContactMessageSchema = z.object({
  id: z.int(),
  name: z.string(),
  email: z.email(),
  subject: z.string(),
  message: z.string(),
  createdAt: z.date().default(new Date()),
  status: z.enum(["new", "read", "archived"]).default("new"),
});
export default ContactMessageSchema;